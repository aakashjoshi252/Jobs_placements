const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Database Connection Configuration - Production Ready
 * - Async/await pattern for better error handling
 * - Connection retry logic
 * - Proper logging
 * - Graceful error handling
 */
const connectDb = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    const conn = await mongoose.connect(process.env.MONGO_URL, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

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
