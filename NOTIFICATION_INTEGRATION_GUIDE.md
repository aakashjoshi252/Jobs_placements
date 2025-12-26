# Notification System Integration Guide

## Complete Frontend Implementation

The notification system is now fully implemented! Here's how to integrate it into your application.

## 📦 Required Dependencies

Make sure you have these installed:

```bash
cd client
npm install date-fns react-icons
```

## 🎯 Integration Steps

### 1. Add Notification Bell to Navbar

Add the NotificationBell component to your navbar/header:

```jsx
// Example: client/src/components/layout/Navbar.jsx
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="logo">Your Logo</div>
        
        <div className="flex items-center gap-4">
          {/* Add Notification Bell */}
          <NotificationBell />
          
          {/* Other navbar items */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};
```

### 2. Add Notifications Route

Add the route to your router configuration:

```jsx
// Example: client/src/App.jsx or routes file
import NotificationsPage from "./pages/common/notifications/NotificationsPage";

const routes = [
  // ... other routes
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
];
```

### 3. Request Browser Notification Permission

Add this to your main App component or a useEffect in the root:

```jsx
// Example: client/src/App.jsx
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    // Your app
  );
}
```

## 🔔 Backend Integration

### Server Setup (Already Done)

The server now has:
- ✅ Notification model
- ✅ Notification controller
- ✅ Notification routes
- ✅ Socket.io support for real-time notifications

### How to Send Notifications from Backend

```javascript
// Example: In any controller where you want to send notifications
const { createNotificationHelper } = require("../controllers/notification.controller");
const { io } = require("../server");

// Create and send notification
const notification = await createNotificationHelper({
  recipientId: userId,
  senderId: currentUser._id, // optional
  type: "APPLICATION_APPROVED",
  title: "Application Approved!",
  message: "Your application for Software Engineer position has been approved.",
  relatedId: applicationId,
  relatedModel: "Application",
  link: `/candidate/applications/${applicationId}`,
});

// Send real-time notification via Socket.io
if (io) {
  io.to(`user_${userId}`).emit("newNotification", notification);
}
```

## 📋 Notification Types

Available notification types:

```javascript
const NOTIFICATION_TYPES = {
  // Application Related
  APPLICATION_SUBMITTED: "Application submitted",
  APPLICATION_REVIEWED: "Application reviewed",
  APPLICATION_SHORTLISTED: "Application shortlisted",
  APPLICATION_REJECTED: "Application rejected",
  APPLICATION_APPROVED: "Application approved",
  
  // Communication
  NEW_MESSAGE: "New message received",
  
  // Jobs
  JOB_POSTED: "New job posted",
  JOB_UPDATED: "Job updated",
  JOB_CLOSED: "Job closed",
  
  // Profile
  PROFILE_VIEWED: "Profile viewed",
  RESUME_VIEWED: "Resume viewed",
  
  // System
  SYSTEM: "System notification",
};
```

## 🎨 UI Components Created

### 1. NotificationBell Component
- Location: `client/src/components/notifications/NotificationBell.jsx`
- Features:
  - Shows unread count badge
  - Real-time updates via Socket.io
  - Browser notifications support
  - Toggles dropdown on click

### 2. NotificationDropdown Component
- Location: `client/src/components/notifications/NotificationDropdown.jsx`
- Features:
  - Displays recent 20 notifications
  - Filter by all/unread
  - Mark as read (single or all)
  - Delete notifications
  - Click outside to close
  - Links to full notifications page

### 3. NotificationsPage Component
- Location: `client/src/pages/common/notifications/NotificationsPage.jsx`
- Features:
  - Full list of notifications
  - Multiple filters (all/unread, by type)
  - Bulk actions (mark all read, clear read)
  - Statistics (unread count, total count)
  - Delete individual notifications

## 📡 Real-time Features

### Socket.io Events

**Server → Client:**
```javascript
socket.on("newNotification", (notification) => {
  // Handle new notification
  console.log("New notification:", notification);
});
```

**Client automatically:**
- Updates unread count
- Shows browser notification (if permitted)
- Refreshes notification list

## 🔄 Integration Examples

### Example 1: Send Notification When Application Status Changes

```javascript
// server/controllers/applications.controller.js
const { createNotificationHelper } = require("./notification.controller");
const { io } = require("../server");

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const application = await Application.findById(applicationId)
      .populate("jobId")
      .populate("candidateId");
    
    // Update status
    application.status = status;
    await application.save();
    
    // Send notification to candidate
    const notificationMessages = {
      REVIEWED: "Your application has been reviewed",
      SHORTLISTED: "Congratulations! You've been shortlisted",
      REJECTED: "Unfortunately, your application was not successful",
      APPROVED: "Great news! Your application has been approved",
    };
    
    const notification = await createNotificationHelper({
      recipientId: application.candidateId._id,
      senderId: req.user._id,
      type: `APPLICATION_${status}`,
      title: `Application ${status}`,
      message: `${notificationMessages[status]} for ${application.jobId.title}`,
      relatedId: applicationId,
      relatedModel: "Application",
      link: `/candidate/applications/${applicationId}`,
    });
    
    // Real-time notification
    io.to(`user_${application.candidateId._id}`).emit(
      "newNotification",
      notification
    );
    
    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Example 2: Notify Recruiter of New Application

```javascript
// When candidate applies for job
const notification = await createNotificationHelper({
  recipientId: job.recruiterId,
  senderId: candidateId,
  type: "APPLICATION_SUBMITTED",
  title: "New Application Received",
  message: `${candidate.username} applied for ${job.title}`,
  relatedId: applicationId,
  relatedModel: "Application",
  link: `/recruiter/applications/${applicationId}`,
});

io.to(`user_${job.recruiterId}`).emit("newNotification", notification);
```

### Example 3: Notify About New Job Posting

```javascript
// When recruiter posts a new job
// Notify all candidates who match criteria
const matchingCandidates = await User.find({ role: "candidate" });

for (const candidate of matchingCandidates) {
  const notification = await createNotificationHelper({
    recipientId: candidate._id,
    senderId: req.user._id,
    type: "JOB_POSTED",
    title: "New Job Posted",
    message: `${job.title} position at ${company.companyName}`,
    relatedId: jobId,
    relatedModel: "Job",
    link: `/candidate/jobs/${jobId}`,
  });
  
  io.to(`user_${candidate._id}`).emit("newNotification", notification);
}
```

## 🎯 API Endpoints

All notification endpoints:

```
GET    /notifications              - Get user notifications
GET    /notifications/unread-count - Get unread count
PATCH  /notifications/:id/read     - Mark as read
PATCH  /notifications/mark-all-read - Mark all as read
DELETE /notifications/:id          - Delete notification
DELETE /notifications/clear/read   - Clear all read
```

## ⚙️ Configuration

### Customize Notification Auto-Delete

In `server/models/notification.model.js`, read notifications are auto-deleted after 30 days:

```javascript
notificationSchema.index(
  { createdAt: 1 },
  { 
    expireAfterSeconds: 30 * 24 * 60 * 60, // 30 days
    partialFilterExpression: { isRead: true }
  }
);
```

### Customize Polling Interval

In `NotificationBell.jsx`, notifications are polled every 30 seconds:

```javascript
const interval = setInterval(fetchUnreadCount, 30000); // 30 seconds
```

## 🎨 Styling

All components use Tailwind CSS. Customize colors by modifying class names:

```javascript
// Change primary color from blue to purple
"bg-blue-600" → "bg-purple-600"
"text-blue-600" → "text-purple-600"
"hover:bg-blue-700" → "hover:bg-purple-700"
```

## 🧪 Testing

### Test Real-time Notifications

1. Open app in two browser windows
2. Login as recruiter in one, candidate in another
3. Recruiter updates application status
4. Candidate should see notification instantly

### Test Browser Notifications

1. Allow notifications when prompted
2. Minimize browser
3. Trigger a notification
4. Browser notification should appear

## 🐛 Troubleshooting

### Notifications not appearing:
- Check if Socket.io is connected (check browser console)
- Verify notification route is added to server
- Check if user is in correct socket room (`user_${userId}`)

### Unread count not updating:
- Check API endpoint `/notifications/unread-count`
- Verify authentication middleware is working
- Check browser console for errors

### Browser notifications not working:
- Check if permission is granted
- Verify HTTPS (required for production)
- Check browser settings

## 📱 Mobile Responsive

All components are mobile-responsive:
- Notification bell adapts to small screens
- Dropdown adjusts width on mobile
- Full page has proper spacing

## 🚀 Production Deployment

### Environment Variables

Update your production config:

```env
# Frontend (.env)
VITE_API_URL=https://your-api-domain.com

# Backend (.env)
CLIENT_URL=https://your-frontend-domain.com
```

### Update CORS

In `server/server.js`:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
```

## ✨ Features Summary

✅ Real-time notifications via Socket.io
✅ Browser notifications support
✅ Unread count badge
✅ Mark as read (single/all)
✅ Delete notifications
✅ Filter notifications (all/unread/by type)
✅ Auto-delete old read notifications
✅ Mobile responsive
✅ Beautiful UI with Tailwind CSS
✅ Pagination support
✅ Time formatting ("2 hours ago")
✅ Click to navigate to related page
✅ Loading states
✅ Empty states

---

**Status**: ✅ Fully Implemented
**Last Updated**: December 26, 2025
