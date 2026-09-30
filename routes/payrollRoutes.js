import express from 'express';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
import * as c from '../controller/payrollController.js';

const router = express.Router();
router.use(auth);

router.get('/me/payslips', c.getMyPayslips);
router.get('/me/payslips/:payrollId', c.getMyPayslips);

router.use(roleCheck('admin'));
router.post('/calculate', c.calculatePayroll);
router.get('/', c.getPayrollHistory);
router.get('/:id', c.getPayroll);
router.patch('/:id/entries/:employee', c.updateEntry);
router.post('/:id/finalize', c.finalizePayroll);
router.patch('/:id/payment', c.recordPayment);
router.get('/:id/payslips', c.getPayslips);
router.get('/:id/payslips/:employee', c.getPayslips);

export default router;