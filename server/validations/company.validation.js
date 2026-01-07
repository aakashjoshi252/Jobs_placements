const Joi = require('joi');

/**
 * Company Validation Schemas
 */

const createCompanySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Company name must be at least 2 characters long',
      'string.max': 'Company name must not exceed 200 characters',
      'any.required': 'Company name is required',
    }),

  description: Joi.string()
    .min(20)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description must not exceed 2000 characters',
      'any.required': 'Company description is required',
    }),

  website: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Please provide a valid website URL',
    }),

  location: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'any.required': 'Company location is required',
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Company email is required',
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit phone number',
    }),

  industry: Joi.string()
    .max(100)
    .optional(),

  size: Joi.string()
    .valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
    .optional(),

  founded: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      'number.min': 'Founded year seems too old',
      'number.max': 'Founded year cannot be in the future',
    }),
});

const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  website: Joi.string().uri().optional(),
  location: Joi.string().min(2).max(200).optional(),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  industry: Joi.string().max(100).optional(),
  size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+').optional(),
  founded: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
}).min(1);

module.exports = {
  createCompanySchema,
  updateCompanySchema,
};
