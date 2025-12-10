const express= require("express")
const applicationsRoute= express.Router();
const applicationsController= require("../controllers/applications.controller")

applicationsRoute.post("/apply", applicationsController.applyForJob);
applicationsRoute.put("/status/:applicationId", applicationsController.updateApplicationStatus);
applicationsRoute.get("/candidatedata/:id", applicationsController.getApplicationsById);
applicationsRoute.get("/applied/:candidateId", applicationsController.getApplicationsByCandidate);
applicationsRoute.get("/recruiter/:recruiterId", applicationsController.getApplicationsByRecruiter);
// applicationsRoute.get("/job/:jobId", applicationsController.getApplicationsByJob);


module.exports= applicationsRoute;