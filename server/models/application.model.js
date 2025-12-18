const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "APPROVED"],
      default: "PENDING",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
    recruiterNote: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;