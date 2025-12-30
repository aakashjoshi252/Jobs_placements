const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/blogs
// @desc    Get all published blogs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    
    const query = { status: 'published' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
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
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
});

// @route   GET /api/blogs/company/:companyId
// @desc    Get all blogs for a specific company
// @access  Private (Recruiter only)
router.get('/company/:companyId', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ companyId: req.params.companyId })
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company blogs',
      error: error.message
    });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('companyId', 'name logo website location')
      .populate('authorId', 'name');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
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
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
});

// @route   POST /api/blogs
// @desc    Create new blog
// @access  Private (Recruiter only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, content, category, image, status, companyId } = req.body;
    
    const blog = await Blog.create({
      title,
      description,
      content,
      category,
      image,
      status,
      companyId,
      authorId: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Private (Recruiter only)
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
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
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Private (Recruiter only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
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
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/Unlike a blog
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
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
      blog.likes -= 1;
    } else {
      // Like
      blog.likedBy.push(userId);
      blog.likes += 1;
    }
    
    await blog.save();
    
    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Blog unliked' : 'Blog liked',
      likes: blog.likes,
      isLiked: !alreadyLiked
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking blog',
      error: error.message
    });
  }
});

module.exports = router;