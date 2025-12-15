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
    industry: {
      type: String,
      required: true,
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

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Company", companySchema);


const Company = mongoose.model("Company", companySchema);
module.exports = Company;
