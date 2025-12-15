const express = require("express");
const jobsRoute = express.Router();
const jobsController = require("../controllers/jobs.controller.js");
const { protect, isRecruiter } = require("../middlewares/auth.middleware.js");

// Correct routes
jobsRoute.post("/create", protect, isRecruiter,jobsController.createJob); // create jobs
jobsRoute.put("/:id", protect, isRecruiter, jobsController.updateJobId);
jobsRoute.delete("/:id", protect, isRecruiter, jobsController.deleteJobId);

jobsRoute.get("/", jobsController.fetchJobs); // fetch all jobs
jobsRoute.get("/:id", jobsController.fetchJobById);
jobsRoute.get("/recruiter/:recruiterId", jobsController.fetchJobsByRecruiter);
jobsRoute.get("/company/:companyId", jobsController.fetchJobsByCompany);



module.exports = jobsRoute;
