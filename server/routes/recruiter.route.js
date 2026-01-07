const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getATSBoard,
  updateApplicationStatus,
  bulkUpdateApplications,
  addApplicationNote,
  getApplicationNotes,
  scheduleInterview,
  getInterviews,
  updateInterview,
  getAnalytics,
  searchCandidates,
} = require('../controllers/recruiter.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isRecruiter } = require('../middlewares/role.middleware');

// All routes require authentication and recruiter role
router.use(protect, isRecruiter);

// Dashboard
router.get('/dashboard', getDashboardStats);

// ATS (Application Tracking System)
router.get('/ats', getATSBoard);

// Applications
router.patch('/applications/:id/status', updateApplicationStatus);
router.patch('/applications/bulk-update', bulkUpdateApplications);

// Application Notes
router.post('/applications/:id/notes', addApplicationNote);
router.get('/applications/:id/notes', getApplicationNotes);

// Interviews
router.post('/interviews', scheduleInterview);
router.get('/interviews', getInterviews);
router.put('/interviews/:id', updateInterview);

// Analytics
router.get('/analytics', getAnalytics);

// Candidate Search
router.get('/candidates/search', searchCandidates);

module.exports = router;
