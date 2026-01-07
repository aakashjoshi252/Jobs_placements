const express = require('express');
const adminRouter = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');
const adminController = require('../controllers/admin.controller');

// All admin routes require authentication and admin role
adminRouter.use(protect, isAdmin);

// Dashboard & Analytics
adminRouter.get('/stats', adminController.getAdminStats);
adminRouter.get('/analytics', adminController.getAnalytics);

// User Management
adminRouter.get('/users', adminController.getAllUsers);
adminRouter.get('/users/:id', adminController.getUserById);
adminRouter.put('/users/:id', adminController.updateUser);
adminRouter.delete('/users/:id', adminController.deleteUser);

// Company Management
adminRouter.get('/companies', adminController.getAllCompanies);
adminRouter.patch('/companies/:id/verify', adminController.verifyCompany);
adminRouter.delete('/companies/:id', adminController.deleteCompany);

// Job Management
adminRouter.get('/jobs', adminController.getAllJobs);
adminRouter.delete('/jobs/:id', adminController.deleteJob);

module.exports = adminRouter;
