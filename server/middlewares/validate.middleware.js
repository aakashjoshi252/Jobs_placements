const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {String} source - Where to validate (body, query, params)
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn({
        message: 'Validation error',
        errors,
        url: req.originalUrl,
        method: req.method,
      });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

module.exports = validate;
