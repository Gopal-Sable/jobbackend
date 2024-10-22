// JWT Authentication middleware 
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = decoded;
    next();
  } catch (err) {
    logger.error('JWT verification failed', err);
    console.log('JWT verification failed', err);
    
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
