const express= require("express")
const companyRoute= express.Router();
const {protect, isRecruiter}= require("../middlewares/auth.middleware");
const companyController= require("../controllers/company.controller")
const upload = require("../config/upload");

companyRoute.post("/register",protect, isRecruiter, upload.single("uploadLogo"), companyController.createCompany);
companyRoute.get("/:id", companyController.getCompanyById);
companyRoute.get("/recruiter/:recruiterId",protect, isRecruiter, companyController.getCompanyByRecruiterId);
companyRoute.put("/update/:id",protect, isRecruiter,upload.single("uploadLogo"),companyController.updateCompanyById),
companyRoute.delete("/delete/:id",protect,isRecruiter,companyController.deleteCompanyById),


module.exports= companyRoute;