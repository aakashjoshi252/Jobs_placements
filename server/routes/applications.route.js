const express = require("express")
const applicationsRoute = express.Router();

const { applyJob, approveApplication, rejectApplication, } = require("../controllers/applications.controller");
const { protect, isRecruiter, isCandidate, } = require("../middlewares/auth.middleware");

// Candidate applies
applicationsRoute.post("/apply", protect, isCandidate, applyJob);

// Recruiter actions
applicationsRoute.patch("/approve/:applicationId", protect, isRecruiter, approveApplication);
applicationsRoute.patch("/reject/:applicationId", protect, isRecruiter, rejectApplication);

// router.post("/", protect, isCandidate, applyJob);
// router.get("/applied/:id", protect, isCandidate, getAppliedJobs);

// router.get("/candidatedata/:id", protect, isRecruiter, getCandidateData);
// applicationsRoute.put("/status/:id", protect, isRecruiter, updateStatus);


module.exports = applicationsRoute;