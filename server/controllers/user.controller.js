const Users = require("../models/user.model");
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

      const existUser = await Users.findOne({ $or: [{ email }, { phone }] });
      if (existUser) {
        return res.status(409).json({ message: "User already exists.", data: existUser.email });
      }

      const newUser = await Users.create(req.body);
      return res.status(201).json({ message: "User created successfully", data: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // Login user by Email + Role + Password

loginUser: async (req, res) => {
 const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
,
  // Update user by ID
  updateUsersById: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const updateUser = await Users.findByIdAndUpdate(id, updatedData, { new: true });
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
      const deletedUser = await Users.findByIdAndDelete(id);
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
