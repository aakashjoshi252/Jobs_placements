const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");

/**
 * Protect routes - verifies JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Token missing
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await Users.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    req.user.id = user._id;
    req.user.role = user.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/**
 * Recruiter-only access
 */
exports.isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied: Recruiter only" });
  }
  next();
};

/**
 * Candidate-only access
 */
exports.isCandidate = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ message: "Access denied: Candidate only" });
  }
  next();
};
