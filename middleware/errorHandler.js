// Error handling middleware 
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  console.log(err.message);
  
  res.status(500).json({ msg: 'Server Error' });
};

module.exports = errorHandler;
