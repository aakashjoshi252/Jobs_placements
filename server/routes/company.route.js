const express= require("express")
const companyRoute= express.Router();
const companyController= require("../controllers/company.controller")
const upload = require("../config/upload");

companyRoute.post("/register", upload.single("uploadLogo"), companyController.createCompany);

companyRoute.get("/recruiter/:recruiterId", companyController.getCompanyByRecruiterId);
companyRoute.get("/:id", companyController.getCompanyById);

// companyRoute.put("/companys/:id",companyController.updateCompanyById),
// companyRoute.delete("/companys/:id",companyController.deleteCompanyById),


module.exports= companyRoute;
