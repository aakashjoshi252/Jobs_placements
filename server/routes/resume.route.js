const express=require("express");
const resumeRoute= express.Router()
const resumeController= require("../controllers/resume.controller")
const {protect, isCandidate}= require("../middlewares/auth.middleware")

resumeRoute.post("/create", protect,isCandidate,resumeController.createResume);
resumeRoute.get("/:candidateId",protect,resumeController.getResumeByCandidate);
resumeRoute.get("/resume/:id",protect,resumeController.getResumeById);
resumeRoute.put("/update/:id",protect,isCandidate,resumeController.updateResume);
resumeRoute.delete("/delete/:id",protect,isCandidate,resumeController.deleteResume);

module.exports=resumeRoute