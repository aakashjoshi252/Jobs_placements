const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// ✅ FIX: Import auth middleware
const { protect } = require("../middlewares/auth.middleware.js");

// ✅ FIX: Apply authentication to ALL notification routes
// Get all notifications for current user
router.get("/", protect, notificationController.getUserNotifications);

// Get unread count
router.get("/unread-count", protect, notificationController.getUnreadCount);

// Mark single notification as read
router.patch("/:notificationId/read", protect, notificationController.markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", protect, notificationController.markAllAsRead);

// Delete a notification
router.delete("/:notificationId", protect, notificationController.deleteNotification);

// Delete all read notifications
router.delete("/clear/read", protect, notificationController.deleteAllRead);

module.exports = router;
