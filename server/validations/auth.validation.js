const Joi = require('joi');

/**
 * Authentication Validation Schemas
 */

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 50 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'any.required': 'Username is required',
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Password is required',
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit phone number',
      'any.required': 'Phone number is required',
    }),

  role: Joi.string()
    .valid('candidate', 'recruiter')
    .required()
    .messages({
      'any.only': 'Role must be either candidate or recruiter',
      'any.required': 'Role is required',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),

  bio: Joi.string()
    .max(500)
    .optional(),

  skills: Joi.array()
    .items(Joi.string().max(50))
    .max(20)
    .optional(),

  location: Joi.string()
    .max(100)
    .optional(),

  website: Joi.string()
    .uri()
    .optional(),

  linkedin: Joi.string()
    .uri()
    .optional(),

  github: Joi.string()
    .uri()
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
