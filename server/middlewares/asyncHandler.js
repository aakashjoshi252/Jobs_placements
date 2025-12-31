/**
 * Async Error Handler Wrapper
 * Automatically catches async errors and passes them to error middleware
 * Usage: asyncHandler(async (req, res, next) => { ... })
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;