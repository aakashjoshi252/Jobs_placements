require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDb = require("./config/config.js");
const cookieParser = require("cookie-parser");



// IMPORT ROUTES
const userRoute = require("./routes/user.route.js");
const companyRoute = require("./routes/company.route.js");
const jobsRoute = require("./routes/jobs.route.js");
const resumeRoute = require("./routes/resume.route.js");
const applicationsRoute = require("./routes/applications.route.js");
const dashboardRoutes = require("./routes/dashboard.route.js");

const app = express();
const port = process.env.PORT || 5000;

// CONNECT DATABASE
connectDb;   
// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// ROUTES
app.use("/user", userRoute);
app.use("/company", companyRoute);
app.use("/jobs", jobsRoute);
app.use("/resume", resumeRoute);
app.use("/application", applicationsRoute);
app.use("/dashboard", dashboardRoutes); 

// 404 HANDLER
app.use((req, res) =>
  req.method === "GET" ? res.status(404).json({ message: `Page not found` }) : res.status(400).json({ message: `Page not found` })
);

// START SERVER
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
