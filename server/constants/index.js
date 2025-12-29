/**
 * Application Constants
 * Centralized location for all constant values used across the application
 */

module.exports = {
  // User Roles
  USER_ROLES: {
    CANDIDATE: 'candidate',
    RECRUITER: 'recruiter',
    ADMIN: 'admin'
  },
  
  // Application Status
  APPLICATION_STATUS: {
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    SHORTLISTED: 'shortlisted',
    REJECTED: 'rejected',
    ACCEPTED: 'accepted',
    WITHDRAWN: 'withdrawn'
  },
  
  // Job Status
  JOB_STATUS: {
    ACTIVE: 'active',
    CLOSED: 'closed',
    DRAFT: 'draft'
  },
  
  // Job Types
  JOB_TYPES: {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    TEMPORARY: 'temporary'
  },
  
  // Experience Levels
  EXPERIENCE_LEVELS: {
    ENTRY: 'entry',
    JUNIOR: 'junior',
    MID: 'mid',
    SENIOR: 'senior',
    LEAD: 'lead',
    EXECUTIVE: 'executive'
  },
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },
  
  // File Upload
  ALLOWED_FILE_TYPES: {
    RESUME: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    IMAGE: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  },
  
  MAX_FILE_SIZES: {
    RESUME: 5 * 1024 * 1024, // 5MB
    IMAGE: 2 * 1024 * 1024   // 2MB
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Token Types
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'reset-password',
    VERIFY_EMAIL: 'verify-email'
  }
};