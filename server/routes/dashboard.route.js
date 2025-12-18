const express = require("express");
const dashboardRoute = express.Router();

const {
  recruiterDashboard,
  candidateDashboard,
  getapplicationsCount,
  getcandidatesCount,
  getcompaniesCount,
  getrecruitersCount,
  getjobsCount,
} = require("../controllers/dashboard.controller");

const {
  protect,
  isRecruiter,
  isCandidate,
} = require("../middlewares/auth.middleware");

dashboardRoute.get("/recruiter", protect, isRecruiter, recruiterDashboard);
dashboardRoute.get("/candidate", protect, isCandidate, candidateDashboard);
// -----------Globel Api------------
dashboardRoute.get("/jobs/count",getjobsCount)
dashboardRoute.get("/applications/count",getapplicationsCount)
dashboardRoute.get("/candidates/count",getcandidatesCount)
dashboardRoute.get("/recruiters/count",getrecruitersCount)
dashboardRoute.get("/companies/count",getcompaniesCount)


module.exports = dashboardRoute;
