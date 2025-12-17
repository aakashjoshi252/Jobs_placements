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
        jobId: jobId,
        candidateId: candidateId
      });

      if (existing) {
        return res.status(400).json({
          message: "Already applied to this job"
        });
      }

      // Create application 
      const application = await Application.create({
        jobId: jobId,
        candidateId: candidateId,
        recruiterId: job.recruiterId,
        companyId: job.companyId,
        resumeId: req.body.resumeId,
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
  getApplicationsByRecruiter: async (req, res) => {
    try {
      const recruiterId = req.user._id;
      // Allow only recruiters
      if (req.user.role !== "recruiter") {
        return res.status(403).json({
          message: "Only recruiters can view received applications"
        });
      }
      const applications = await Application.find({
        recruiterId: recruiterId
      })
        .populate("jobId")
        .populate("companyId")
        .populate("resumeId")
        .populate("candidateId", "username email")
        .sort({ createdAt: -1 });
      return res.status(200).json({
        message: "Received applications fetched successfully",
        data: applications
      });
    } catch (error) {
      console.error("Get Received Applications Error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  },
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
  getCandidateData: async (req, res) => {
    try {
      const recruiterId = req.user._id;
      const { id } = req.params;

      // Only recruiters allowed
      if (req.user.role !== "recruiter") {
        return res.status(403).json({
          message: "Only recruiters can access candidate data"
        });
      }

      const application = await Application.findById(id)
        .populate({
          path: "candidateId",
          select: "username email phone"
        })
        .populate({
          path: "resumeId",
          select: "education experience skills"
        })
        .populate({
          path: "jobId",
          select: "title description salary jobLocation"
        });

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

      res.status(200).json({
        message: "Candidate data fetched successfully",
        candidateData: application.candidateId,
        jobData: application.job
      });

    } catch (error) {
      console.error("Get Candidate Data Error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  },
};


module.exports = applicationController;