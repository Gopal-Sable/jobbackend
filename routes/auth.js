// Auth routes for registration, login, OTP verification 
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const sendEmail = require('../config/email');
const logger = require('../utils/logger');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { name, phone, companyName, email, password, employeeSize } = req.body;
  try {
    let company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({ msg: 'Company already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    company = new Company({ name, phone, companyName, email, password: hashedPassword, employeeSize, otp });

    await company.save();

    // Send OTP via email
    await sendEmail(email, 'Verify your account', `Your OTP is: ${otp}`);
    res.status(201).json({ msg: 'Registered successfully. Please verify your email.' });
  } catch (err) {
    logger.error('Registration error:', err);
    console.log('Registration error:', err);
    
    res.status(500).json({ msg: 'Server error' });
  }
});

// Verify OTP Route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ msg: 'Company not found' });
    }

    if (company.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    company.isVerified = true;
    await company.save();

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    logger.error('OTP verification error:', err);
    console.log('OTP verification error:', err);
    
    res.status(500).json({ msg: 'Server error' });
  }
});
//  logout 
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear token from cookies (if using cookies for JWT)
    res.status(200).json({ msg: 'Successfully logged out' });
  });
  
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!company.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    logger.error('Login error:', err);
    console.log('Login error:', err);
    
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
