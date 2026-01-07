const mongoose = require('mongoose');
const logger = require('../utils/logger');


const connectDb = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      family: 4, 
    };

    const conn = await mongoose.connect(process.env.MONGO_URL, options);

    logger.info(` MongoDB Connected: ${conn.connection.host}`);
    logger.info(` Database: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

    return conn;
  } catch (error) {
    logger.error(`❌ Database Connection Failed: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    
    // In production, you might want to retry instead of exit
    if (process.env.NODE_ENV === 'production') {
      logger.info('Retrying database connection in 5 seconds...');
      setTimeout(() => connectDb(), 5000);
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDb;
