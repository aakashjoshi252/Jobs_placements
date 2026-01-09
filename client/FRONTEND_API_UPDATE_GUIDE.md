# Frontend API Update Guide 🚀

## ✅ Changes Applied

Your frontend has been successfully updated to work with the new backend API structure!

### What Changed?

1. **API Endpoints Now Use `/api/v1` Prefix**
   - Old: `http://localhost:3000/user/login`
   - New: `http://localhost:3000/api/v1/user/login`

2. **Blog Route Fixed**
   - Old: `/blogs` (incorrect)
   - New: `/blog` (correct)

3. **Enhanced Error Handling**
   - Better error messages in console
   - Detailed logging for debugging
   - User-friendly error feedback

4. **API Health Check Added**
   - New utility to check if backend is running

---

## 🎯 Quick Start

### 1. Setup Environment Variables

```bash
cd client
cp .env.example .env
```

### 2. Update `.env` File

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_PORT=3000
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Install Dependencies (if needed)

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

---

## 📊 Updated API Structure

All API instances are now configured to use the correct endpoints:

```javascript
import { 
  userApi,
  companyApi,
  jobsApi,
  applicationApi,
  resumeApi,
  chatApi,
  notificationApi,
  blogApi,        // ✅ Fixed from /blogs to /blog
  dashboardApi 
} from './api/api';
```

### Usage Examples

#### User Authentication
```javascript
import { userApi } from '../api/api';

// Login
const login = async (credentials) => {
  try {
    const response = await userApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data);
    throw error;
  }
};

// Register
const register = async (userData) => {
  const response = await userApi.post('/register', userData);
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await userApi.get('/me');
  return response.data;
};
```

#### Jobs
```javascript
import { jobsApi } from '../api/api';

// Get all jobs
const getAllJobs = async (filters) => {
  const response = await jobsApi.get('/', { params: filters });
  return response.data;
};

// Get single job
const getJobById = async (jobId) => {
  const response = await jobsApi.get(`/${jobId}`);
  return response.data;
};

// Create job (Recruiter only)
const createJob = async (jobData) => {
  const response = await jobsApi.post('/', jobData);
  return response.data;
};
```

#### Applications
```javascript
import { applicationApi } from '../api/api';

// Apply to job
const applyToJob = async (jobId, applicationData) => {
  const response = await applicationApi.post('/apply', {
    jobId,
    ...applicationData
  });
  return response.data;
};

// Get candidate's applications
const getCandidateApplications = async (candidateId) => {
  const response = await applicationApi.get(`/applied/${candidateId}`);
  return response.data;
};
```

#### Blog (Fixed Route)
```javascript
import { blogApi } from '../api/api';

// ✅ Now uses correct /blog endpoint
const getAllBlogs = async () => {
  const response = await blogApi.get('/'); // Calls /api/v1/blog
  return response.data;
};

const getBlogById = async (blogId) => {
  const response = await blogApi.get(`/${blogId}`);
  return response.data;
};
```

#### Chat & Notifications
```javascript
import { chatApi, notificationApi } from '../api/api';

// Get user chats
const getUserChats = async (userId) => {
  const response = await chatApi.get(`/${userId}`);
  return response.data;
};

// Get notifications
const getNotifications = async () => {
  const response = await notificationApi.get('/');
  return response.data;
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  const response = await notificationApi.patch(`/${notificationId}/read`);
  return response.data;
};
```

---

## 🔌 Socket.IO Configuration

Socket.IO connection remains the same, using the base URL without `/api/v1`:

```javascript
import { io } from 'socket.io-client';
import { BASE_URL } from './api/api';

const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

// Connect event
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

// Error handling
socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});

// Send message
socket.emit('sendMessage', {
  chatId: 'chat123',
  senderId: 'user456',
  text: 'Hello!'
});

// Receive message
socket.on('receiveMessage', (message) => {
  console.log('📨 New message:', message);
});
```

---

## 🛠️ API Health Check

Use the new health check utility to verify backend connectivity:

```javascript
import { checkApiHealth } from './api/api';

// Check on app startup
const initializeApp = async () => {
  try {
    await checkApiHealth();
    console.log('✅ Backend is ready!');
  } catch (error) {
    console.error('❌ Backend is not available');
    // Show error message to user
  }
};
```

---

## 🐛 Debugging

### Console Logs

In development mode, you'll see detailed API logs:

```
🌐 API Base URL: http://localhost:3000
🔧 API Version: /api/v1
✅ Full API URL: http://localhost:3000/api/v1

📋 API Configuration:
├─ Base URL: http://localhost:3000
├─ API Version: /api/v1
├─ Full API URL: http://localhost:3000/api/v1
├─ With Credentials: true
└─ Environment: development

🔗 Available APIs:
├─ User: http://localhost:3000/api/v1/user
├─ Company: http://localhost:3000/api/v1/company
├─ Jobs: http://localhost:3000/api/v1/jobs
├─ Application: http://localhost:3000/api/v1/application
├─ Resume: http://localhost:3000/api/v1/resume
├─ Chat: http://localhost:3000/api/v1/chat
├─ Notification: http://localhost:3000/api/v1/notifications
├─ Blog: http://localhost:3000/api/v1/blog (Fixed from /blogs)
└─ Dashboard: http://localhost:3000/api/v1/dashboard

✨ Frontend API configuration updated successfully!
```

### API Request/Response Logs

Every API call shows:

```
📤 [UserAPI] POST http://localhost:3000/api/v1/user/login
✅ [UserAPI] POST /login - 200
```

Errors show:

```
❌ [UserAPI] POST /login - 401
Error data: { success: false, message: "Invalid credentials" }
💬 Error message: Invalid credentials
```

---

## ⚙️ Configuration Options

### Toggle API Versioning

In `client/src/api/api.js`, you can toggle versioning:

```javascript
const USE_API_VERSIONING = true;  // Use /api/v1
const USE_API_VERSIONING = false; // Use legacy routes
```

**Note:** Keep it `true` for the new structure!

---

## 🧪 Testing

### Test API Connection

```javascript
import { checkApiHealth, userApi } from './api/api';

// 1. Check if server is running
await checkApiHealth();

// 2. Test authentication endpoint
const response = await userApi.post('/login', {
  email: 'test@example.com',
  password: 'password123'
});
```

### Verify All Endpoints

```bash
# In browser console (F12)
const testApis = async () => {
  const apis = [
    { name: 'Health', url: 'http://localhost:3000/health' },
    { name: 'User', url: 'http://localhost:3000/api/v1/user' },
    { name: 'Jobs', url: 'http://localhost:3000/api/v1/jobs' },
    { name: 'Blog', url: 'http://localhost:3000/api/v1/blog' },
  ];

  for (const api of apis) {
    try {
      await fetch(api.url);
      console.log(`✅ ${api.name} API is accessible`);
    } catch (error) {
      console.error(`❌ ${api.name} API failed:`, error);
    }
  }
};

testApis();
```

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors

**Problem:** `Access-Control-Allow-Origin` errors

**Solution:**
- Ensure backend is running on `http://localhost:3000`
- Check `withCredentials: true` is set in axios config
- Verify CORS configuration in `server/server.js`

### Issue 2: 404 Not Found

**Problem:** API endpoints returning 404

**Solution:**
- Verify backend has been updated with merged PR #5
- Check endpoint URL in browser console logs
- Ensure `/api/v1` prefix is being used

### Issue 3: Authentication Issues

**Problem:** User not staying logged in

**Solution:**
- Ensure cookies are being sent (`withCredentials: true`)
- Check if JWT token is being set in cookies
- Verify cookie domain matches your hostname

### Issue 4: Socket.IO Connection Failed

**Problem:** Real-time chat not working

**Solution:**
- Check Socket.IO uses `BASE_URL` (not `API_BASE_URL`)
- Verify WebSocket connection in browser DevTools
- Ensure backend Socket.IO is configured correctly

---

## 📚 Migration Checklist

- [x] ✅ API configuration updated to `/api/v1`
- [x] ✅ Blog route fixed from `/blogs` to `/blog`
- [x] ✅ Enhanced error handling added
- [x] ✅ API health check utility created
- [x] ✅ Detailed logging implemented
- [x] ✅ Environment variables documented
- [ ] ⏳ Test all API endpoints
- [ ] ⏳ Verify Socket.IO functionality
- [ ] ⏳ Test authentication flow
- [ ] ⏳ Deploy to production

---

## 🎉 Summary

Your frontend is now fully configured to work with the updated backend!

**Key Changes:**
- ✅ All APIs use `/api/v1` prefix
- ✅ Blog route fixed
- ✅ Better error handling
- ✅ Enhanced debugging capabilities
- ✅ Health check utility added

**Next Steps:**
1. Start your backend: `cd server && npm run dev`
2. Start your frontend: `cd client && npm run dev`
3. Test the application
4. Check console for any errors

---

**Need Help?**
- Check the console logs for detailed error messages
- Review `WORKFLOW_FIXES_SUMMARY.md` for backend changes
- Test API health: `http://localhost:3000/health`

**Last Updated:** January 5, 2026  
**Version:** 1.1.0