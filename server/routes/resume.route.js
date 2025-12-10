const express=require("express");
const resumeRoute= express.Router()
const resumeController= require("../controllers/resume.controller")

resumeRoute.post("/create", resumeController.createResume);
resumeRoute.get("/:candidateId", resumeController.getResumeByCandidate);
resumeRoute.get("/resume/:id",resumeController.getResumeById);
// resumeRoute.delete("/:id",resumeController.deleteResume);

module.exports=resumeRoute