const express = require("express");
const jobsRoute = express.Router();
const jobsController = require("../controllers/jobs.controller.js");

// Correct routes
jobsRoute.post("/create", jobsController.createJob); // create jobs
jobsRoute.get("/", jobsController.fetchJobs);
jobsRoute.get("/:id", jobsController.fetchJobById);
jobsRoute.get("/recruiter/:recruiterId", jobsController.fetchJobsByRecruiter);
jobsRoute.get("/company/:companyId", jobsController.fetchJobsByCompany);
// jobsRoute.put("/:id", jobsController.updateJob);
// jobsRoute.delete("/:id", jobsController.deleteJob);

module.exports = jobsRoute;
