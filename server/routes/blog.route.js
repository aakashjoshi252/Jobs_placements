const express = require('express');
const blogRouter = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const blogController = require('../controllers/blog.controller');

// Public routes
blogRouter.get('/', blogController.getAllBlogs);
blogRouter.get('/:id', blogController.getBlogById);

// Protected routes - requires authentication
blogRouter.post('/', protect, blogController.createBlog);
blogRouter.put('/:id', protect, blogController.updateBlog);
blogRouter.delete('/:id', protect, blogController.deleteBlog);
blogRouter.post('/:id/like', protect, blogController.toggleBlogLike);

// Company-specific routes
blogRouter.get('/company/:companyId', protect, blogController.getCompanyBlogs);
blogRouter.get('/stats/:companyId', protect, blogController.getBlogStats);

module.exports = blogRouter;
