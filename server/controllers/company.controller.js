const Company = require("../models/company.model");
const Users = require("../models/user.model");
const mongoose = require("mongoose");

const companyController = {

  createCompany: async (req, res) => {
    try {
      console.log("Received body:", req.body);
      
      const {
        companyName,
        industry,
        companyType,
        size,
        establishedYear,
        website,
        location,
        description,
        contactEmail,
        contactNumber,
        recruiterId
      } = req.body;

      // Parse JSON strings from FormData
      let specializations = [];
      let certifications = [];
      let workshopFacilities = [];
      let branches = [];
      let socialMedia = {};

      try {
        if (req.body.specializations) {
          specializations = JSON.parse(req.body.specializations);
        }
        if (req.body.certifications) {
          certifications = JSON.parse(req.body.certifications);
        }
        if (req.body.workshopFacilities) {
          workshopFacilities = JSON.parse(req.body.workshopFacilities);
        }
        if (req.body.branches) {
          branches = JSON.parse(req.body.branches);
        }
        if (req.body.socialMedia) {
          socialMedia = JSON.parse(req.body.socialMedia);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
      }

      // Save upload URL (logo is optional now)
      const uploadLogoUrl = req.file ? `/uploads/${req.file.filename}` : null;

      // Required fields validation
      if (
        !companyName ||
        !industry ||
        !companyType || // NEW REQUIRED FIELD
        !size ||
        !establishedYear ||
        !location ||
        !description ||
        !contactEmail ||
        !contactNumber ||
        !recruiterId
      ) {
        return res.status(400).json({ 
          message: "Please enter all required fields",
          missing: {
            companyName: !companyName,
            industry: !industry,
            companyType: !companyType,
            size: !size,
            establishedYear: !establishedYear,
            location: !location,
            description: !description,
            contactEmail: !contactEmail,
            contactNumber: !contactNumber,
            recruiterId: !recruiterId
          }
        });
      }

      // Check recruiter exists
      const recruiter = await Users.findById(recruiterId);
      if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
      if (recruiter.role !== "recruiter") {
        return res.status(403).json({ message: "You don't have access" });
      }

      // Check email or phone already used by same recruiter
      const existCompany = await Company.findOne({
        recruiterId,
        $or: [{ contactEmail }, { contactNumber }]
      });

      if (existCompany) {
        return res.status(409).json({
          message: "Company with this email or phone already exists.",
          data: existCompany.companyName || null
        });
      }

      // Create company with jewelry fields
      const newCompany = await Company.create({
        uploadLogo: uploadLogoUrl,
        companyName,
        industry,
        companyType, // NEW
        specializations, // NEW
        certifications, // NEW
        workshopFacilities, // NEW
        branches, // NEW
        socialMedia, // NEW
        size,
        establishedYear,
        website,
        location,
        description,
        contactEmail,
        contactNumber,
        recruiterId
      });

      console.log("Company created successfully:", newCompany._id);

      return res.status(201).json({
        message: "💎 Jewelry business registered successfully!",
        data: newCompany
      });

    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  },

  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Company ID is required!" });
      }

      const company = await Company.findById(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found!" });
      }
      
      const companyData = {
        ...company.toObject(),
        uploadLogo: company.uploadLogo
          ? `${req.protocol}://${req.get("host")}${company.uploadLogo}`
          : null,
      };
      
      return res.status(200).json(companyData);

    } catch (error) {
      console.error("Company fetch error:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  getCompanyByRecruiterId: async (req, res) => {
    try {
      const { recruiterId } = req.params;

      if (!recruiterId) {
        return res.status(400).json({
          message: "Recruiter ID is required",
        });
      }

      const company = await Company.findOne({ recruiterId });

      if (!company) {
        return res.status(404).json({
          message: "Company not found",
        });
      }

      const companyData = {
        ...company.toObject(),
        uploadLogo: company.uploadLogo
          ? `${req.protocol}://${req.get("host")}${company.uploadLogo}`
          : null,
      };

      return res.status(200).json({
        data: companyData,
      });
    } catch (error) {
      console.error("Get Company Error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  
  updateCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Parse JSON fields if they exist
      if (req.body.specializations) {
        try {
          updateData.specializations = JSON.parse(req.body.specializations);
        } catch (e) {
          console.error("Error parsing specializations:", e);
        }
      }
      
      if (req.body.certifications) {
        try {
          updateData.certifications = JSON.parse(req.body.certifications);
        } catch (e) {
          console.error("Error parsing certifications:", e);
        }
      }
      
      if (req.body.workshopFacilities) {
        try {
          updateData.workshopFacilities = JSON.parse(req.body.workshopFacilities);
        } catch (e) {
          console.error("Error parsing workshopFacilities:", e);
        }
      }
      
      if (req.body.branches) {
        try {
          updateData.branches = JSON.parse(req.body.branches);
        } catch (e) {
          console.error("Error parsing branches:", e);
        }
      }
      
      if (req.body.socialMedia) {
        try {
          updateData.socialMedia = JSON.parse(req.body.socialMedia);
        } catch (e) {
          console.error("Error parsing socialMedia:", e);
        }
      }
      
      if (req.file) {
        updateData.uploadLogo = `/uploads/${req.file.filename}`;
      }
      
      const updatedCompany = await Company.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      return res.status(200).json({
        message: "Company updated successfully",
        data: updatedCompany
      });
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  },
  
  deleteCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCompany = await Company.findByIdAndDelete(id);
      
      if (!deletedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      return res.status(200).json({ 
        message: "Company deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  },
};

module.exports = companyController;
