// Mongoose schema for company registration 
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeSize: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, required: true }, // OTP for verification
});

module.exports = mongoose.model('Company', CompanySchema);
