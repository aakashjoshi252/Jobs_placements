const Company = require("../models/company.model");
const Users = require("../models/user.model");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const logger = require('../utils/logger');

const companyController = {
  createCompany: async (req, res) => {
    try {
      logger.info("Creating company:", req.body.companyName);
      
      const {
        companyName, industry, companyType, size, establishedYear,
        website, location, description, contactEmail, contactNumber, recruiterId
      } = req.body;

      // Parse JSON arrays safely
      const parseJsonSafe = (str) => {
        try { return str ? JSON.parse(str) : []; } catch { return []; }
      };
      
      const specializations = parseJsonSafe(req.body.specializations);
      const certifications = parseJsonSafe(req.body.certifications);
      const workshopFacilities = parseJsonSafe(req.body.workshopFacilities);
      const branches = parseJsonSafe(req.body.branches);
      const socialMedia = parseJsonSafe(req.body.socialMedia);

      // **CLOUDINARY UPLOAD** - Handle logo buffer
      let uploadLogo = null;
      let cloudinaryPublicId = null;
      
      if (req.file?.buffer) {
        try {
          const result = await uploadToCloudinary(req.file.buffer, {
            folder: 'jobs_portal/companies',
            public_id: `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ],
          });
          uploadLogo = result.secure_url;
          cloudinaryPublicId = result.public_id;
          logger.info(`Logo uploaded: ${result.public_id}`);
        } catch (error) {
          logger.error('Cloudinary upload failed:', error.message);
          return res.status(500).json({ 
            message: 'Company created but logo upload failed', 
            error: error.message 
          });
        }
      }

      // Validation
      if (!companyName || !industry || !companyType || !size || 
          !establishedYear || !location || !description || 
          !contactEmail || !contactNumber || !recruiterId) {
        return res.status(400).json({ 
          message: "Missing required fields",
          missing: { companyName: !companyName, /* etc */ }
        });
      }

      // Recruiter check
      const recruiter = await Users.findById(recruiterId);
      if (!recruiter || recruiter.role !== "recruiter") {
        return res.status(403).json({ message: "Invalid recruiter" });
      }

      // Duplicate check
      const existing = await Company.findOne({
        recruiterId,
        $or: [{ contactEmail }, { contactNumber }]
      });
      if (existing) {
        return res.status(409).json({ 
          message: "Company with this email/phone exists",
          existingCompany: existing.companyName 
        });
      }

      // Create company
      const newCompany = await Company.create({
        uploadLogo,
        cloudinaryPublicId, // NEW FIELD
        companyName, industry, companyType, size, establishedYear,
        website, location, description, contactEmail, contactNumber,
        specializations, certifications, workshopFacilities, branches, socialMedia,
        recruiterId
      });

      res.status(201).json({
        message: "Company created successfully! 💎",
        data: newCompany
      });

    } catch (error) {
      logger.error("Create company error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Parse JSON fields
      const parseJsonSafe = (str) => {
        try {
          return str ? JSON.parse(str) : [];
        } catch {
          return [];
        }
      };

      const updateData = {
        ...req.body,
        specializations: parseJsonSafe(req.body.specializations),
        certifications: parseJsonSafe(req.body.certifications),
        workshopFacilities: parseJsonSafe(req.body.workshopFacilities),
        branches: parseJsonSafe(req.body.branches),
        socialMedia: parseJsonSafe(req.body.socialMedia),
      };


      // **CLOUDINARY UPDATE** - Delete old + upload new
      if (req.file?.buffer) {
        const company = await Company.findById(id).select('cloudinaryPublicId');
        if (company?.cloudinaryPublicId) {
          await deleteFromCloudinary(company.cloudinaryPublicId);
          logger.info(`Deleted old logo: ${company.cloudinaryPublicId}`);
        }
        
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: 'jobs_portal/companies',
          public_id: `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
        });
        updateData.uploadLogo = result.secure_url;
        updateData.cloudinaryPublicId = result.public_id;
      }

      const updated = await Company.findByIdAndUpdate(
        id, updateData, 
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json({ message: "Company updated!", data: updated });
    } catch (error) {
      logger.error("Update error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await Company.findById(id);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  getCompanyByRecruiterId: async (req, res) => {
    try {
      const { recruiterId } = req.params;
      const company = await Company.findOne({ recruiterId });
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json({ data: company });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await Company.findById(id).select('cloudinaryPublicId');
      
      if (company?.cloudinaryPublicId) {
        await deleteFromCloudinary(company.cloudinaryPublicId);
      }
      
      await Company.findByIdAndDelete(id);
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = companyController;