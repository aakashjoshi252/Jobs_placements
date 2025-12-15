const express = require("express")
const applicationsRoute = express.Router();
const applicationController = require("../controllers/applications.controller");
const { protect, isRecruiter, isCandidate, } = require("../middlewares/auth.middleware");

// Candidate applies
applicationsRoute.post("/apply", protect, isCandidate, applicationController.applyJob);
applicationsRoute.get("/applied/:candidateId", protect, isCandidate,applicationController.getApplicationsByCandidate);

// Recruiter actions
applicationsRoute.patch("/status/:applicationId", protect, isRecruiter, applicationController.applicationStatus);

// router.get("/candidatedata/:id", protect, isRecruiter, getCandidateData);
// applicationsRoute.put("/status/:id", protect, isRecruiter, updateStatus);


module.exports = applicationsRoute;