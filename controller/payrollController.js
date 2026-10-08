const mongoose = require('mongoose');
const Deduction = require('../models/deduction.js');
const Payroll = require('../models/Payroll.js');
const Employee = require('../models/employee.js');
const Salary = require('../models/salary.js');

const PERIOD = /^20[0-9]{2}-(0[1-9]|1[0-2])$/;

const companyOf = (req) => {
    const id = req.user?.companyId;
    if (!id) {
        const error = new Error('Your account has no company linked');
        error.status = 403; throw error;
    }
    return String(id);
};

const userOf = (req) => {
    const id = req.user.userId || req.user._id || req.user.id;

    if (!id) {
        const error = new Error('Your login token has no user ID');
        error.status = 401; throw error;
    }
    return String(id);
};
const kobo = (n) => Math.round(Number(n) * 100);
const naira = (k) => k / 100;
const day = (d) => d.toISOString().slice(0, 10);
const hasError = (e) => e.issues.some((i) => i.level === 'error');

const send = (res, code, message, data) =>
    res.status(code).json({ success: code < 400, message, ...(data && { data }) });
const wrap = (fn) => (req, res) =>
    fn(req, res).catch((err) => {
        if (err.status) return send(res, err.status, err.message);
        console.error(err);
        send(res, 500, 'Server error');
    });

const findPayroll = (req, id) =>
    mongoose.isValidObjectId(id) ? Payroll.findOne({ _id: id, companyId: companyOf(req) }) : null;

function priceLine(gross, list = []) {
    const deductions = [];
    const issues = [];
    for (const d of list) {
        const amountKobo = kobo(d.amount);
        if (!d.name || !(amountKobo >= 0)) {
            issues.push({ level: 'error', message: `Invalid deduction "${d.name || ''}"` });
            continue;
        }
        deductions.push({ name: d.name, amountKobo });
    }
    const total = deductions.reduce((sum, d) => sum + d.amountKobo, 0);
    if (total > gross) issues.push({ level: 'error', message: 'Deductions are more than gross pay' });
    else if (total > gross / 2) issues.push({ level: 'warning', message: 'Deductions are over 50% of gross pay' });
    return { deductions, totalDeductionsKobo: total, netPayKobo: Math.max(gross - total, 0), issues };
}

const PER_YEAR = { annually: 1, monthly: 12, 'bi-weekly': 26, weekly: 52 };

function monthlyDeduction(d, periodStart) {
    if (d.frequency === 'one-time') {
        return d.effectiveFrom < periodStart ? null : { name: d.name, amount: d.amount };
    }
    const perYear = PER_YEAR[d.frequency];
    return { name: d.name, amount: perYear ? (d.amount * perYear) / 12 : NaN };
}

function buildLine(emp, salary, deductions = []) {
    const base = {
        employee: emp._id,
        employeeId: emp.employeeId || String(emp._id),
        employeeName: emp.fullName || emp.name || 'Unknown',
        salaryUsedKobo: salary ? kobo(salary.amount) || 0 : 0,
        salaryFrequency: salary?.frequency,
    };
    const perYear = salary && PER_YEAR[salary.frequency];
    const gross = perYear ? Math.round((kobo(salary.amount) * perYear) / 12) : 0;

    if (!(gross > 0)) {
        return {
            ...base, grossPayKobo: 0, deductions: [], totalDeductionsKobo: 0, netPayKobo: 0,
            issues: [{ level: 'error', message: 'No valid salary configured' }],
        };
    }
    return { ...base, grossPayKobo: gross, ...priceLine(gross, deductions) };
}

const totalsOf = (lines) => ({
    employeeCount: lines.length,
    totalGrossPayKobo: lines.reduce((s, l) => s + l.grossPayKobo, 0),
    totalDeductionsKobo: lines.reduce((s, l) => s + l.totalDeductionsKobo, 0),
    totalNetPayKobo: lines.reduce((s, l) => s + l.netPayKobo, 0),
});

const calculatePayroll = wrap(async (req, res) => {
    const { payPeriod } = req.body;
    if (!PERIOD.test(payPeriod)) return send(res, 400, 'payPeriod must look like "2026-09"');

    const companyId = companyOf(req);
    let payroll = await Payroll.findOne({ companyId, payPeriod });
    if (payroll && payroll.status === 'finalized') {
        return send(res, 409, 'This period is already finalized and cannot be recalculated');
    }

    if (payroll?.employees.some((e) => e.corrected) && req.body.force !== true) {
        return send(res, 409, 'This draft has manual corrections. Send { "force": true } to recalculate and discard them');
    }

    const employees = await Employee.find({ company: companyId, status: 'Active' });
    if (!employees.length) return send(res, 400, 'No active employees found');
    const [y, m] = payPeriod.split('-').map(Number);
    const periodEnd = new Date(Date.UTC(y, m, 1));

    const salaries = await Salary.find({
        company: companyId,
        employee: { $in: employees.map((employee) => employee._id) },
        isActive: true,
        effectiveFrom: { $lt: periodEnd },
    }).sort({
        effectiveFrom: -1,
        _id: -1,
    });

    const salaryOf = new Map();

    for (const salary of salaries) {
        const employeeId = String(salary.employee);

        if (!salaryOf.has(employeeId)) {
            salaryOf.set(employeeId, salary);
        }
    }

    const periodStart = new Date(Date.UTC(y, m - 1, 1));
    const deductionDocs = await Deduction.find({
        company: companyId,
        employee: { $in: employees.map((e) => e._id) },
        isActive: true,
        effectiveFrom: { $lt: periodEnd },
    });

    const deductionsOf = new Map();
    for (const d of deductionDocs) {
        const item = monthlyDeduction(d, periodStart);
        if (!item) continue;
        const key = String(d.employee);
        if (!deductionsOf.has(key)) deductionsOf.set(key, []);
        deductionsOf.get(key).push(item);
    }

    const lines = employees.map((e) => buildLine(e, salaryOf.get(String(e._id)), deductionsOf.get(String(e._id)) || []));
    const data = { employees: lines, totals: totalsOf(lines), calculatedAt: new Date() };

    if (payroll) {
        payroll.set({ ...data, reviewedBy: undefined, reviewedAt: undefined });
        payroll.revision += 1;
    } else {
        payroll = new Payroll({ companyId, payPeriod, createdBy: userOf(req), ...data });
    }
    await payroll.save();
    send(res, 201, 'Payroll calculated. Review it before finalizing.', payroll);
});

const getPayroll = wrap(async (req, res) => {
    const payroll = await findPayroll(req, req.params.id);
    if (!payroll) return send(res, 404, 'Payroll not found');
    const canFinalize = payroll.status === 'draft' && !payroll.employees.some(hasError);
    send(res, 200, 'OK', { payroll, canFinalize });
});

const updateEntry = wrap(async (req, res) => {
    const payroll = await findPayroll(req, req.params.id);
    if (!payroll) return send(res, 404, 'Payroll not found');
    if (payroll.status !== 'draft') return send(res, 409, 'Finalized payroll cannot be edited');
    if (!Array.isArray(req.body.deductions)) return send(res, 400, 'deductions must be an array');

    const line = payroll.employees.find((e) => String(e.employee) === req.params.employee);
    if (!line) return send(res, 404, 'Employee not in this payroll');
    if (!line.grossPayKobo) return send(res, 400, "Fix this employee's salary, then recalculate");

    line.set(priceLine(line.grossPayKobo, req.body.deductions));
    line.corrected = true;
    payroll.set({ totals: totalsOf(payroll.employees), reviewedBy: undefined, reviewedAt: undefined });
    payroll.revision += 1;
    await payroll.save();
    send(res, 200, 'Updated. Please review again.', line);
});

const finalizePayroll = wrap(async (req, res) => {
    if (req.body.confirm !== true) return send(res, 400, 'Send { "confirm": true } to finalize');
    const payroll = await findPayroll(req, req.params.id);
    if (!payroll) return send(res, 404, 'Payroll not found');
    if (payroll.status === 'finalized') return send(res, 409, 'Already finalized');

    const blocked = payroll.employees.filter(hasError);
    if (blocked.length) {
        return res.status(400).json({
            success: false,
            message: 'Fix employees with errors before finalizing',
            employees: blocked.map((e) => ({ employee: e.employee, name: e.employeeName, issues: e.issues })),
        });
    }

    const now = new Date();
    const who = userOf(req);
    payroll.set({ status: 'finalized', reviewedBy: who, reviewedAt: now, finalizedBy: who, finalizedAt: now });
    await payroll.save();
    send(res, 200, 'Payroll finalized. Payslips are now available.', payroll);
});

const recordPayment = wrap(async (req, res) => {
    const { status, paymentDate, employeeIds } = req.body;
    if (!['scheduled', 'paid'].includes(status)) return send(res, 400, 'status must be "scheduled" or "paid"');
    if (status === 'scheduled' && !paymentDate) return send(res, 400, 'paymentDate is required to schedule');

    const date = paymentDate ? new Date(paymentDate) : new Date();
    if (Number.isNaN(date.getTime())) return send(res, 400, 'paymentDate is not a valid date');
    if (status === 'paid' && date > new Date()) return send(res, 400, 'A future date cannot be marked as paid');

    const payroll = await findPayroll(req, req.params.id);
    if (!payroll) return send(res, 404, 'Payroll not found');
    if (payroll.status !== 'finalized') return send(res, 400, 'Only finalized payroll can be scheduled or paid');

    const ids = Array.isArray(employeeIds) ? employeeIds.map(String) : null;
    const lines = ids ? payroll.employees.filter((e) => ids.includes(String(e.employee))) : payroll.employees;
    if (!lines.length || (ids && lines.length !== ids.length)) return send(res, 404, 'Employee not in this payroll');
    if (status === 'scheduled' && lines.some((l) => l.paymentStatus === 'paid')) {
        return send(res, 409, 'Paid employees cannot go back to scheduled');
    }

    for (const line of lines) {
        if (line.paymentStatus === 'paid') continue;
        line.paymentStatus = status;
        if (status === 'scheduled') line.scheduledPaymentDate = day(date);
        else line.paidDate = day(date);
        line.paymentHistory.push({
            status, paymentDate: day(date), recordedAt: new Date(), recordedBy: userOf(req),
        });
    }
    await payroll.save();
    send(res, 200, 'Payment status updated');
});

const getPayrollHistory = wrap(async (req, res) => {
    const filter = { companyId: companyOf(req) };
    if (['draft', 'finalized'].includes(req.query.status)) filter.status = req.query.status;
    if (/^20[0-9]{2}$/.test(req.query.year)) filter.payPeriod = new RegExp(`^${req.query.year}-`);
    const items = await Payroll.find(filter).select('-employees').sort({ payPeriod: -1 });
    send(res, 200, 'OK', items);
});

const payslipOf = (payroll, e) => ({
    payslipNumber: `PS-${payroll.payPeriod.replace('-', '')}-${e.employeeId}`,
    payPeriod: payroll.payPeriod,
    employee: { id: e.employee, employeeId: e.employeeId, name: e.employeeName },
    grossPay: naira(e.grossPayKobo),
    deductions: e.deductions.map((d) => ({ name: d.name, amount: naira(d.amountKobo) })),
    totalDeductions: naira(e.totalDeductionsKobo),
    netPay: naira(e.netPayKobo),
    payment: { status: e.paymentStatus, scheduledPaymentDate: e.scheduledPaymentDate, paidDate: e.paidDate },
    finalizedAt: payroll.finalizedAt,
});

const getPayslips = wrap(async (req, res) => {
    const payroll = await findPayroll(req, req.params.id);
    if (!payroll) return send(res, 404, 'Payroll not found');
    if (payroll.status !== 'finalized') return send(res, 400, 'Payslips only exist for finalized payroll');

    let lines = payroll.employees;
    if (req.params.employee) lines = lines.filter((e) => String(e.employee) === req.params.employee);
    if (!lines.length) return send(res, 404, 'Employee not in this payroll');
    send(res, 200, 'OK', lines.map((e) => payslipOf(payroll, e)));
});

const getMyPayslips = wrap(async (req, res) => {
    const me = await Employee.findOne(req.user.employee ? { _id: req.user.employee } : { user: userOf(req) });
    if (!me) return send(res, 404, 'No employee record linked to your account');

    const filter = { companyId: companyOf(req), status: 'finalized', 'employees.employee': me._id };
    if (req.params.payrollId) {
        if (!mongoose.isValidObjectId(req.params.payrollId)) return send(res, 400, 'Invalid id');
        filter._id = req.params.payrollId;
    }

    const payrolls = await Payroll.find(filter)
        .select({ payPeriod: 1, finalizedAt: 1, employees: { $elemMatch: { employee: me._id } } })
        .sort({ payPeriod: -1 });

    const slips = payrolls.map((p) => payslipOf(p, p.employees[0]));
    if (req.params.payrollId) return slips.length ? send(res, 200, 'OK', slips[0]) : send(res, 404, 'Payslip not found');
    send(res, 200, 'OK', slips);
});

module.exports = { calculatePayroll, getPayroll, updateEntry, finalizePayroll, recordPayment, getPayrollHistory, getPayslips, getMyPayslips };