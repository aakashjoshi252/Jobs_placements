const Jobs = require("../models/jobs.model")
// const Users = require("../models/user.model")
const mongoose = require("mongoose");
const jobsController = ({
  createJob: async (req, res) => {
    try {
      const {
        title,
        description,
        jobLocation,
        jobType = "On-site",
        empType = "Full-time",
        experience = "Fresher",
        salary = "",
        openings = 1,
        deadline,
        skills = [],
        additionalRequirement = "",
        companyId,
        recruiterId,
        companyName,
        companyEmail,
        companyAddress,
      } = req.body;

      // Required Field Validation
      if (!title || !description || !jobLocation || !companyId || !recruiterId) {
        return res.status(401).json({ success: false, message: "Required fields are missing" });
      }

      // Ensure skills is always an array
      const skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());

      const newJob = await Jobs.create({
        title,
        description,
        jobLocation,
        jobType,
        empType,
        experience,
        salary,
        openings,
        deadline: deadline || new Date().toISOString().split("T")[0],
        skills: skillsArray,
        additionalRequirement,
        companyId,
        recruiterId,
        companyName: companyName,
        companyEmail: companyEmail,
        companyAddress: companyAddress,
      });

      return res.status(201).json({
        success: true,
        message: "Job created successfully",
        job: newJob,
      });

    } catch (error) {
      console.error("Create Job Error:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating job",
        error: error.message,
      });
    }
  },
  fetchJobs: async (req, res) => {
    try {
      const allJobs = await Jobs.find({}).populate("companyId", "companyName location").populate("recruiterId", "username email");
      res.status(200).json(allJobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs", error });
    }
  },
  fetchJobById: async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Jobs.findById(id).populate("companyId", "companyName location").populate("recruiterId", "username email");

      if (!job) return res.status(404).json({ message: "Job not found" });

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job", error });
    }
  },
  fetchJobsByRecruiter: async (req, res) => {
    try {
      const { recruiterId } = req.params;
      if (!recruiterId) {
        return res.status(400).json({ message: "Recruiter ID required!" });
      }
      const jobs = await Jobs.find({ recruiterId:recruiterId});
      // Proper empty check
      if (jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found for this recruiter!" });
      }
      res.status(200).json({ data: jobs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
  fetchJobsByCompany: async (req, res) => {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        return res.status(400).json({ message: "Recruiter ID required!" });
      }
      const jobs = await Jobs.find({ companyId:companyId});
      // Proper empty check
      if (jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found for this recruiter!" });
      }
      res.status(200).json({ data: jobs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
});

module.exports = jobsController;