const express = require("express");
const dashboardRoute = express.Router();

const {
  recruiterDashboard,
  candidateDashboard,
} = require("../controllers/dashboard.controller");

const {
  protect,
  isRecruiter,
  isCandidate,
} = require("../middlewares/auth.middleware");

dashboardRoute.get("/recruiter", protect, isRecruiter, recruiterDashboard);
dashboardRoute.get("/candidate", protect, isCandidate, candidateDashboard);

module.exports = dashboardRoute;
