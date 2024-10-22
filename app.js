const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const setupSwagger = require('./config/swagger');
require('dotenv').config();
const cors = require('cors');



const app = express();
app.use(express.json());

app.use(cors());
// Connect to MongoDB
connectDB();

setupSwagger(app);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
