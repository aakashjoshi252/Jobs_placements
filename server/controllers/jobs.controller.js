const Job = require("../models/jobs.model")
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

      const newJob = await Job.create({
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
      const allJobs = await Job.find({})
      .populate("companyId", "companyName location")
      .populate("recruiterId", "username email");
      res.status(200).json(allJobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs", error });
    }
  },

  fetchJobById: async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findById(id)
        .populate("companyId", "companyName location")
        .populate("recruiterId", "username email");

      if (!job) return res.status(404).json({ message: "Job not found" });

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job", error });
    }
  },

  // NEW: Fetch featured jobs (most recent or most openings)
  fetchFeaturedJobs: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      
      // Fetch jobs with most openings and recent postings
      const featuredJobs = await Job.find({})
        .populate("companyId", "companyName location logo")
        .populate("recruiterId", "username email")
        .sort({ openings: -1, createdAt: -1 }) // Sort by openings descending, then recent
        .limit(limit);

      res.status(200).json({
        success: true,
        count: featuredJobs.length,
        data: featuredJobs,
      });
    } catch (error) {
      console.error("Fetch Featured Jobs Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Error fetching featured jobs", 
        error: error.message 
      });
    }
  },

  // NEW: Get job categories with counts
  fetchJobCategories: async (req, res) => {
    try {
      // Aggregate jobs by different categories
      const categoriesByExperience = await Job.aggregate([
        {
          $group: {
            _id: "$experience",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1,
          },
        },
      ]);

      const categoriesByJobType = await Job.aggregate([
        {
          $group: {
            _id: "$jobType",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1,
          },
        },
      ]);

      const categoriesByEmpType = await Job.aggregate([
        {
          $group: {
            _id: "$empType",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1,
          },
        },
      ]);

      // Get top skills
      const topSkills = await Job.aggregate([
        { $unwind: "$skills" },
        {
          $group: {
            _id: "$skills",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            skill: "$_id",
            count: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: {
          experience: categoriesByExperience,
          jobType: categoriesByJobType,
          employmentType: categoriesByEmpType,
          topSkills: topSkills,
        },
      });
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Error fetching job categories", 
        error: error.message 
      });
    }
  },

  fetchJobsByRecruiter: async (req, res) => {
    try {
      const { recruiterId } = req.params;
      if (!recruiterId) {
        return res.status(400).json({ message: "Recruiter ID required!" });
      }
      const jobs = await Job.find({ recruiterId:recruiterId});
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
        return res.status(400).json({ message: "Company ID required!" });
      }
      const jobs = await Job.find({ companyId:companyId});
      // Proper empty check
      if (jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found for this company!" });
      }
      res.status(200).json({ data: jobs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  },

  updateJobId: async (req, res) => {
    try {
     const { id } = req.params;
     const updates = req.body;
     const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });
     if (!updatedJob) {
       return res.status(404).json({ message: "Job not found" });
     }

      return res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
       return res.status(500).json({ message: "Error updating job", error });
    }
    
  },

  deleteJobId: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedJob = await Job.findByIdAndDelete(id);
      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting job", error });
    }
  },
});

module.exports = jobsController;