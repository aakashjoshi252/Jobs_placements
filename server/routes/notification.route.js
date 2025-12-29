const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// ✅ FIX: Import correct auth middleware (it's called 'protect', not 'isAuthenticated')
const { protect } = require("../middlewares/auth.middleware.js");

// ✅ Apply authentication to ALL notification routes
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
