const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth.js');
const c = require('../controller/payrollController.js');

const router = express.Router();

router.use(verifyToken);

router.get('/me/payslips', c.getMyPayslips);
router.get('/me/payslips/:payrollId', c.getMyPayslips);

router.use(isAdmin);

router.post('/calculate', c.calculatePayroll);
router.get('/', c.getPayrollHistory);
router.get('/:id', c.getPayroll);
router.patch('/:id/entries/:employee', c.updateEntry);
router.post('/:id/finalize', c.finalizePayroll);
router.patch('/:id/payment', c.recordPayment);
router.get('/:id/payslips', c.getPayslips);
router.get('/:id/payslips/:employee', c.getPayslips);

module.exports = router;