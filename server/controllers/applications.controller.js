const Application = require("../models/application.model");
const Job = require("../models/jobs.model");
const Company = require("../models/company.model")
const Users = require("../models/user.model");

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.id;

    // check job exists
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // prevent duplicate application
    const existing = await Application.findOne({
      job: jobId,
      candidate: candidateId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      recruiter: job.createdBy,
      company: job.company,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 exports.approveApplication = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // check recruiter owns the job
    if (application.recruiter.toString() !== recruiterId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = "APPROVED";
    await application.save();

    res.json({
      message: "Application approved",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 exports.rejectApplication = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.recruiter.toString() !== recruiterId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = "REJECTED";
    await application.save();

    res.json({
      message: "Application rejected",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};