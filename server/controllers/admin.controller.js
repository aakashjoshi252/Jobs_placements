const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/jobs.model');
const Application = require('../models/application.model');
const Blog = require('../models/Blog');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res) => {
  try {
    const [userStats, companyStats, jobStats, applicationStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
      Company.aggregate([
        {
          $group: {
            _id: '$isVerified',
            count: { $sum: 1 },
          },
        },
      ]),
      Job.aggregate([
        {
          $group: {
            _id: null,
            totalJobs: { $sum: 1 },
            activeJobs: {
              $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] },
            },
            closedJobs: {
              $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] },
            },
          },
        },
      ]),
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Format user stats
    const users = {
      total: userStats.reduce((acc, curr) => acc + curr.count, 0),
      candidates: userStats.find((u) => u._id === 'candidate')?.count || 0,
      recruiters: userStats.find((u) => u._id === 'recruiter')?.count || 0,
      admins: userStats.find((u) => u._id === 'admin')?.count || 0,
    };

    // Format company stats
    const companies = {
      total: companyStats.reduce((acc, curr) => acc + curr.count, 0),
      verified: companyStats.find((c) => c._id === true)?.count || 0,
      unverified: companyStats.find((c) => c._id === false)?.count || 0,
    };

    // Format job stats
    const jobs = jobStats[0] || {
      totalJobs: 0,
      activeJobs: 0,
      closedJobs: 0,
    };

    // Format application stats
    const applications = {
      total: applicationStats.reduce((acc, curr) => acc + curr.count, 0),
      pending: applicationStats.find((a) => a._id === 'Pending')?.count || 0,
      accepted: applicationStats.find((a) => a._id === 'Accepted')?.count || 0,
      rejected: applicationStats.find((a) => a._id === 'Rejected')?.count || 0,
    };

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    const recentCompanies = await Company.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email isVerified createdAt');

    res.status(200).json({
      success: true,
      data: {
        users,
        companies,
        jobs,
        applications,
        recentActivity: {
          users: recentUsers,
          companies: recentCompanies,
        },
      },
    });
  } catch (error) {
    logger.error(`Get admin stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all users with pagination and filters
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get user by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

/**
 * @desc    Update user role or details
 * @route   PUT /api/v1/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res) => {
  try {
    const { role, username, email, phone, bio, location } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (role) user.role = role;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all companies with pagination
 * @route   GET /api/v1/admin/companies
 * @access  Private/Admin
 */
const getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isVerified,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [companies, total] = await Promise.all([
      Company.find(query)
        .populate('recruiterId', 'username email')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Company.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get all companies error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify/Unverify company
 * @route   PATCH /api/v1/admin/companies/:id/verify
 * @access  Private/Admin
 */
const verifyCompany = async (req, res) => {
  try {
    const { isVerified } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    company.isVerified = isVerified;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Company ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: company,
    });
  } catch (error) {
    logger.error(`Verify company error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error verifying company',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete company
 * @route   DELETE /api/v1/admin/companies/:id
 * @access  Private/Admin
 */
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete company error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting company',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all jobs with admin filters
 * @route   GET /api/v1/admin/jobs
 * @access  Private/Admin
 */
const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('companyId', 'companyName email')
        .populate('recruiterId', 'username email')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get all jobs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete job
 * @route   DELETE /api/v1/admin/jobs/:id
 * @access  Private/Admin
 */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete job error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message,
    });
  }
};

/**
 * @desc    Get platform analytics
 * @route   GET /api/v1/admin/analytics
 * @access  Private/Admin
 */
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // User growth
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Application trends
    const applicationTrends = await Application.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Top companies by jobs
    const topCompanies = await Job.aggregate([
      {
        $group: {
          _id: '$company',
          jobCount: { $sum: 1 },
        },
      },
      { $sort: { jobCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'companyDetails',
        },
      },
      { $unwind: '$companyDetails' },
      {
        $project: {
          name: '$companyDetails.name',
          logo: '$companyDetails.logo',
          jobCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        applicationTrends,
        topCompanies,
        period: `${period} days`,
      },
    });
  } catch (error) {
    logger.error(`Get analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCompanies,
  verifyCompany,
  deleteCompany,
  getAllJobs,
  deleteJob,
  getAnalytics,
};
