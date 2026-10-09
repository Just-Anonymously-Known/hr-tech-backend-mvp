const express = require('express');
const router = express.Router();
const { addEmployee, updateEmployee } = require('../controller/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Epic 1: Admin & HR Employee Management Routes
router.post('/add-employee', verifyToken, isAdmin, addEmployee);
router.put('/:id', verifyToken, isAdmin, updateEmployee);

module.exports = router;