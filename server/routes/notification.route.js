const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// Note: Add your auth middleware
// const { isAuthenticated } = require("../middlewares/auth.middleware.js");

// Get all notifications for current user
router.get("/", notificationController.getUserNotifications);

// Get unread count
router.get("/unread-count", notificationController.getUnreadCount);

// Mark single notification as read
router.patch("/:notificationId/read", notificationController.markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", notificationController.markAllAsRead);

// Delete a notification
router.delete("/:notificationId", notificationController.deleteNotification);

// Delete all read notifications
router.delete("/clear/read", notificationController.deleteAllRead);

module.exports = router;
