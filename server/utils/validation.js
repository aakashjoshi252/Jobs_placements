/**
 * Common Validation Helpers
 * Reusable validation functions for request data
 */

const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('./errors');

/**
 * Validate request and throw error if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    throw new ValidationError('Validation failed', formattedErrors);
  }

  next();
};

/**
 * Common validation rules
 */
const validationRules = {
  // Email validation
  email: body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Password validation
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  // MongoDB ObjectId validation
  objectId: (fieldName) =>
    param(fieldName)
      .isMongoId()
      .withMessage(`Invalid ${fieldName}`),

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
  ],

  // String field validation
  requiredString: (fieldName, minLength = 1, maxLength = 255) =>
    body(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`${fieldName} is required`)
      .isLength({ min: minLength, max: maxLength })
      .withMessage(
        `${fieldName} must be between ${minLength} and ${maxLength} characters`
      ),

  // Enum validation
  enum: (fieldName, allowedValues) =>
    body(fieldName)
      .isIn(allowedValues)
      .withMessage(`${fieldName} must be one of: ${allowedValues.join(', ')}`),
};

/**
 * Sanitize user input to prevent XSS
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Sanitize all request body fields
 */
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

module.exports = {
  validate,
  validationRules,
  sanitizeInput,
  sanitizeBody,
};