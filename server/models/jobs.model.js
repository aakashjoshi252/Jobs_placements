const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["On-site", "Hybrid"],
    default: "On-site",
  },
  empType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Hourly"],
    default: "Full-time",
  },
  experience: {
    type: String,
    enum: ["Fresher", "Junior", "Mid", "Senior"],
    default: "Fresher",
  },
  salary: {
    type: String, // example: "20k-40k", "2-5 LPA"
    required: true,
  },
  openings: {
    type: Number,
    default: 1,
  },
  deadline: {
    type: Date,
  },
  skills: {
    type: [String],
    required: true,
  },
  additionalRequirement: {
    type: String,
  },
  // Company info from company model reference
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  // Only recruiter of that company can post job
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  // Optional display fields (redundant but useful for UI)
  companyName: {
    type: String,
  },
  companyEmail: {
    type: String,
  },
  companyAddress: {
    type: String,
  },
}, { timestamps: true, versionKey: false });

const Job = mongoose.model("Job", jobsSchema);
module.exports = Job;
