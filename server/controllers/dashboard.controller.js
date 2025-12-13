const Job = require("../models/jobs.model");
const Application = require("../models/application.model");

exports.recruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const totalJobs = await Job.countDocuments({ createdBy: recruiterId });

    const applications = await Application.find({ recruiter: recruiterId });

    const stats = {
      totalJobs,
      totalApplications: applications.length,
      pending: applications.filter(a => a.status === "PENDING").length,
      approved: applications.filter(a => a.status === "APPROVED").length,
      rejected: applications.filter(a => a.status === "REJECTED").length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.candidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.find({ candidate: candidateId });

    const stats = {
      totalApplied: applications.length,
      pending: applications.filter(a => a.status === "PENDING").length,
      approved: applications.filter(a => a.status === "APPROVED").length,
      rejected: applications.filter(a => a.status === "REJECTED").length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
