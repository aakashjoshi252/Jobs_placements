const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  experienceTitle: { type: String, required: true },
  duration: { type: String, required: true },
  workDetails: { type: String, required: true }
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true }
});

const ResumeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    summary: { type: String, required: true },

    skills: {
      type: [String],
      required: true,
      default: []
    },

    experiences: {
      type: [ExperienceSchema],
      required: true,
      default: []
    },

    education: {
      type: [EducationSchema],
      required: true,
      default: []
    },

    languages: {
      type: [String],
      required: true,
      default: []
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

const Resume = mongoose.model("Resume", ResumeSchema);
module.exports = Resume;