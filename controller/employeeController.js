const Employee = require('../models/employee');

// 1. Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { fullName, email, phone, employeeId, jobTitle, department, company, startDate, employmentType, user } = req.body;
    
    const existingEmployee = await Employee.findOne({ $or: [{ email }, { employeeId }] });
    if (existingEmployee) {
      return res.status(400).json({ success: false, error: 'Employee with this email or ID already exists.' });
    }

    const employee = await Employee.create({
      fullName,
      email,
      phone,
      employeeId,
      jobTitle,
      department,
      company,
      startDate,
      employmentType,
      user: user || null,
      status: 'Active'
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Employee Directory & Search
exports.getEmployees = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } 

    if (search) {
      query.fullName = { $regex: search,$options: 'i' };
    }

    const employees = await Employee.find(query).populate('user', 'email role');
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Update Employee Status
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Use Active or Inactive.' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found.' });
    }

    employee.status = status;
    await employee.save();

    res.status(200).json({ success: true, message: `Employee status updated to ${status}`, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};