const express= require("express")
const companyRoute= express.Router();
const companyController= require("../controllers/company.controller")
const upload = require("../config/upload");
const {protect, isRecruiter}= require("../middlewares/auth.middleware");

companyRoute.post("/register",protect, isRecruiter, upload.single("uploadLogo"), companyController.createCompany);


companyRoute.get("/recruiter/:recruiterId",protect, isRecruiter, companyController.getCompanyByRecruiterId);
companyRoute.get("/:id", companyController.getCompanyById);

// companyRoute.get("/:id", getCompany); // public
// companyRoute.put("/companys/:id",protect, isRecruiter,companyController.updateCompanyById),
// companyRoute.delete("/companys/:id",companyController.deleteCompanyById),


module.exports= companyRoute;
