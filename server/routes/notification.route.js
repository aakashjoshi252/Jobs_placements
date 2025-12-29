const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// ✅ FIX: Import auth middleware
const { isAuthenticated } = require("../middlewares/auth.middleware.js");

// ✅ FIX: Apply authentication to ALL notification routes
// Get all notifications for current user
router.get("/", isAuthenticated, notificationController.getUserNotifications);

// Get unread count
router.get("/unread-count", isAuthenticated, notificationController.getUnreadCount);

// Mark single notification as read
router.patch("/:notificationId/read", isAuthenticated, notificationController.markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", isAuthenticated, notificationController.markAllAsRead);

// Delete a notification
router.delete("/:notificationId", isAuthenticated, notificationController.deleteNotification);

// Delete all read notifications
router.delete("/clear/read", isAuthenticated, notificationController.deleteAllRead);

module.exports = router;
