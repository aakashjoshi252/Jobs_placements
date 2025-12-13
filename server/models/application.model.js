const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    company: {
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
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Application", applicationSchema);
