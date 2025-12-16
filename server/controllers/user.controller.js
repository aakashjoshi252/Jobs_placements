const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");



const userController = {
  // Create a new user
  createUser: async (req, res) => {
    try {
      const { username, email, password, role, phone } = req.body;

      if (!username || !email || !password || !role || !phone) {
        return res.status(400).json({ message: "Please enter all required inputs" });
      }

      const existUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existUser) {
        return res.status(409).json({ message: "User already exists.", data: existUser.email });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create(
        {
          username,
          email,
          password: hashedPassword,
          role,
          phone,
        }
      );

      return res.status(201).json({ message: "User created successfully", data: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
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
        secure: false,          // true in production (HTTPS)
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
  // Get logged in user details
  getLoggedInUser: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        message: "User fetched successfully", user
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
      const updateUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User updated successfully", data: updateUser });
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
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully", data: deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
};

module.exports = userController;
