const Job = require("../models/jobs.model");
const Application = require("../models/application.model");
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