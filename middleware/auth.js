// JWT Authentication middleware 
const jwt = require('jsonwebtoken');
const Companies = require('../models/Company'); // Ensure this is the correct path

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    // Decode the JWT to get the company ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the company from the database including companyName
    const company = await Companies.findById(decoded.id).select('companyName');

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Attach the company object to the request
    req.company = company;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Unauthorized' });
  }
};

module.exports = auth;
