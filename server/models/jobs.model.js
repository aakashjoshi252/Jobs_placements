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
  
  // JEWELRY INDUSTRY SPECIFIC FIELDS
  jewelryCategory: {
    type: String,
    enum: [
      "Design",
      "Manufacturing",
      "Sales & Retail",
      "Quality Control",
      "Management",
      "CAD/CAM",
      "Gemology",
      "Other"
    ],
    required: true,
  },
  
  jewelrySpecialization: {
    type: [String],
    enum: [
      // Design
      "Jewelry Designer",
      "CAD Designer",
      "3D Modeler",
      "Product Developer",
      
      // Manufacturing
      "Goldsmith",
      "Silversmith",
      "Stone Setter",
      "Polisher",
      "Casting Specialist",
      "Engraver",
      "Bench Jeweler",
      "Laser Technician",
      
      // Gemology
      "Gemologist",
      "Diamond Grader",
      "Gem Setter",
      
      // Quality
      "Quality Controller",
      "Quality Assurance Manager",
      
      // Sales
      "Sales Associate",
      "Store Manager",
      "Showroom Manager",
      "Sales Consultant",
      
      // Management
      "Production Manager",
      "Workshop Manager",
      "Operations Manager",
      "Supply Chain Manager",
      
      // Other
      "Photographer",
      "Marketing Specialist",
      "Customer Service"
    ],
  },
  
  materialsExperience: {
    type: [String],
    enum: [
      "Gold (22K, 18K, 14K)",
      "Silver (925 Sterling)",
      "Platinum",
      "Diamonds",
      "Precious Gemstones (Ruby, Sapphire, Emerald)",
      "Semi-Precious Stones",
      "Pearls",
      "Lab-Grown Diamonds",
      "Kundan",
      "Meenakari",
      "Polki",
      "Jadau"
    ],
  },
  
  techniquesProficiency: {
    type: [String],
    enum: [
      "Hand Fabrication",
      "CAD/CAM Design (Rhino, Matrix, JewelCAD)",
      "3D Printing",
      "Casting (Lost Wax, Investment)",
      "Stone Setting (Prong, Bezel, Pave, Channel)",
      "Soldering",
      "Polishing & Finishing",
      "Engraving (Hand/Laser)",
      "Enameling",
      "Filigree Work",
      "Traditional Indian Techniques"
    ],
  },
  
  certifications: {
    type: [String],
    enum: [
      "GIA (Gemological Institute of America)",
      "IGI (International Gemological Institute)",
      "HRD Antwerp",
      "AGS (American Gem Society)",
      "NIGm (National Institute of Gemology Mumbai)",
      "BIS Hallmark Certification",
      "JJA (Jewellers Association)",
      "CAD Software Certification",
      "Not Required"
    ],
  },
  
  // GENERAL JOB FIELDS
  jobLocation: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["On-site", "Hybrid", "Remote"],
    default: "On-site",
  },
  empType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Hourly", "Freelance"],
    default: "Full-time",
  },
  experience: {
    type: String,
    enum: ["Fresher", "Junior (1-3 years)", "Mid (3-6 years)", "Senior (6+ years)", "Master Craftsman"],
    default: "Fresher",
  },
  salary: {
    type: String,
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
  
  // Portfolio requirement
  portfolioRequired: {
    type: Boolean,
    default: false,
  },
  
  // Company info
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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