const express=require("express");
const resumeRoute= express.Router()
const resumeController= require("../controllers/resume.controller")
const {protect, isCandidate}= require("../middlewares/auth.middleware")

resumeRoute.post("/create", protect,isCandidate,resumeController.createResume);
resumeRoute.get("/:candidateId", resumeController.getResumeByCandidate);
resumeRoute.get("/resume/:id",protect,resumeController.getResumeById);
// resumeRoute.delete("/:id",resumeController.deleteResume);

module.exports=resumeRoute