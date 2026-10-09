const mongoose = require('mongoose');

const moneyField = {
  type: Number,
  required: true,
  min: 0,
  validate: {
    validator: Number.isSafeInteger,
    message: '{VALUE} is not a safe integer in kobo',
  },
};

const deductionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amountKobo: moneyField,
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['error', 'warning'], required: true },
    message: { type: String, required: true },
  },
  { _id: false }
);

const paymentHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['scheduled', 'paid'], required: true },
    paymentDate: { type: Date, required: true },
    recordedAt: { type: Date, required: true },
    recordedBy: { type: String, required: true },
  },
  { _id: false }
);

const employeePayrollSchema = new mongoose.Schema(
    {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },

    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },

    salaryUsedKobo: { type: Number, min: 0 },
    salaryFrequency: String,

    grossPayKobo: moneyField,
    deductions: [deductionSchema],
    totalDeductionsKobo: moneyField,
    netPayKobo: moneyField,

    issues: [issueSchema],
    corrected: { type: Boolean, default: false },

    paymentStatus: {
      type: String,
      enum: ['pending', 'scheduled', 'paid'],
      default: 'pending',
    },
    scheduledPaymentDate: Date,
    paidDate: Date,
    paymentHistory: [paymentHistorySchema],
  },
  { _id: false }
);

const payrollSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },

    payPeriod: {
      type: String,
      required: true,
      match: /^20[0-9]{2}-(0[1-9]|1[0-2])$/,
    },

    currency: { type: String, enum: ['NGN'], default: 'NGN' },

    status: { type: String, enum: ['draft', 'finalized'], default: 'draft' },

    employees: { type: [employeePayrollSchema], required: true },

    totals: {
      employeeCount: { type: Number, required: true },
      totalGrossPayKobo: moneyField,
      totalDeductionsKobo: moneyField,
      totalNetPayKobo: moneyField,
    },

    revision: { type: Number, default: 1 },

    createdBy: { type: String, required: true },
    calculatedAt: { type: Date, required: true },

    reviewedBy: String,
    reviewedAt: Date,

    finalizedBy: String,
    finalizedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

payrollSchema.index({ companyId: 1, payPeriod: 1 }, { unique: true });

payrollSchema.index({ companyId: 1, status: 1, 'employees.employee': 1 });

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;