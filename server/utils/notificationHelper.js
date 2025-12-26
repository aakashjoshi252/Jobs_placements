/**
 * Notification Helper Functions
 * Use these functions to easily send notifications throughout your application
 */

const { createNotificationHelper } = require("../controllers/notification.controller");

/**
 * Get io instance from server
 * This will be set when server starts
 */
let io = null;

const setIO = (socketIO) => {
  io = socketIO;
};

const getIO = () => io;

/**
 * Send notification to user
 * Creates notification in database and sends real-time via Socket.io
 */
const sendNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  relatedId = null,
  relatedModel = null,
  link = null,
}) => {
  try {
    // Create notification in database
    const notification = await createNotificationHelper({
      recipientId,
      senderId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      link,
    });

    console.log(`🔔 Notification created for user ${recipientId}:`, title);

    // Send real-time notification via Socket.io
    if (io) {
      io.to(`user_${recipientId}`).emit("newNotification", notification);
      console.log(`✅ Real-time notification sent to user ${recipientId}`);
    }

    return notification;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
};

/**
 * Send notification when candidate applies for job
 */
const notifyApplicationSubmitted = async (application, job, candidate) => {
  return sendNotification({
    recipientId: job.recruiterId,
    senderId: candidate._id,
    type: "APPLICATION_SUBMITTED",
    title: "New Application Received",
    message: `${candidate.username} applied for ${job.title}`,
    relatedId: application._id,
    relatedModel: "Application",
    link: `/recruiter/applications/${application._id}`,
  });
};

/**
 * Send notification when application status changes
 */
const notifyApplicationStatusChange = async (application, newStatus, job) => {
  const statusMessages = {
    REVIEWED: {
      title: "Application Reviewed",
      message: `Your application for ${job.title} has been reviewed`,
    },
    SHORTLISTED: {
      title: "You're Shortlisted!",
      message: `Congratulations! You've been shortlisted for ${job.title}`,
    },
    REJECTED: {
      title: "Application Update",
      message: `Your application for ${job.title} was not successful this time`,
    },
    APPROVED: {
      title: "Application Approved!",
      message: `Great news! Your application for ${job.title} has been approved`,
    },
  };

  const statusInfo = statusMessages[newStatus];
  if (!statusInfo) return;

  return sendNotification({
    recipientId: application.candidateId,
    senderId: application.recruiterId,
    type: `APPLICATION_${newStatus}`,
    title: statusInfo.title,
    message: statusInfo.message,
    relatedId: application._id,
    relatedModel: "Application",
    link: `/candidate/applications/${application._id}`,
  });
};

/**
 * Send notification for new message
 */
const notifyNewMessage = async (senderId, recipientId, senderName, messagePreview) => {
  return sendNotification({
    recipientId,
    senderId,
    type: "NEW_MESSAGE",
    title: "New Message",
    message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
    relatedId: senderId,
    relatedModel: "User",
    link: `/chat`,
  });
};

/**
 * Send notification for new job posting
 */
const notifyNewJob = async (job, company, candidateIds) => {
  const notifications = [];

  for (const candidateId of candidateIds) {
    const notification = await sendNotification({
      recipientId: candidateId,
      senderId: job.recruiterId,
      type: "JOB_POSTED",
      title: "New Job Posted",
      message: `${job.title} at ${company.companyName}`,
      relatedId: job._id,
      relatedModel: "Job",
      link: `/candidate/jobs/${job._id}`,
    });
    notifications.push(notification);
  }

  return notifications;
};

/**
 * Send notification when profile is viewed
 */
const notifyProfileViewed = async (profileOwnerId, viewerId, viewerName) => {
  return sendNotification({
    recipientId: profileOwnerId,
    senderId: viewerId,
    type: "PROFILE_VIEWED",
    title: "Profile Viewed",
    message: `${viewerName} viewed your profile`,
    relatedId: viewerId,
    relatedModel: "User",
    link: `/profile/${profileOwnerId}`,
  });
};

/**
 * Send notification when resume is viewed
 */
const notifyResumeViewed = async (candidateId, recruiterId, recruiterName) => {
  return sendNotification({
    recipientId: candidateId,
    senderId: recruiterId,
    type: "RESUME_VIEWED",
    title: "Resume Viewed",
    message: `${recruiterName} viewed your resume`,
    relatedId: recruiterId,
    relatedModel: "User",
    link: `/candidate/resume`,
  });
};

/**
 * Send system notification
 */
const notifySystem = async (userId, title, message, link = null) => {
  return sendNotification({
    recipientId: userId,
    type: "SYSTEM",
    title,
    message,
    link,
  });
};

module.exports = {
  setIO,
  getIO,
  sendNotification,
  notifyApplicationSubmitted,
  notifyApplicationStatusChange,
  notifyNewMessage,
  notifyNewJob,
  notifyProfileViewed,
  notifyResumeViewed,
  notifySystem,
};
