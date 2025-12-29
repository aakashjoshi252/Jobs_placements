/**
 * Custom Error Response Class
 * Extends the native Error class to include HTTP status codes
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;