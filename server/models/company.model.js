const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    uploadLogo: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    
    // JEWELRY INDUSTRY SPECIFIC
    industry: {
      type: String,
      default: "Jewelry & Gems",
      required: true,
    },
    
    companyType: {
      type: String,
      enum: [
        "Jewelry Manufacturer",
        "Jewelry Retailer",
        "Jewelry Wholesaler",
        "Jewelry Designer Studio",
        "Gemstone Dealer",
        "Diamond Trading",
        "Jewelry Export House",
        "CAD/CAM Service Provider",
        "Jewelry School/Institute",
        "E-commerce Jewelry Platform",
        "Custom Jewelry Workshop",
        "Antique & Vintage Jewelry",
        "Other"
      ],
      required: true,
    },
    
    specializations: {
      type: [String],
      enum: [
        "Gold Jewelry",
        "Diamond Jewelry",
        "Silver Jewelry",
        "Platinum Jewelry",
        "Bridal Jewelry",
        "Fashion Jewelry",
        "Traditional Indian Jewelry",
        "Contemporary Designs",
        "Custom/Bespoke Jewelry",
        "Fine Jewelry",
        "Costume Jewelry",
        "Watches",
        "Gemstones & Diamonds (Loose)",
        "Lab-Grown Diamonds",
        "Repair & Restoration"
      ],
    },
    
    certifications: {
      type: [String],
      enum: [
        "BIS Hallmark Certified",
        "ISO Certified",
        "RJC (Responsible Jewellery Council)",
        "Kimberley Process Certified",
        "Fair Trade Certified",
        "Conflict-Free Diamond Source",
        "GIA Authorized Dealer",
        "IGI Partner",
        "None"
      ],
    },
    
    workshopFacilities: {
      type: [String],
      enum: [
        "In-house Design Studio",
        "CAD/CAM Lab",
        "3D Printing Facility",
        "Casting Workshop",
        "Stone Setting Department",
        "Polishing Unit",
        "Quality Testing Lab",
        "Gemology Lab",
        "Laser Engraving",
        "Photography Studio"
      ],
    },
    
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      required: true,
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    website: String,
    location: {
      type: String,
      required: true,
    },
    
    // Additional locations for multi-branch jewelry stores
    branches: [{
      city: String,
      address: String,
      type: {
        type: String,
        enum: ["Retail Store", "Workshop", "Warehouse", "Office"]
      }
    }],
    
    description: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      unique: true,
    },
    
    // Social media (important for jewelry showcases)
    socialMedia: {
      instagram: String,
      facebook: String,
      pinterest: String,
      youtube: String,
    },
    
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true, versionKey: false }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;