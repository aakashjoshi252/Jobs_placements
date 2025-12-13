const express = require("express")
const applicationsRoute = express.Router();

const { applyJob, approveApplication, rejectApplication, } = require("../controllers/applications.controller");
const { protect, isRecruiter, isCandidate, } = require("../middlewares/auth.middleware");

// Candidate applies
applicationsRoute.post("/apply", protect, isCandidate, applyJob);

// Recruiter actions
applicationsRoute.patch("/approve/:applicationId", protect, isRecruiter, approveApplication);
applicationsRoute.patch("/reject/:applicationId", protect, isRecruiter, rejectApplication);



module.exports = applicationsRoute;