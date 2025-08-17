const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['HR', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations']
  },
  position: {
    type: String,
    required: [true, 'Position is required']
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required']
  },
  address: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
