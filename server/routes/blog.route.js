const express = require('express');
const blogRouter = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const blogController = require('../controllers/blog.controller');

// Public routes - specific routes BEFORE dynamic :id
blogRouter.get('/', blogController.getAllBlogs);

// Protected specific routes - MUST come before /:id to avoid conflicts
blogRouter.get('/company/:companyId', protect, blogController.getCompanyBlogs);
blogRouter.get('/stats/:companyId', protect, blogController.getBlogStats);

// Generic ID routes - MUST come after specific routes
blogRouter.get('/:id', blogController.getBlogById);
blogRouter.post('/', protect, blogController.createBlog);
blogRouter.put('/:id', protect, blogController.updateBlog);
blogRouter.delete('/:id', protect, blogController.deleteBlog);
blogRouter.post('/:id/like', protect, blogController.toggleBlogLike);

module.exports = blogRouter;
