const express = require("express");
const uploadRoutes =  express.Router();
const upload = require("../config/upload");
const fileController = require("../controllers/file.controller");

uploadRoutes.post("/save", upload.single("image"), fileController.uploadFile);

uploadRoutes.get("/getimage",   fileController.getAllFiles);

module.exports = uploadRoutes;
