/**
 * Performance Monitoring Utilities
 * Track response times and performance metrics
 */

const logger = require('./logger');

/**
 * Request Timer Middleware
 * Logs request duration
 */
const requestTimer = (req, res, next) => {
  const start = Date.now();

  // Override res.json to capture response time
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const duration = Date.now() - start;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }

    // Add response time header
    res.setHeader('X-Response-Time', `${duration}ms`);

    return originalJson(body);
  };

  next();
};

/**
 * Database Query Performance Tracker
 */
class QueryPerformanceTracker {
  constructor() {
    this.queries = [];
    this.slowQueryThreshold = 100; // milliseconds
  }

  trackQuery(queryName, startTime) {
    const duration = Date.now() - startTime;

    this.queries.push({
      name: queryName,
      duration,
      timestamp: new Date(),
    });

    if (duration > this.slowQueryThreshold) {
      logger.warn('Slow database query detected', {
        query: queryName,
        duration: `${duration}ms`,
      });
    }

    return duration;
  }

  getStats() {
    if (this.queries.length === 0) {
      return {
        count: 0,
        average: 0,
        slowest: null,
      };
    }

    const durations = this.queries.map((q) => q.duration);
    const average = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowest = this.queries.reduce((prev, current) =>
      prev.duration > current.duration ? prev : current
    );

    return {
      count: this.queries.length,
      average: Math.round(average),
      slowest: {
        name: slowest.name,
        duration: slowest.duration,
      },
    };
  }

  reset() {
    this.queries = [];
  }
}

const queryTracker = new QueryPerformanceTracker();

module.exports = {
  requestTimer,
  queryTracker,
};