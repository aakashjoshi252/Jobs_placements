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

// NEW: Jewelry-specific certification schema
const CertificationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: [
      "GIA (Gemological Institute of America)",
      "IGI (International Gemological Institute)",
      "HRD Antwerp",
      "AGS (American Gem Society)",
      "NIGm (National Institute of Gemology Mumbai)",
      "BIS Hallmark Certification",
      "JJA (Jewellers Association)",
      "CAD Software Certification (Rhino, Matrix, JewelCAD)",
      "3D Printing Certification",
      "Jewelry Design Diploma",
      "Goldsmith Certification",
      "Other"
    ]
  },
  issuingOrganization: { type: String, required: true },
  issueDate: { type: String },
  expiryDate: { type: String },
  certificateUrl: { type: String }
});

// NEW: Portfolio schema for designers
const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    enum: ["Ring", "Necklace", "Bracelet", "Earring", "Pendant", "Brooch", "Custom Design", "CAD Model", "Other"]
  },
  materials: { type: [String] },
  techniques: { type: [String] },
  year: { type: String }
});

const ResumeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    summary: { type: String, required: true },

    // JEWELRY INDUSTRY SPECIFIC FIELDS
    specialization: {
      type: [String],
      enum: [
        "Jewelry Designer",
        "CAD Designer",
        "Goldsmith",
        "Silversmith",
        "Stone Setter",
        "Polisher",
        "Gemologist",
        "Diamond Grader",
        "Quality Controller",
        "Sales Consultant",
        "Store Manager",
        "Production Manager",
        "Bench Jeweler",
        "Engraver",
        "Casting Specialist",
        "Other"
      ]
    },
    
    materialsExpertise: {
      type: [String],
      enum: [
        "Gold (22K, 18K, 14K)",
        "Silver (925 Sterling)",
        "Platinum",
        "Diamonds",
        "Precious Gemstones",
        "Semi-Precious Stones",
        "Pearls",
        "Lab-Grown Diamonds",
        "Kundan",
        "Meenakari",
        "Polki"
      ]
    },
    
    technicalSkills: {
      type: [String],
      enum: [
        "Hand Fabrication",
        "CAD/CAM (Rhino, Matrix, JewelCAD)",
        "3D Printing",
        "Casting",
        "Stone Setting",
        "Soldering",
        "Polishing",
        "Engraving",
        "Enameling",
        "Filigree Work",
        "Traditional Techniques"
      ]
    },

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
    
    // NEW: Certifications
    certifications: {
      type: [CertificationSchema],
      default: []
    },
    
    // NEW: Portfolio (especially for designers)
    portfolio: {
      type: [PortfolioSchema],
      default: []
    },
    
    // Portfolio website link
    portfolioWebsite: {
      type: String
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