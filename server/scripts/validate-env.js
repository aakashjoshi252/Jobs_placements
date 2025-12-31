/**
 * Environment Variable Validation Script
 * Validates all required environment variables before server starts
 */

const Joi = require('joi');
const fs = require('fs');
const path = require('path');

// Define required environment variables schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(5000),
  
  // Database
  MONGODB_URI: Joi.string().required(),
  
  // Authentication
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRE: Joi.string().default('7d'),
  
  // CORS
  CLIENT_URL: Joi.string().uri().required(),
  FRONTEND_URL: Joi.string().uri().optional(),
  
  // Email (optional for development)
  EMAIL_HOST: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  EMAIL_PORT: Joi.number().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  EMAIL_USER: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  EMAIL_PASSWORD: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  
  // File Upload
  MAX_FILE_SIZE: Joi.number().default(5242880), // 5MB
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
})
  .unknown()
  .required();

function validateEnv() {
  console.log('🔍 Validating environment variables...');
  
  // Load .env file if exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath) && process.env.NODE_ENV !== 'production') {
    console.error('❌ .env file not found!');
    console.error('💡 Create one using: cp .env.example .env');
    process.exit(1);
  }
  
  // Validate environment variables
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: true,
  });
  
  if (error) {
    console.error('❌ Environment validation failed:');
    error.details.forEach((detail) => {
      console.error(`   - ${detail.message}`);
    });
    console.error('\n📝 Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  // Additional security checks for production
  if (value.NODE_ENV === 'production') {
    if (value.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET must be at least 32 characters in production!');
      process.exit(1);
    }
    
    if (!value.MONGODB_URI.includes('mongodb+atlas') && !value.MONGODB_URI.includes('ssl=true')) {
      console.warn('⚠️  Warning: MongoDB connection should use SSL in production');
    }
  }
  
  console.log('✅ Environment validation passed');
  console.log(`📦 Environment: ${value.NODE_ENV}`);
  console.log(`🚀 Port: ${value.PORT}`);
  
  return value;
}

// Run validation if executed directly
if (require.main === module) {
  try {
    validateEnv();
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
  }
}

module.exports = validateEnv;