const Applications = require("../models/application.model");
const Job = require("../models/jobs.model");
const Company = require("../models/company.model")
const Users = require("../models/user.model");

const applicationsController={
// APPLY FOR A JOB
// ------------------------------------
applyForJob : async (req, res) => {
  try {
    const { jobId, candidateId, resumeId, coverLetter = "" } = req.body;

    if (!jobId || !candidateId || !resumeId) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }

    const recruiterId = job.recruiterId;
    const company = await Company.findOne({ recruiterId });

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for recruiter!" });
    }

    const alreadyApplied = await Applications.findOne({ jobId, candidateId });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job!" });
    }

    const application = await Applications.create({
      jobId,
      candidateId,
      recruiterId,
      companyId: company._id,
      resumeId,
      coverLetter,
      status: "Applied",
    });

    return res.status(201).json({
      message: "Job applied successfully!",
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error!", error: error.message });
  }
},
// ------------------------------------
// UPDATE APPLICATION STATUS
// (Recruiter Only)
// ------------------------------------
updateApplicationStatus : async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, interviewDate, notes } = req.body;

    // Validate status
    const validStatus = [
      "Applied", 
      "Reviewed",
      "Shortlisted",
      "Interview-Scheduled",
      "Rejected",
      "Selected",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const application = await Applications.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found!" });
    }

    // Update fields
    application.status = status;

    if (interviewDate) application.interviewDate = interviewDate;
    if (notes) application.notes = notes;

    await application.save();

    res.status(200).json({
      message: "Application status updated!",
      application,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
},
// ------------------------------------
// GET APPLICATIONS FOR A CANDIDATE
// ------------------------------------
// controllers/applicationController.js

getApplicationsByCandidate : async (req, res) => {
  try {
    const { candidateId } = req.params; // from /applied/:candidateId

    if (!candidateId) {
      return res.status(400).json({ message: "candidateId is required" });
    }

    const applications = await Applications.find({ candidateId })
      .populate({
        path: "jobId",
        model: "Job",
        select: "title location salary jobType companyId",
        populate: {
          path: "companyId",
          model: "Company",
          select: "companyName",
        },
      })
      .populate({
        path: "resumeId",
        model: "Resume",
        select: "fileName createdAt",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Get Applied Jobs Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error!", error: error.message });
  }
},
// ------------------------------------
// GET APPLICATIONS FOR A RECRUITER
// (All applicants for their jobs)
// ------------------------------------
getApplicationsByRecruiter : async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const applications = await Applications.find({ recruiterId })
       .populate({
        path: "jobId",
        model: "Job",
        select: "title location salary jobType companyId",
        populate: {
          path: "companyId",
          model: "Company",
          select: "companyName",
        },
      })
      .populate({
        path: "resumeId",
        model: "Resume",
        select: "fileName createdAt",
      })
      .populate({
        path: "candidateId",
        model: "Users",
        select: "username email phone",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch Recruiter Applications Error:", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
},
// ------------------------------------
// GET APPLICATIONS FOR A SPECIFIC JOB
// (Applicants for one job)
// ------------------------------------
getApplicationsByJob : async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Applications.find({ jobId })
      .populate("candidateId")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch Job Applications Error:", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
},
getApplicationsById: async (req, res) => {
 try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id) {
      return res.status(400).json({ message: "Invalid Application ID" });
    }

    const application = await Applications.findById(id)
      .populate({
        path: "candidateId",
        model: "Users",
        select: "username email phone",
      })
      .populate({
        path: "jobId",
        model: "Job",
        select: "title location salary jobType description companyId",
        populate: {
          path: "companyId",
          model: "Company",
          select: "companyName logo",
        },
      })
      .populate({
        path: "resumeId",
        model: "Resume",
        select: "fullName jobTitle skills experiences education languages summary address phone email",
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
}
};



module.exports= applicationsController;