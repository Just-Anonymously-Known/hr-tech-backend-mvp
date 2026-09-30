const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  jobTitle: { type: String, required: true },
  department: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);