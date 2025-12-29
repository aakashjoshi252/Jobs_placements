const Notification = require("../models/notification.model");

const notificationController = {
  // Create a new notification
  createNotification: async (notificationData) => {
    try {
      const notification = await Notification.create(notificationData);
      return notification;
    } catch (error) {
      console.error("Create notification error:", error);
      throw error;
    }
  },

  // Get all notifications for a user
  getUserNotifications: async (req, res) => {
    try {
      // ✅ FIX: Check if user exists first
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. User not found in request.",
        });
      }

      const userId = req.user._id;
      const { limit = 20, skip = 0, unreadOnly = false } = req.query;

      const filter = { recipientId: userId };
      if (unreadOnly === "true") {
        filter.isRead = false;
      }

      const notifications = await Notification.find(filter)
        .populate("senderId", "username email")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const unreadCount = await Notification.countDocuments({
        recipientId: userId,
        isRead: false,
      });

      const totalCount = await Notification.countDocuments(filter);

      res.status(200).json({
        success: true,
        notifications,
        unreadCount,
        totalCount,
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
        error: error.message,
      });
    }
  },

  // Get unread count
  getUnreadCount: async (req, res) => {
    try {
      // ✅ FIX: Check if user exists first
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userId = req.user._id;

      const count = await Notification.countDocuments({
        recipientId: userId,
        isRead: false,
      });

      res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get unread count",
        error: error.message,
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      // ✅ FIX: Check if user exists first
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { notificationId } = req.params;
      const userId = req.user._id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Mark as read error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark as read",
        error: error.message,
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      // ✅ FIX: Check if user exists first
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userId = req.user._id;

      const result = await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Mark all as read error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark all as read",
        error: error.message,
      });
    }
  },

  // Delete a notification
  deleteNotification: async (req, res) => {
    try {
      // ✅ FIX: Check if user exists first
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { notificationId } = req.params;
      const userId = req.user._id;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipientId: userId,
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error) {
      console.error("Delete notification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete notification",
        error: error.message,
      });
    }
  },

  // Delete all read notifications
  deleteAllRead: async (req, res) => {
    try {
      // ✅ FIX: Check if user exists first
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userId = req.user._id;

      const result = await Notification.deleteMany({
        recipientId: userId,
        isRead: true,
      });

      res.status(200).json({
        success: true,
        message: "All read notifications deleted",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("Delete all read error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete read notifications",
        error: error.message,
      });
    }
  },
};

// Helper function to create notifications for different events
const createNotificationHelper = async ({
  recipientId,
  senderId,
  type,
  title,
  message,
  relatedId,
  relatedModel,
  link,
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      senderId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      link,
    });

    return notification;
  } catch (error) {
    console.error("Helper create notification error:", error);
    throw error;
  }
};

module.exports = {
  ...notificationController,
  createNotificationHelper,
};
