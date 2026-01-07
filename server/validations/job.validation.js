const Joi = require('joi');

/**
 * Job Validation Schemas
 */

const createJobSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Job title must be at least 3 characters long',
      'string.max': 'Job title must not exceed 200 characters',
      'any.required': 'Job title is required',
    }),

  description: Joi.string()
    .min(50)
    .max(5000)
    .required()
    .messages({
      'string.min': 'Job description must be at least 50 characters long',
      'string.max': 'Job description must not exceed 5000 characters',
      'any.required': 'Job description is required',
    }),

  requirements: Joi.array()
    .items(Joi.string().max(200))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one requirement is needed',
      'array.max': 'Maximum 50 requirements allowed',
      'any.required': 'Requirements are required',
    }),

  location: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'Location is required',
    }),

  jobType: Joi.string()
    .valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')
    .required()
    .messages({
      'any.only': 'Invalid job type',
      'any.required': 'Job type is required',
    }),

  experience: Joi.string()
    .valid('Entry Level', '1-3 years', '3-5 years', '5+ years')
    .required()
    .messages({
      'any.required': 'Experience level is required',
    }),

  salaryMin: Joi.number()
    .min(0)
    .max(10000000)
    .optional()
    .messages({
      'number.min': 'Minimum salary cannot be negative',
      'number.max': 'Salary exceeds maximum limit',
    }),

  salaryMax: Joi.number()
    .min(Joi.ref('salaryMin'))
    .max(10000000)
    .optional()
    .messages({
      'number.min': 'Maximum salary must be greater than minimum salary',
      'number.max': 'Salary exceeds maximum limit',
    }),

  positions: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .default(1)
    .optional(),

  company: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid company ID',
      'any.required': 'Company is required',
    }),

  status: Joi.string()
    .valid('Open', 'Closed')
    .default('Open')
    .optional(),
});

const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(50).max(5000).optional(),
  requirements: Joi.array().items(Joi.string().max(200)).min(1).max(50).optional(),
  location: Joi.string().min(2).max(100).optional(),
  jobType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance').optional(),
  experience: Joi.string().valid('Entry Level', '1-3 years', '3-5 years', '5+ years').optional(),
  salaryMin: Joi.number().min(0).max(10000000).optional(),
  salaryMax: Joi.number().min(Joi.ref('salaryMin')).max(10000000).optional(),
  positions: Joi.number().integer().min(1).max(1000).optional(),
  status: Joi.string().valid('Open', 'Closed').optional(),
}).min(1); // At least one field must be provided

const jobQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  search: Joi.string().max(200).optional(),
  location: Joi.string().max(100).optional(),
  jobType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance').optional(),
  experience: Joi.string().valid('Entry Level', '1-3 years', '3-5 years', '5+ years').optional(),
  salaryMin: Joi.number().min(0).optional(),
  salaryMax: Joi.number().min(0).optional(),
  status: Joi.string().valid('Open', 'Closed').optional(),
  sortBy: Joi.string().valid('createdAt', 'title', 'salaryMin', 'salaryMax').default('createdAt').optional(),
  order: Joi.string().valid('asc', 'desc').default('desc').optional(),
});

module.exports = {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
};
