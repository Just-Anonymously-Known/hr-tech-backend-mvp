const express = require('express');
const router = express.Router();
const { 
  createEmployee, 
  getEmployees, 
  updateEmployeeStatus 
} = require('../controller/employeeController');

// Define routes for Epic 1 (Employee Management)
router.post('/', createEmployee);
router.get('/', getEmployees);
router.patch('/:id/status', updateEmployeeStatus);

module.exports = router;