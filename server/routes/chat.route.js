const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller.js");
const messageController = require("../controllers/message.controller.js");

// Note: Add your auth middleware if you have it
// const { isAuthenticated } = require("../middlewares/auth.middleware.js");

// ============== CHAT ROUTES ==============

// Create or get existing chat between users
router.post("/create", chatController.createOrGetChat);

// Get all chats for current user
router.get("/user/:userId", chatController.getUserChats);

// Get specific chat by ID
router.get("/chat/:chatId", chatController.getChatById);

// Delete a chat
router.delete("/chat/:chatId", chatController.deleteChat);

// ============== MESSAGE ROUTES ==============

// Get all messages for a specific chat
router.get("/chat/:chatId/messages", messageController.getChatMessages);

// Mark message as read
router.patch("/message/:messageId/read", messageController.markAsRead);

// Delete a message
router.delete("/message/:messageId", messageController.deleteMessage);

module.exports = router;
