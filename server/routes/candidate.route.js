const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecommendedJobs,
  saveJob,
  getSavedJobs,
  removeSavedJob,
  updateSavedJob,
  createJobAlert,
  getJobAlerts,
  updateJobAlert,
  deleteJobAlert,
  getApplicationTimeline,
} = require('../controllers/candidate.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isCandidate } = require('../middlewares/role.middleware');

// All routes require authentication and candidate role
router.use(protect, isCandidate);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Recommendations
router.get('/recommendations', getRecommendedJobs);

// Saved Jobs
router.post('/saved-jobs', saveJob);
router.get('/saved-jobs', getSavedJobs);
router.put('/saved-jobs/:id', updateSavedJob);
router.delete('/saved-jobs/:id', removeSavedJob);

// Job Alerts
router.post('/job-alerts', createJobAlert);
router.get('/job-alerts', getJobAlerts);
router.put('/job-alerts/:id', updateJobAlert);
router.delete('/job-alerts/:id', deleteJobAlert);

// Application Timeline
router.get('/applications/:id/timeline', getApplicationTimeline);

module.exports = router;
