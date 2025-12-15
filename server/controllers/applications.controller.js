const Application = require("../models/application.model");
const Job = require("../models/jobs.model");

const applicationController = {
  //candidate applies for a job
  applyJob: async (req, res) => {
    try {
      const { jobId } = req.body;
      const candidateId = req.user._id;

      // Allow only candidates
      if (req.user.role !== "candidate") {
        return res.status(403).json({
          message: "Only candidates can apply for jobs"
        });
      }

      // Check job exists
      const job = await Job.findById(jobId).populate("companyId");
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Prevent recruiter applying to own job
      if (job.recruiterId.toString() === candidateId.toString()) {
        return res.status(400).json({
          message: "Recruiter cannot apply to their own job"
        });
      }

      // Prevent duplicate application
      const existing = await Application.findOne({
        job: jobId,
        candidate: candidateId
      });

      if (existing) {
        return res.status(400).json({
          message: "Already applied to this job"
        });
      }

      // Create application (USE CORRECT FIELD NAMES)
      const application = await Application.create({
        jobId: jobId,
        candidateId: candidateId,
        recruiterId: job.recruiterId,
        companyId: job.companyId,
        status: "PENDING"
      });

      res.status(201).json({
        message: "Job applied successfully",
        application
      });

    } catch (error) {
      console.error("Apply Job Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

 getApplicationsByCandidate: async (req, res) => {
  try {
    const candidateId = req.user._id;

    // Allow only candidates
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can view their applications"
      });
    }

    const applications = await Application.find({
      candidateId: candidateId
    })
      .populate("jobId")
      .populate("companyId")
      .populate("recruiterId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Applications fetched successfully",
      data: applications
    });

  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}
,
  // Recruiter updates application status
  applicationStatus: async (req, res) => {
    try {
      const recruiterId = req.user._id;
      const { applicationId } = req.params;
      const { status } = req.body;

      // Allow only recruiters
      if (req.user.role !== "recruiter") {
        return res.status(403).json({
          message: "Only recruiters can update application status"
        });
      }

      // Allowed statuses
      const allowedStatuses = [
        "PENDING",
        "REVIEWED",
        "SHORTLISTED",
        "REJECTED",
        "APPROVED"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value"
        });
      }

      const application = await Application.findById(applicationId)
        .populate("jobId");

      if (!application) {
        return res.status(404).json({
          message: "Application not found"
        });
      }

      // Check recruiter owns this application
      if (application.recruiterId.toString() !== recruiterId.toString()) {
        return res.status(403).json({
          message: "Not authorized"
        });
      }

      // Prevent updating after final decision
      if (
        application.status === "APPROVED" ||
        application.status === "REJECTED"
      ) {
        return res.status(400).json({
          message: `Cannot change status after ${application.status}`
        });
      }

      // Update status
      application.status = status;
      await application.save();

      res.status(200).json({
        message: `Application status updated to ${status}`,
        application
      });

    } catch (error) {
      console.error("Application Status Error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  },
  getApplicationsByRecruiter: async (req, res) => {
    try {
      const recruiterId = req.user.id;
      const applications = await Application.find({ recruiter: recruiterId })
        .populate("job")
        .populate("company")
        .populate("candidate", "name email");
      res.json({ applications });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateApplicationStatus: async (req, res) => {
    try {
      const recruiterId = req.user.id;
      const { applicationId } = req.params;
      const { status } = req.body;
      const application = await Application.findById(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.recruiter.toString() !== recruiterId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      application.status = status;
      await application.save();
      res.json({
        message: "Application status updated",
        application,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};


module.exports = applicationController;