const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/apiResponse');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const SavedJob = require('../models/savedJob.model');
const JobAlert = require('../models/jobAlert.model');
const User = require('../models/user.model');

/**
 * Get candidate dashboard statistics
 * @route GET /api/v1/candidate/dashboard
 * @access Private (Candidate)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get application statistics
  const applications = await Application.find({ applicant: userId });
  
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  // Get saved jobs count
  const savedJobsCount = await SavedJob.countDocuments({ user: userId });

  // Get active job alerts
  const activeAlerts = await JobAlert.countDocuments({ user: userId, isActive: true });

  // Get recent applications
  const recentApplications = await Application.find({ applicant: userId })
    .populate('job', 'title company location')
    .populate('company', 'name logo')
    .sort({ createdAt: -1 })
    .limit(5);

  // Profile completion
  const user = await User.findById(userId);
  const profileCompletion = calculateProfileCompletion(user);

  // Get recommended jobs count
  const recommendedJobsCount = await getRecommendedJobsCount(userId);

  return ApiResponse.success(res, {
    stats,
    savedJobsCount,
    activeAlerts,
    recentApplications,
    profileCompletion,
    recommendedJobsCount,
  }, 'Dashboard stats fetched successfully');
});

/**
 * Calculate profile completion percentage
 */
const calculateProfileCompletion = (user) => {
  const fields = [
    user.username,
    user.email,
    user.phone,
    user.bio,
    user.profile?.resume,
    user.profile?.skills?.length > 0,
    user.profile?.education?.length > 0,
    user.profile?.experience?.length > 0,
    user.profile?.profilePhoto,
  ];

  const completed = fields.filter(Boolean).length;
  const total = fields.length;
  const percentage = Math.round((completed / total) * 100);

  return {
    percentage,
    completed,
    total,
    missing: [
      !user.bio && 'Add a bio',
      !user.profile?.resume && 'Upload resume',
      !user.profile?.skills?.length && 'Add skills',
      !user.profile?.education?.length && 'Add education',
      !user.profile?.experience?.length && 'Add experience',
      !user.profile?.profilePhoto && 'Upload profile photo',
    ].filter(Boolean),
  };
};

/**
 * Get recommended jobs for candidate
 * @route GET /api/v1/candidate/recommendations
 * @access Private (Candidate)
 */
const getRecommendedJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findById(userId);
  const userSkills = user.profile?.skills || [];

  // Get jobs user already applied to
  const appliedJobs = await Application.find({ applicant: userId }).distinct('job');

  // Build recommendation query
  const query = {
    _id: { $nin: appliedJobs }, // Exclude applied jobs
    status: 'Open',
  };

  // Match by skills
  if (userSkills.length > 0) {
    query.$or = [
      { requirements: { $in: userSkills } },
      { title: { $in: userSkills.map(skill => new RegExp(skill, 'i')) } },
    ];
  }

  const jobs = await Job.find(query)
    .populate('company', 'name logo location')
    .populate('createdBy', 'username')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Job.countDocuments(query);

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
  };

  return ApiResponse.successWithPagination(
    res,
    jobs,
    pagination,
    'Recommended jobs fetched successfully'
  );
});

/**
 * Get recommended jobs count
 */
const getRecommendedJobsCount = async (userId) => {
  const user = await User.findById(userId);
  const userSkills = user.profile?.skills || [];
  const appliedJobs = await Application.find({ applicant: userId }).distinct('job');

  const query = {
    _id: { $nin: appliedJobs },
    status: 'Open',
  };

  if (userSkills.length > 0) {
    query.$or = [
      { requirements: { $in: userSkills } },
    ];
  }

  return await Job.countDocuments(query);
};

/**
 * Save a job
 * @route POST /api/v1/candidate/saved-jobs
 * @access Private (Candidate)
 */
const saveJob = asyncHandler(async (req, res) => {
  const { jobId, notes, tags, priority } = req.body;
  const userId = req.user._id;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return ApiResponse.notFound(res, 'Job not found');
  }

  // Check if already saved
  const existing = await SavedJob.findOne({ user: userId, job: jobId });
  if (existing) {
    return ApiResponse.error(res, 'Job already saved', 400);
  }

  const savedJob = await SavedJob.create({
    user: userId,
    job: jobId,
    notes,
    tags,
    priority,
  });

  const populatedSavedJob = await SavedJob.findById(savedJob._id)
    .populate('job')
    .populate({ path: 'job', populate: { path: 'company' } });

  return ApiResponse.success(
    res,
    populatedSavedJob,
    'Job saved successfully',
    201
  );
});

/**
 * Get saved jobs
 * @route GET /api/v1/candidate/saved-jobs
 * @access Private (Candidate)
 */
const getSavedJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, priority, tags } = req.query;

  const query = { user: userId };
  if (priority) query.priority = priority;
  if (tags) query.tags = { $in: tags.split(',') };

  const savedJobs = await SavedJob.find(query)
    .populate({
      path: 'job',
      populate: { path: 'company', select: 'name logo location' }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SavedJob.countDocuments(query);

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
  };

  return ApiResponse.successWithPagination(
    res,
    savedJobs,
    pagination,
    'Saved jobs fetched successfully'
  );
});

/**
 * Remove saved job
 * @route DELETE /api/v1/candidate/saved-jobs/:id
 * @access Private (Candidate)
 */
const removeSavedJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const savedJob = await SavedJob.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!savedJob) {
    return ApiResponse.notFound(res, 'Saved job not found');
  }

  return ApiResponse.success(res, null, 'Job removed from saved list');
});

/**
 * Update saved job
 * @route PUT /api/v1/candidate/saved-jobs/:id
 * @access Private (Candidate)
 */
const updateSavedJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { notes, tags, priority } = req.body;

  const savedJob = await SavedJob.findOneAndUpdate(
    { _id: id, user: userId },
    { notes, tags, priority },
    { new: true, runValidators: true }
  ).populate({
    path: 'job',
    populate: { path: 'company' }
  });

  if (!savedJob) {
    return ApiResponse.notFound(res, 'Saved job not found');
  }

  return ApiResponse.success(res, savedJob, 'Saved job updated successfully');
});

/**
 * Create job alert
 * @route POST /api/v1/candidate/job-alerts
 * @access Private (Candidate)
 */
const createJobAlert = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const alertData = { ...req.body, user: userId };

  const alert = await JobAlert.create(alertData);

  return ApiResponse.success(
    res,
    alert,
    'Job alert created successfully',
    201
  );
});

/**
 * Get job alerts
 * @route GET /api/v1/candidate/job-alerts
 * @access Private (Candidate)
 */
const getJobAlerts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const alerts = await JobAlert.find({ user: userId }).sort({ createdAt: -1 });

  return ApiResponse.success(res, alerts, 'Job alerts fetched successfully');
});

/**
 * Update job alert
 * @route PUT /api/v1/candidate/job-alerts/:id
 * @access Private (Candidate)
 */
const updateJobAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const alert = await JobAlert.findOneAndUpdate(
    { _id: id, user: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!alert) {
    return ApiResponse.notFound(res, 'Job alert not found');
  }

  return ApiResponse.success(res, alert, 'Job alert updated successfully');
});

/**
 * Delete job alert
 * @route DELETE /api/v1/candidate/job-alerts/:id
 * @access Private (Candidate)
 */
const deleteJobAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const alert = await JobAlert.findOneAndDelete({ _id: id, user: userId });

  if (!alert) {
    return ApiResponse.notFound(res, 'Job alert not found');
  }

  return ApiResponse.success(res, null, 'Job alert deleted successfully');
});

/**
 * Get application timeline
 * @route GET /api/v1/candidate/applications/:id/timeline
 * @access Private (Candidate)
 */
const getApplicationTimeline = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const application = await Application.findOne({
    _id: id,
    applicant: userId,
  });

  if (!application) {
    return ApiResponse.notFound(res, 'Application not found');
  }

  // Build timeline from application history
  const timeline = [
    {
      status: 'Applied',
      date: application.createdAt,
      description: 'Application submitted',
    },
  ];

  // Add status changes if tracked
  if (application.statusHistory && application.statusHistory.length > 0) {
    application.statusHistory.forEach((history) => {
      timeline.push({
        status: history.status,
        date: history.changedAt,
        description: history.note || `Status changed to ${history.status}`,
      });
    });
  }

  return ApiResponse.success(res, timeline, 'Timeline fetched successfully');
});

module.exports = {
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
};
