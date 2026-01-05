const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const {
  uploadProfilePictureLocal,
  handleMulterError,
} = require("../middlewares/upload.middleware");

// ========== AUTHENTICATION ROUTES ==========
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// ========== USER MANAGEMENT ROUTES ==========
router.get("/", userController.getUsers);
router.get("/me", isAuthenticated, userController.getLoggedInUser);
router.put("/:id", isAuthenticated, userController.updateUsersById);
router.delete("/:id", isAuthenticated, userController.deleteUsersById);

// ========== PROFILE PICTURE ROUTES ==========
// Upload profile picture
router.post(
  "/profile-picture",
  isAuthenticated,
  uploadProfilePictureLocal.single("profilePicture"),
  handleMulterError,
  userController.uploadProfilePicture
);

// Delete profile picture
router.delete(
  "/profile-picture",
  isAuthenticated,
  userController.deleteProfilePicture
);

// Get user profile picture by ID
router.get("/:id/profile-picture", userController.getProfilePicture);

module.exports = router;