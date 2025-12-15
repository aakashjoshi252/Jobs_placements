const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


//  Protect routes - verifies JWT token

exports.protect = async (req, res, next) => {
  let token;

  //  Read token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


//  Recruiter-only access
exports.isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied: Recruiter only" });
  }
  next();
};

//  Candidate-only access

exports.isCandidate = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ message: "Access denied: Candidate only" });
  }
  next();
};
