const Job = require("../models/jobs.model");
const Application = require("../models/application.model");
const User = require("../models/user.model");  
const Company = require("../models/company.model");
const mongoose = require("mongoose");

exports.recruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // 1️⃣ Total jobs posted by recruiter
    const totalJobs = await Job.countDocuments({
      recruiterId,
    });

    // 2️⃣ Find recruiter's jobs
    const recruiterJobs = await Job.find({ recruiterId }).select("_id");

    const jobIds = recruiterJobs.map(job => job._id);

    // 3️⃣ Total applications on recruiter's jobs
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // 4️⃣ Shortlisted candidates
    const shortlisted = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: "Shortlisted",
    });

    // 5️⃣ Selected candidates
    const selected = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: "Selected",
    });

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        shortlisted,
        selected,
      },
    });
  } catch (error) {
    console.error("Recruiter dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
exports.candidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user._id;
    // 1️⃣ Total applications by candidate
    const totalApplications = await Application.countDocuments({
      candidateId,
    });
    // 2️⃣ Applications status count
    const pending = await Application.countDocuments({
      candidateId,
      status: "Pending",
    });
    const shortlisted = await Application.countDocuments({
      candidateId,
      status: "Shortlisted",
    });
    const selected = await Application.countDocuments({
      candidateId,
      status: "Selected",
    });
    const rejected = await Application.countDocuments({
      candidateId,
      status: "Rejected",
    })
    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        pending,
        shortlisted,
        selected,
        rejected
      },
    });
  } catch (error) {
    console.error("Candidate dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
exports.adminDashboard = async (req, res) => {
  try {
    // 1️⃣ Total users
    const User = mongoose.model("User");
    const totalUsers = await User.countDocuments();
    // 2️⃣ Total jobs
    const totalJobs = await Job.countDocuments();
    // 3️⃣ Total applications
    const totalApplications = await Application.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
// ---------------------- Global Stats Controllers ------------------ //
exports.getjobsCount = async (req, res) => {
  try {
    const jobsCount = await Job.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        jobsCount,
      },
    });
  } catch (error) {
    console.error("Get jobs count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get jobs count",
    });
  }
};
exports.getapplicationsCount = async (req, res) => {
  try {
    const applicationsCount = await Application.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        applicationsCount,
      },
    });
  } catch (error) {
    console.error("Get applications count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get applications count",
    });
  } 
};
exports.getrecruitersCount = async (req, res) => {
  try {
    
    const recruitersCount = await User.countDocuments({ role: "recruiter" });
    res.status(200).json({
      success: true,  
      data: {
        recruitersCount,
      },
    });
  } catch (error) {
    console.error("Get recruiters count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get recruiters count",
    });
  } 
};
exports.getcandidatesCount = async (req, res) => {
  try {
    
    const candidatesCount = await User.countDocuments({ role: "candidate" });
    res.status(200).json({  
      success: true,
      data: {
        candidatesCount,
      },
    });
  } catch (error) {
    console.error("Get candidates count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get candidates count",
    });
  }
};
exports.getcompaniesCount = async (req, res) => {
  try {
    const companiesCount = await Company.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        companiesCount,
      },
    });
  } catch (error) {
    console.error("Get companies count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get companies count",
    });
  }
};