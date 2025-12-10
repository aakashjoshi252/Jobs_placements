const Company = require("../models/company.model");
const Users = require("../models/user.model");
const mongoose = require("mongoose");
const companyController = ({
  // creating company 
  createCompany: async (req, res) => {
    try {
      // Align field names to your schema
      const { uploadLogo,companyName,industry,size,establishedYear,website,location,description,contactEmail,contactNumber,recruiterId,} = req.body;

      // Basic required validation (can be improved by schema validation only)
      if (!companyName || !location || !contactEmail || !contactNumber || !recruiterId) {
        return res.status(400).json({ message: "Please enter all required inputs" });
      }
      // Check recruiter existence & role
      const recruiter = await Users.findById(recruiterId);
      if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
      if (recruiter.role !== "recruiter") {
        return res.status(403).json({ message: "You don't have access" });
      }
      // Duplicate check on contactEmail or contactNumber for the same recruiter
      const existCompany = await Company.findOne({
        recruiterId,
        $or: [{ contactEmail }, { contactNumber }],
      });

      if (existCompany) {
        return res.status(409).json({
          message: "Company already exists.",
          data: existCompany,
        });
      }

      // Create company with aligned fields, relying on schema validation
      const newCompany = await Company.create({
        uploadLogo,
        companyName,
        industry,
        size,
        establishedYear,
        website,
        location,
        description,
        contactEmail,
        contactNumber,
        recruiterId,
      });

      return res.status(201).json({
        message: "Company created successfully",
        data: newCompany,
      });
    } catch (error) {
      console.error("Error creating Company:", error);

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          message: "Duplicate field value entered",
          error: error.keyValue,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }, 
  getCompanyById : async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Company ID is required!" });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found!" });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error("Company fetch error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
},

getCompanyByRecruiterId: async (req, res) => {
  try {
    const { recruiterId } = req.params;
    if (!recruiterId) return res.status(400).json({ message: "Recruiter ID required!" });
    
    const company = await Company.findOne({recruiterId: new mongoose.Types.ObjectId(recruiterId)});

    if (!company) return res.status(404).json({ message: "Company not found!" })

    return res.status(200).json({ data: company });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
},
})

module.exports = companyController;