const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const logger = require('../utils/logger');

/**
 * General API Rate Limiter
 * Prevents DDoS and brute force attacks
 */
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // Default: 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000,
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/health/ready';
  },
});

/**
 * Authentication Rate Limiter
 * Stricter limits for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: (process.env.AUTH_RATE_LIMIT_WINDOW || 15) * 60 * 1000, // Default: 15 minutes
  max: process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 5, // Only 5 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
    retryAfter: '15 minutes',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Account temporarily locked.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000,
    });
  },
});

/**
 * MongoDB Injection Protection
 * Sanitizes user input to prevent NoSQL injection
 */
const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn(`Sanitized request from ${req.ip}: ${key}`);
  },
});

/**
 * XSS Protection
 * Cleans user input from malicious scripts
 */
const xssProtection = xss();

/**
 * HTTP Parameter Pollution Protection
 * Prevents parameter pollution attacks
 */
const hppProtection = hpp({
  whitelist: [
    'sort',
    'page',
    'limit',
    'filter',
    'search',
    'location',
    'salary',
    'experience',
    'jobType',
    'skills',
  ],
});

/**
 * Security Headers Middleware
 * Adds additional security headers
 */
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  next();
};

/**
 * Request Logger Middleware
 * Logs all incoming requests for security monitoring
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      ip: req.ip,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 400) {
      logger.warn('Request failed', logData);
    } else if (duration > 3000) {
      logger.warn('Slow request', logData);
    }
  });

  next();
};

/**
 * API Key Validation Middleware (Optional)
 * Use for public API endpoints that require API keys
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key required',
    });
  }

  // Validate API key (implement your logic)
  if (apiKey !== process.env.API_KEY) {
    logger.warn(`Invalid API key attempt from ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  next();
};

/**
 * Input Validation Helper
 * Additional validation for file uploads
 */
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  const allowedTypes = process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default

  const file = req.file || (req.files && req.files[0]);

  if (file) {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds limit of ${maxSize / 1048576}MB`,
      });
    }
  }

  next();
};

module.exports = {
  limiter,
  authLimiter,
  mongoSanitizeMiddleware,
  xssProtection,
  hppProtection,
  securityHeaders,
  requestLogger,
  validateApiKey,
  validateFileUpload,
};
