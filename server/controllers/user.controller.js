const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const {
  uploadProfilePicture,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");
const fs = require("fs");
const path = require("path");

const userController = {
  // Create a new user
  createUser: async (req, res) => {
    try {
      const { username, email, password, role, phone } = req.body;

      if (!username || !email || !password || !role || !phone) {
        return res
          .status(400)
          .json({ message: "Please enter all required inputs" });
      }

      const existUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existUser) {
        return res
          .status(409)
          .json({ message: "User already exists.", data: existUser.email });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        phone,
      });

      // Include avatar URL in response
      const userResponse = newUser.toJSON();

      return res.status(201).json({
        message: "User created successfully",
        data: userResponse,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user);

      // 🍪 SET HTTP-ONLY COOKIE
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profilePicture: user.profilePicture,
          avatarUrl: user.avatarUrl,
          token: token,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  logoutUser: (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      if (!users)
        return res.status(404).json({ message: `Users not found` });

      // Include avatar URLs
      const usersWithAvatars = users.map((user) => user.toJSON());

      return res
        .status(200)
        .json({ message: "fetched users", data: usersWithAvatars });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // Get logged in user details
  getLoggedInUser: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User fetched successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Error fetching logged in user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // Update user by ID
  updateUsersById: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;

      // Prevent password update through this endpoint
      delete updatedData.password;
      delete updatedData.profilePicture;
      delete updatedData.profilePicturePublicId;

      const updateUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      }).select("-password");

      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User updated successfully",
        data: updateUser.toJSON(),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // Delete user by ID
  deleteUsersById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(404).json({ message: "User ID required" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete profile picture from Cloudinary if exists
      if (user.profilePicturePublicId) {
        try {
          await deleteFromCloudinary(user.profilePicturePublicId);
        } catch (error) {
          console.error("Error deleting profile picture:", error);
        }
      }

      const deletedUser = await User.findByIdAndDelete(id);

      return res.status(200).json({
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // ============================================
  // PROFILE PICTURE MANAGEMENT
  // ============================================

  /**
   * Upload profile picture (Cloudinary)
   * POST /api/v1/user/profile-picture
   */
  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        // Clean up uploaded file
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete old profile picture from Cloudinary if exists
      if (user.profilePicturePublicId) {
        try {
          await deleteFromCloudinary(user.profilePicturePublicId);
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
        }
      }

      // Upload new profile picture to Cloudinary
      const uploadResult = await uploadProfilePicture(req.file.path, userId);

      // Update user with new profile picture
      user.profilePicture = uploadResult.url;
      user.profilePicturePublicId = uploadResult.publicId;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: {
          profilePicture: user.profilePicture,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);

      // Clean up file on error
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message: "Failed to upload profile picture",
        error: error.message,
      });
    }
  },

  /**
   * Delete profile picture
   * DELETE /api/v1/user/profile-picture
   */
  deleteProfilePicture: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.profilePicturePublicId) {
        return res.status(400).json({
          success: false,
          message: "No profile picture to delete",
        });
      }

      // Delete from Cloudinary
      await deleteFromCloudinary(user.profilePicturePublicId);

      // Update user
      user.profilePicture = null;
      user.profilePicturePublicId = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile picture deleted successfully",
        data: {
          avatarUrl: user.avatarUrl, // Returns generated avatar
        },
      });
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete profile picture",
        error: error.message,
      });
    }
  },

  /**
   * Get user profile picture
   * GET /api/v1/user/:id/profile-picture
   */
  getProfilePicture: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select(
        "username profilePicture"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          username: user.username,
          profilePicture: user.profilePicture,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile picture",
        error: error.message,
      });
    }
  },
};

module.exports = userController;