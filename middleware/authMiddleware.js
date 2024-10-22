const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.company = decoded.company;
    next();
  } catch (err) {
    logger.error('JWT authentication error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
