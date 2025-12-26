const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "APPLICATION_SUBMITTED",
        "APPLICATION_REVIEWED",
        "APPLICATION_SHORTLISTED",
        "APPLICATION_REJECTED",
        "APPLICATION_APPROVED",
        "NEW_MESSAGE",
        "JOB_POSTED",
        "JOB_UPDATED",
        "JOB_CLOSED",
        "PROFILE_VIEWED",
        "RESUME_VIEWED",
        "SYSTEM",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can reference Job, Application, Message, etc.
    },
    relatedModel: {
      type: String,
      enum: ["Job", "Application", "Message", "User", "Company"],
    },
    link: {
      type: String,
      // Direct link to the related page
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

// Auto-delete read notifications older than 30 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { isRead: true } }
);

module.exports = mongoose.model("Notification", notificationSchema);
