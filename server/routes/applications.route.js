const express = require("express")
const applicationsRoute = express.Router();
const applicationController = require("../controllers/applications.controller");
const { protect, isRecruiter, isCandidate, } = require("../middlewares/auth.middleware");

// Candidate applies
applicationsRoute.post("/apply", protect, isCandidate, applicationController.applyJob);
applicationsRoute.get("/applied/:candidateId", protect, isCandidate,applicationController.getApplicationsByCandidate);

// Recruiter actions
applicationsRoute.get("/received/:recruiterId", protect, isRecruiter, applicationController.getApplicationsByRecruiter);
applicationsRoute.get("/:applicationId", protect,isRecruiter, applicationController.getApplicationById);
applicationsRoute.patch("/status/:applicationId", protect, isRecruiter, applicationController.applicationStatus);
applicationsRoute.get("/candidatedata/:id", protect, isRecruiter, applicationController.getCandidateData);


module.exports = applicationsRoute;