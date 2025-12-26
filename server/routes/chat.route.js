const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller.js");

// Note: Add your auth middleware if you have it
// const { isAuthenticated } = require("../middlewares/auth.middleware.js");

// Create or get chat
router.post("/create", chatController.createChat);

// Get all chats for user
router.get("/user/:userId", chatController.getUserChats);   

// Get messages for a chat
router.get("/:chatId/messages", chatController.getChatMessages);

module.exports = router;
