/**
 * Enhanced Health Check Routes
 * Provides detailed system health information
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Basic health check
 * GET /health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * Detailed health check with dependencies
 * GET /health/detailed
 */
router.get('/detailed', async (req, res) => {
  const health = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      api: 'healthy',
      database: 'unknown',
    },
    system: {
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        unit: 'MB',
      },
      cpu: {
        user: Math.round(process.cpuUsage().user / 1000),
        system: Math.round(process.cpuUsage().system / 1000),
        unit: 'microseconds',
      },
    },
  };

  // Check database connection
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    health.services.database = dbStates[dbState];

    if (dbState === 1) {
      // Ping database
      await mongoose.connection.db.admin().ping();
      health.services.database = 'healthy';
    } else {
      health.success = false;
      health.status = 'degraded';
    }
  } catch (error) {
    logger.error('Database health check failed:', error);
    health.services.database = 'unhealthy';
    health.success = false;
    health.status = 'degraded';
  }

  const statusCode = health.success ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe (Kubernetes-compatible)
 * GET /health/ready
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false, reason: 'Database not connected' });
    }
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({ ready: false, reason: error.message });
  }
});

/**
 * Liveness probe (Kubernetes-compatible)
 * GET /health/live
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

module.exports = router;