/**
 * Environment-specific configuration
 * Centralizes all configuration based on NODE_ENV
 */

const environments = {
  development: {
    server: {
      port: process.env.PORT || 5000,
      host: '0.0.0.0',
    },
    database: {
      uri: process.env.MONGODB_URI,
      options: {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
      },
    },
    cors: {
      allowLocalNetwork: true,
      credentials: true,
    },
    logging: {
      level: 'debug',
      colorize: true,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    },
    security: {
      bcryptRounds: 10,
    },
  },

  production: {
    server: {
      port: process.env.PORT || 5000,
      host: '0.0.0.0',
    },
    database: {
      uri: process.env.MONGODB_URI,
      options: {
        maxPoolSize: 50,
        minPoolSize: 10,
        socketTimeoutMS: 45000,
        ssl: true,
        retryWrites: true,
        w: 'majority',
      },
    },
    cors: {
      allowLocalNetwork: false,
      credentials: true,
    },
    logging: {
      level: 'info',
      colorize: false,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // Stricter in production
    },
    security: {
      bcryptRounds: 12, // More rounds in production
    },
  },

  test: {
    server: {
      port: process.env.PORT || 5001,
      host: 'localhost',
    },
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/job-placements-test',
      options: {
        maxPoolSize: 5,
        minPoolSize: 1,
      },
    },
    cors: {
      allowLocalNetwork: true,
      credentials: true,
    },
    logging: {
      level: 'error',
      colorize: false,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000, // Very high for testing
    },
    security: {
      bcryptRounds: 4, // Fast hashing for tests
    },
  },

  staging: {
    server: {
      port: process.env.PORT || 5000,
      host: '0.0.0.0',
    },
    database: {
      uri: process.env.MONGODB_URI,
      options: {
        maxPoolSize: 30,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        ssl: true,
      },
    },
    cors: {
      allowLocalNetwork: false,
      credentials: true,
    },
    logging: {
      level: 'debug',
      colorize: false,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 75,
    },
    security: {
      bcryptRounds: 12,
    },
  },
};

/**
 * Get configuration for current environment
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  const config = environments[env];

  if (!config) {
    throw new Error(`Configuration for environment "${env}" not found`);
  }

  return {
    ...config,
    env,
    isProduction: env === 'production',
    isDevelopment: env === 'development',
    isTest: env === 'test',
    isStaging: env === 'staging',
  };
}

module.exports = getConfig();