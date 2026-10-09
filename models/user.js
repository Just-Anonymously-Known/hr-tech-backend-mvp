const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'HR', 'Employee'], default: 'Employee' },
  companyId: { type: String, required: true },

  // Corporate & HR Fields (from Figma specs)
  employeeId: { type: String, unique: true, sparse: true },
  department: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'], default: 'Full-Time' },
  startDate: { type: Date, default: Date.now },

  // Profile & Status Fields
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  address: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String, default: '' },

  // Leave Balances
  leaveBalance: {
    annual: { type: Number, default: 20 },
    sick: { type: Number, default: 10 },
    maternity: { type: Number, default: 90 },
    casual: { type: Number, default: 5 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);