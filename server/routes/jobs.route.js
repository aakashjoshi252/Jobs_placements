const express = require("express");
const jobsRoute = express.Router();
const jobsController = require("../controllers/jobs.controller.js");
const { protect, isRecruiter } = require("../middlewares/auth.middleware.js");

// Public routes (no auth required)
jobsRoute.get("/featured", jobsController.fetchFeaturedJobs); // Get featured jobs
jobsRoute.get("/categories", jobsController.fetchJobCategories); // Get job categories
jobsRoute.get("/", jobsController.fetchJobs); // Fetch all jobs
jobsRoute.get("/company/:companyId", jobsController.fetchJobsByCompany);
jobsRoute.get("/recruiter/:recruiterId", jobsController.fetchJobsByRecruiter);
jobsRoute.get("/:id", jobsController.fetchJobById); // Must be last to avoid conflicts

// Protected routes (auth required)
jobsRoute.post("/create", protect, isRecruiter, jobsController.createJob);
jobsRoute.put("/:id", protect, isRecruiter, jobsController.updateJobId);
jobsRoute.delete("/:id", protect, isRecruiter, jobsController.deleteJobId);

module.exports = jobsRoute;