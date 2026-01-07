const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/apiResponse');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const Company = require('../models/company.model');
const Interview = require('../models/interview.model');
const ApplicationNote = require('../models/applicationNote.model');
const User = require('../models/user.model');

/**
 * Get recruiter dashboard statistics
 * @route GET /api/v1/recruiter/dashboard
 * @access Private (Recruiter)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  // Get recruiter's companies
  const companies = await Company.find({ userId: recruiterId });
  const companyIds = companies.map(c => c._id);

  // Get jobs posted by recruiter
  const jobs = await Job.find({ createdBy: recruiterId });
  const jobIds = jobs.map(j => j._id);

  // Application statistics
  const applications = await Application.find({ job: { $in: jobIds } });
  
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'Open').length,
    closedJobs: jobs.filter(j => j.status === 'Closed').length,
    totalApplications: applications.length,
    newApplications: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interviewed: applications.filter(a => a.status === 'interviewed').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  // Upcoming interviews
  const upcomingInterviews = await Interview.find({
    recruiter: recruiterId,
    status: 'scheduled',
    scheduledAt: { $gte: new Date() },
  })
    .populate('candidate', 'username email profile')
    .populate('job', 'title')
    .sort({ scheduledAt: 1 })
    .limit(5);

  // Recent applications
  const recentApplications = await Application.find({ job: { $in: jobIds } })
    .populate('applicant', 'username email profile')
    .populate('job', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  // Top performing jobs (by application count)
  const jobPerformance = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const topJobs = await Job.find({
    _id: { $in: jobPerformance.map(jp => jp._id) },
  }).select('title location');

  const topJobsWithCount = topJobs.map(job => {
    const perf = jobPerformance.find(jp => jp._id.equals(job._id));
    return {
      ...job.toObject(),
      applicationCount: perf?.count || 0,
    };
  });

  // Companies count
  const companiesCount = companies.length;

  return ApiResponse.success(res, {
    stats,
    upcomingInterviews,
    recentApplications,
    topJobs: topJobsWithCount,
    companiesCount,
  }, 'Dashboard stats fetched successfully');
});

/**
 * Get applications with ATS board view
 * @route GET /api/v1/recruiter/ats
 * @access Private (Recruiter)
 */
const getATSBoard = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;
  const { jobId } = req.query;

  // Get recruiter's jobs
  let jobIds;
  if (jobId) {
    // Verify job belongs to recruiter
    const job = await Job.findOne({ _id: jobId, createdBy: recruiterId });
    if (!job) {
      return ApiResponse.notFound(res, 'Job not found');
    }
    jobIds = [jobId];
  } else {
    const jobs = await Job.find({ createdBy: recruiterId });
    jobIds = jobs.map(j => j._id);
  }

  // Get applications grouped by status
  const applications = await Application.find({ job: { $in: jobIds } })
    .populate('applicant', 'username email profile phone')
    .populate('job', 'title company')
    .populate('company', 'name logo')
    .sort({ createdAt: -1 });

  // Group by status
  const board = {
    pending: applications.filter(a => a.status === 'pending'),
    reviewing: applications.filter(a => a.status === 'reviewing'),
    shortlisted: applications.filter(a => a.status === 'shortlisted'),
    interviewed: applications.filter(a => a.status === 'interviewed'),
    accepted: applications.filter(a => a.status === 'accepted'),
    rejected: applications.filter(a => a.status === 'rejected'),
  };

  return ApiResponse.success(res, board, 'ATS board fetched successfully');
});

/**
 * Update application status
 * @route PATCH /api/v1/recruiter/applications/:id/status
 * @access Private (Recruiter)
 */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const recruiterId = req.user._id;

  // Get application and verify ownership
  const application = await Application.findById(id).populate('job');
  if (!application) {
    return ApiResponse.notFound(res, 'Application not found');
  }

  // Verify job belongs to recruiter
  if (!application.job.createdBy.equals(recruiterId)) {
    return ApiResponse.forbidden(res, 'Not authorized to update this application');
  }

  // Update status
  application.status = status;
  
  // Add to status history
  if (!application.statusHistory) {
    application.statusHistory = [];
  }
  application.statusHistory.push({
    status,
    changedAt: new Date(),
    note,
  });

  await application.save();

  // TODO: Send email notification to candidate

  return ApiResponse.success(res, application, 'Application status updated');
});

/**
 * Bulk update application status
 * @route PATCH /api/v1/recruiter/applications/bulk-update
 * @access Private (Recruiter)
 */
const bulkUpdateApplications = asyncHandler(async (req, res) => {
  const { applicationIds, status, note } = req.body;
  const recruiterId = req.user._id;

  // Get applications
  const applications = await Application.find({
    _id: { $in: applicationIds },
  }).populate('job');

  // Verify all jobs belong to recruiter
  const unauthorized = applications.some(
    app => !app.job.createdBy.equals(recruiterId)
  );

  if (unauthorized) {
    return ApiResponse.forbidden(res, 'Not authorized to update some applications');
  }

  // Update all applications
  const updatePromises = applications.map(async (app) => {
    app.status = status;
    if (!app.statusHistory) {
      app.statusHistory = [];
    }
    app.statusHistory.push({
      status,
      changedAt: new Date(),
      note,
    });
    return app.save();
  });

  await Promise.all(updatePromises);

  return ApiResponse.success(
    res,
    { updated: applications.length },
    `${applications.length} applications updated`
  );
});

/**
 * Add note to application
 * @route POST /api/v1/recruiter/applications/:id/notes
 * @access Private (Recruiter)
 */
const addApplicationNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, tags, isPrivate } = req.body;
  const recruiterId = req.user._id;

  // Verify application exists and belongs to recruiter's job
  const application = await Application.findById(id).populate('job');
  if (!application) {
    return ApiResponse.notFound(res, 'Application not found');
  }

  if (!application.job.createdBy.equals(recruiterId)) {
    return ApiResponse.forbidden(res, 'Not authorized');
  }

  const note = await ApplicationNote.create({
    application: id,
    author: recruiterId,
    content,
    tags,
    isPrivate,
  });

  const populatedNote = await ApplicationNote.findById(note._id)
    .populate('author', 'username email');

  return ApiResponse.success(res, populatedNote, 'Note added successfully', 201);
});

/**
 * Get application notes
 * @route GET /api/v1/recruiter/applications/:id/notes
 * @access Private (Recruiter)
 */
const getApplicationNotes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recruiterId = req.user._id;

  // Verify application
  const application = await Application.findById(id).populate('job');
  if (!application) {
    return ApiResponse.notFound(res, 'Application not found');
  }

  if (!application.job.createdBy.equals(recruiterId)) {
    return ApiResponse.forbidden(res, 'Not authorized');
  }

  const notes = await ApplicationNote.find({ application: id })
    .populate('author', 'username email')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, notes, 'Notes fetched successfully');
});

/**
 * Schedule interview
 * @route POST /api/v1/recruiter/interviews
 * @access Private (Recruiter)
 */
const scheduleInterview = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;
  const { applicationId, type, scheduledAt, duration, location, notes } = req.body;

  // Get application
  const application = await Application.findById(applicationId)
    .populate('job')
    .populate('company');

  if (!application) {
    return ApiResponse.notFound(res, 'Application not found');
  }

  // Verify authorization
  if (!application.job.createdBy.equals(recruiterId)) {
    return ApiResponse.forbidden(res, 'Not authorized');
  }

  const interview = await Interview.create({
    application: applicationId,
    job: application.job._id,
    candidate: application.applicant,
    recruiter: recruiterId,
    company: application.company,
    type,
    scheduledAt,
    duration,
    location,
    notes,
  });

  // Update application status to interviewed
  application.status = 'interviewed';
  await application.save();

  const populatedInterview = await Interview.findById(interview._id)
    .populate('candidate', 'username email phone')
    .populate('job', 'title')
    .populate('company', 'name');

  // TODO: Send email to candidate

  return ApiResponse.success(
    res,
    populatedInterview,
    'Interview scheduled successfully',
    201
  );
});

/**
 * Get interviews
 * @route GET /api/v1/recruiter/interviews
 * @access Private (Recruiter)
 */
const getInterviews = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;
  const { status, from, to } = req.query;

  const query = { recruiter: recruiterId };
  
  if (status) {
    query.status = status;
  }

  if (from || to) {
    query.scheduledAt = {};
    if (from) query.scheduledAt.$gte = new Date(from);
    if (to) query.scheduledAt.$lte = new Date(to);
  }

  const interviews = await Interview.find(query)
    .populate('candidate', 'username email phone profile')
    .populate('job', 'title')
    .populate('company', 'name logo')
    .sort({ scheduledAt: 1 });

  return ApiResponse.success(res, interviews, 'Interviews fetched successfully');
});

/**
 * Update interview
 * @route PUT /api/v1/recruiter/interviews/:id
 * @access Private (Recruiter)
 */
const updateInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recruiterId = req.user._id;

  const interview = await Interview.findOne({ _id: id, recruiter: recruiterId });
  
  if (!interview) {
    return ApiResponse.notFound(res, 'Interview not found');
  }

  Object.assign(interview, req.body);
  await interview.save();

  const updated = await Interview.findById(id)
    .populate('candidate', 'username email phone')
    .populate('job', 'title')
    .populate('company', 'name');

  return ApiResponse.success(res, updated, 'Interview updated successfully');
});

/**
 * Get analytics
 * @route GET /api/v1/recruiter/analytics
 * @access Private (Recruiter)
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;
  const { period = 30 } = req.query; // days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Get jobs
  const jobs = await Job.find({ createdBy: recruiterId });
  const jobIds = jobs.map(j => j._id);

  // Applications over time
  const applicationTrend = await Application.aggregate([
    {
      $match: {
        job: { $in: jobIds },
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Application funnel
  const funnel = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Average time to hire
  const hiredApplications = await Application.find({
    job: { $in: jobIds },
    status: 'accepted',
  });

  const avgTimeToHire = hiredApplications.length > 0
    ? hiredApplications.reduce((sum, app) => {
        const days = Math.floor(
          (new Date(app.updatedAt) - new Date(app.createdAt)) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0) / hiredApplications.length
    : 0;

  // Source analysis (can be enhanced with UTM tracking)
  const sourceAnalysis = {
    direct: Math.floor(Math.random() * 100), // Placeholder
    referral: Math.floor(Math.random() * 50),
    social: Math.floor(Math.random() * 30),
  };

  return ApiResponse.success(res, {
    applicationTrend,
    funnel,
    avgTimeToHire: Math.round(avgTimeToHire),
    sourceAnalysis,
    period,
  }, 'Analytics fetched successfully');
});

/**
 * Search candidates
 * @route GET /api/v1/recruiter/candidates/search
 * @access Private (Recruiter)
 */
const searchCandidates = asyncHandler(async (req, res) => {
  const { skills, location, experience, page = 1, limit = 20 } = req.query;

  const query = { role: 'candidate' };

  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim());
    query['profile.skills'] = { $in: skillsArray };
  }

  if (location) {
    query['profile.location'] = new RegExp(location, 'i');
  }

  if (experience) {
    query['profile.experience.years'] = { $gte: parseInt(experience) };
  }

  const candidates = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
  };

  return ApiResponse.successWithPagination(
    res,
    candidates,
    pagination,
    'Candidates fetched successfully'
  );
});

module.exports = {
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
};
