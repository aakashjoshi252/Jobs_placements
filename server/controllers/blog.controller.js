const Blog = require('../models/Blog');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// @desc    Get all published blogs (public)
// @route   GET /api/v1/blog
// @access  Public
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    
    const query = { status: 'published' };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const blogs = await Blog.find(query)
      .populate('companyId', 'name logo')
      .populate('authorId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Blog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error(`Error in getAllBlogs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// @desc    Get all blogs for a specific company
// @route   GET /api/v1/blog/company/:companyId
// @access  Private (Recruiter only)
exports.getCompanyBlogs = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.query;
    
    // Validate companyId format
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }
    
    const query = { companyId: mongoose.Types.ObjectId(companyId) };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    logger.info(`Fetching blogs for company: ${companyId} with query: ${JSON.stringify(query)}`);
    
    const blogs = await Blog.find(query)
      .populate('authorId', 'name email')
      .populate('companyId', 'name logo')
      .sort({ createdAt: -1 })
      .lean();
    
    logger.info(`Found ${blogs.length} blogs for company ${companyId}`);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    logger.error(`Error in getCompanyBlogs: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching company blogs',
      error: error.message
    });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/v1/blog/:id
// @access  Public
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate blog ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    const blog = await Blog.findById(id)
      .populate('companyId', 'name logo website location')
      .populate('authorId', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Only show published blogs to non-authors
    if (blog.status !== 'published' && 
        (!req.user || blog.authorId._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to unpublished blog'
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    logger.error(`Error in getBlogById: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// @desc    Create new blog
// @route   POST /api/v1/blog
// @access  Private (Recruiter only)
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, category, image, status, companyId } = req.body;
    
    // Validation
    if (!title || !description || !content || !category || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, content, category, companyId'
      });
    }
    
    // Validate companyId format
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }
    
    // Verify user is recruiter
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Only recruiters can create blogs'
      });
    }
    
    // Verify company belongs to user
    const Company = require('../models/company.model');
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    if (company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create blogs for this company'
      });
    }
    
    // Create blog
    const blog = await Blog.create({
      title,
      description,
      content,
      category,
      image: image || undefined,
      status: status || 'draft',
      companyId,
      authorId: req.user._id
    });
    
    // Populate fields for response
    await blog.populate([
      { path: 'companyId', select: 'name logo' },
      { path: 'authorId', select: 'name email' }
    ]);
    
    logger.info(`Blog created: ${blog._id} by user ${req.user._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    logger.error(`Error in createBlog: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// @desc    Update blog
// @route   PUT /api/v1/blog/:id
// @access  Private (Recruiter only)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate blog ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user is the author
    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }
    
    // Update allowed fields
    const allowedFields = ['title', 'description', 'content', 'category', 'image', 'status'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'companyId', select: 'name logo' },
      { path: 'authorId', select: 'name email' }
    ]);
    
    logger.info(`Blog updated: ${id} by user ${req.user._id}`);
    
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    logger.error(`Error in updateBlog: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/v1/blog/:id
// @access  Private (Recruiter only)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate blog ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user is the author
    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }
    
    await blog.deleteOne();
    
    logger.info(`Blog deleted: ${id} by user ${req.user._id}`);
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleteBlog: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

// @desc    Like/Unlike a blog
// @route   POST /api/v1/blog/:id/like
// @access  Private
exports.toggleBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate blog ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    const userId = req.user._id;
    const alreadyLiked = blog.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike
      blog.likedBy = blog.likedBy.filter(id => id.toString() !== userId.toString());
      blog.likes = Math.max(0, blog.likes - 1);
    } else {
      // Like
      blog.likedBy.push(userId);
      blog.likes += 1;
    }
    
    await blog.save();
    
    logger.info(`Blog ${id} ${alreadyLiked ? 'unliked' : 'liked'} by user ${userId}`);
    
    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Blog unliked successfully' : 'Blog liked successfully',
      likes: blog.likes,
      isLiked: !alreadyLiked
    });
  } catch (error) {
    logger.error(`Error in toggleBlogLike: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error processing like action',
      error: error.message
    });
  }
};

// @desc    Get blog statistics
// @route   GET /api/v1/blog/stats/:companyId
// @access  Private (Recruiter only)
exports.getBlogStats = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Validate companyId format
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }
    
    logger.info(`Fetching stats for company: ${companyId}`);
    
    // Use new mongoose.Types.ObjectId() syntax for newer versions
    const objectId = mongoose.Types.ObjectId.isValid(companyId) 
      ? new mongoose.Types.ObjectId(companyId)
      : companyId;
    
    const stats = await Blog.aggregate([
      { $match: { companyId: objectId } },
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftBlogs: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          avgViews: { $avg: '$views' },
          avgLikes: { $avg: '$likes' }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalBlogs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
      totalViews: 0,
      totalLikes: 0,
      avgViews: 0,
      avgLikes: 0
    };
    
    logger.info(`Stats result for company ${companyId}: ${JSON.stringify(result)}`);
    
    res.status(200).json({
      success: true,
      stats: result
    });
  } catch (error) {
    logger.error(`Error in getBlogStats: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog statistics',
      error: error.message
    });
  }
};
