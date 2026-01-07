const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Middleware to check if user has admin role
 * Must be used after protect middleware
 */
const isAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      logger.warn(`Unauthorized admin access attempt by user ${req.user._id}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    logger.info(`Admin access granted to user ${req.user._id}`);
    next();
  } catch (error) {
    logger.error(`Admin middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error verifying admin privileges',
      error: error.message,
    });
  }
};

/**
 * Middleware to check if user is admin or recruiter
 * Useful for routes that allow both admin and recruiter access
 */
const isAdminOrRecruiter = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or recruiter privileges required.',
      });
    }

    next();
  } catch (error) {
    logger.error(`Admin/Recruiter middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error verifying privileges',
      error: error.message,
    });
  }
};

module.exports = { isAdmin, isAdminOrRecruiter };
