// MongoDB connection setup 
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    logger.info('MongoDB connected');
    console.log("MongoDB connected");
    
  } catch (err) {
    logger.error('MongoDB connection failed:', err);
    console.log("Failed to connect: ",err);
    
    process.exit(1);
  }
};

module.exports = connectDB;
