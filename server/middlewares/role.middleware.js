const ApiResponse = require('../utils/apiResponse');

/**
 * Check if user is a candidate
 */
const isCandidate = (req, res, next) => {
  if (req.user && req.user.role === 'candidate') {
    return next();
  }
  return ApiResponse.forbidden(res, 'Access restricted to candidates only');
};

/**
 * Check if user is a recruiter
 */
const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    return next();
  }
  return ApiResponse.forbidden(res, 'Access restricted to recruiters only');
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return ApiResponse.forbidden(res, 'Access restricted to admins only');
};

/**
 * Check if user is recruiter or admin
 */
const isRecruiterOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'recruiter' || req.user.role === 'admin')) {
    return next();
  }
  return ApiResponse.forbidden(res, 'Access restricted to recruiters and admins');
};

module.exports = {
  isCandidate,
  isRecruiter,
  isAdmin,
  isRecruiterOrAdmin,
};
