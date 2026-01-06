# 🧪 API Testing Guide - Jobs Placements Portal

Comprehensive guide for testing all API endpoints in your Jobs_placements application.

## 📋 Table of Contents

1. [Setup](#setup)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Company Endpoints](#company-endpoints)
5. [Jobs Endpoints](#jobs-endpoints)
6. [Application Endpoints](#application-endpoints)
7. [Resume Endpoints](#resume-endpoints)
8. [Chat Endpoints](#chat-endpoints)
9. [Notification Endpoints](#notification-endpoints)
10. [Blog Endpoints](#blog-endpoints)
11. [Dashboard Endpoints](#dashboard-endpoints)
12. [WebSocket Testing](#websocket-testing)
13. [Automated Testing](#automated-testing)

---

## 🛠️ Setup

### Base URL

**Development:**
```
http://localhost:3000/api/v1
```

**Production:**
```
https://your-api-domain.com/api/v1
```

### Tools

1. **Postman** (Recommended)
   - Download: https://www.postman.com/downloads/
   - Import collection: `API_Testing_Collection.json`

2. **cURL** (Command line)
   - Pre-installed on macOS/Linux
   - Windows: Use Git Bash or WSL

3. **Thunder Client** (VS Code Extension)
   - Install from VS Code marketplace

4. **REST Client** (VS Code Extension)
   - Use `.http` files in `tests/api/` directory

### Environment Variables (Postman)

```json
{
  "base_url": "http://localhost:3000/api/v1",
  "token": "",
  "user_id": "",
  "company_id": "",
  "job_id": ""
}
```

---

## 🔐 Authentication Endpoints

### 1. Register User (Job Seeker)

**Endpoint:** `POST /user/register`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass@123",
    "phoneNumber": "+1234567890",
    "role": "jobseeker"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  },
  "token": "jwt_token_here"
}
```

### 2. Register Recruiter

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Recruiter",
    "email": "jane@company.com",
    "password": "SecurePass@123",
    "phoneNumber": "+1234567891",
    "role": "recruiter"
  }'
```

### 3. Login

**Endpoint:** `POST /user/login`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  },
  "token": "jwt_token_here"
}
```

**Save the token for subsequent requests!**

### 4. Logout

**Endpoint:** `POST /user/logout`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/user/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👤 User Endpoints

### 1. Get Current User Profile

**Endpoint:** `GET /user/profile`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Update Profile

**Endpoint:** `PUT /user/profile`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated Doe",
    "phoneNumber": "+1234567892",
    "bio": "Experienced software developer",
    "skills": ["JavaScript", "React", "Node.js"]
  }'
```

### 3. Upload Profile Picture

**Endpoint:** `POST /user/profile/picture`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/user/profile/picture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profilePicture=@/path/to/image.jpg"
```

### 4. Change Password

**Endpoint:** `PUT /user/password`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/user/password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass@123",
    "newPassword": "NewSecurePass@456"
  }'
```

---

## 🏭 Company Endpoints

### 1. Register Company (Recruiter Only)

**Endpoint:** `POST /company/register`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/company/register \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Corp Inc.",
    "description": "Leading technology company",
    "website": "https://techcorp.com",
    "location": "San Francisco, CA",
    "industry": "Technology"
  }'
```

### 2. Get All Companies

**Endpoint:** `GET /company`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/company?page=1&limit=10"
```

### 3. Get Company by ID

**Endpoint:** `GET /company/:id`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/company/COMPANY_ID
```

### 4. Update Company

**Endpoint:** `PUT /company/:id`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/company/COMPANY_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated company description",
    "website": "https://newtechcorp.com"
  }'
```

### 5. Upload Company Logo

**Endpoint:** `POST /company/:id/logo`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/company/COMPANY_ID/logo \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -F "logo=@/path/to/logo.png"
```

---

## 💼 Jobs Endpoints

### 1. Create Job (Recruiter Only)

**Endpoint:** `POST /jobs`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Developer",
    "description": "We are looking for an experienced full stack developer...",
    "requirements": [
      "5+ years of experience",
      "Strong knowledge of React and Node.js",
      "Experience with MongoDB"
    ],
    "location": "San Francisco, CA",
    "jobType": "Full-time",
    "salary": {
      "min": 120000,
      "max": 180000,
      "currency": "USD"
    },
    "experienceLevel": "Senior",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "company": "COMPANY_ID",
    "positions": 2
  }'
```

### 2. Get All Jobs (with filters)

**Endpoint:** `GET /jobs`

**Request:**
```bash
# Basic
curl -X GET "http://localhost:3000/api/v1/jobs?page=1&limit=10"

# With filters
curl -X GET "http://localhost:3000/api/v1/jobs?location=San%20Francisco&jobType=Full-time&experienceLevel=Senior&salary_min=100000"

# Search by keyword
curl -X GET "http://localhost:3000/api/v1/jobs?keyword=developer"
```

### 3. Get Job by ID

**Endpoint:** `GET /jobs/:id`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/jobs/JOB_ID
```

### 4. Update Job

**Endpoint:** `PUT /jobs/:id`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Job Title",
    "salary": {
      "min": 130000,
      "max": 190000
    }
  }'
```

### 5. Delete Job

**Endpoint:** `DELETE /jobs/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

### 6. Get Jobs by Company

**Endpoint:** `GET /jobs/company/:companyId`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/jobs/company/COMPANY_ID
```

---

## 📝 Application Endpoints

### 1. Apply for Job

**Endpoint:** `POST /application/apply/:jobId`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/application/apply/JOB_ID \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "coverLetter": "I am excited to apply for this position because...",
    "resume": "RESUME_ID"
  }'
```

### 2. Get My Applications (Job Seeker)

**Endpoint:** `GET /application/my-applications`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/application/my-applications?status=pending" \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN"
```

### 3. Get Applications for Job (Recruiter)

**Endpoint:** `GET /application/job/:jobId`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/application/job/JOB_ID \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

### 4. Update Application Status (Recruiter)

**Endpoint:** `PUT /application/:id/status`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/application/APPLICATION_ID/status \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted",
    "notes": "Strong candidate, schedule interview"
  }'
```

**Status values:** `pending`, `shortlisted`, `interview`, `offered`, `rejected`, `accepted`

### 5. Withdraw Application

**Endpoint:** `DELETE /application/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/application/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN"
```

---

## 📊 Resume Endpoints

### 1. Upload Resume

**Endpoint:** `POST /resume/upload`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/resume/upload \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN" \
  -F "resume=@/path/to/resume.pdf" \
  -F "title=Software Developer Resume"
```

### 2. Get My Resumes

**Endpoint:** `GET /resume/my-resumes`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/resume/my-resumes \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN"
```

### 3. Delete Resume

**Endpoint:** `DELETE /resume/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/resume/RESUME_ID \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN"
```

---

## 💬 Chat Endpoints

### 1. Create Chat

**Endpoint:** `POST /chat/create`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/chat/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "participantId": "OTHER_USER_ID"
  }'
```

### 2. Get All Chats

**Endpoint:** `GET /chat`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Messages from Chat

**Endpoint:** `GET /chat/:chatId/messages`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/chat/CHAT_ID/messages?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Mark Messages as Read

**Endpoint:** `PUT /chat/:chatId/read`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/chat/CHAT_ID/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔔 Notification Endpoints

### 1. Get My Notifications

**Endpoint:** `GET /notifications`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/notifications?unread=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Mark Notification as Read

**Endpoint:** `PUT /notifications/:id/read`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Mark All as Read

**Endpoint:** `PUT /notifications/mark-all-read`

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/mark-all-read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Delete Notification

**Endpoint:** `DELETE /notifications/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/notifications/NOTIFICATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Blog Endpoints

### 1. Create Blog Post

**Endpoint:** `POST /blog`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/blog \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Top 10 Interview Tips",
    "content": "Here are the best tips for acing your interview...",
    "tags": ["interview", "career", "tips"],
    "category": "Career Advice"
  }'
```

### 2. Get All Blog Posts

**Endpoint:** `GET /blog`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/blog?page=1&limit=10&category=Career%20Advice"
```

### 3. Get Blog Post by ID

**Endpoint:** `GET /blog/:id`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/blog/BLOG_ID
```

---

## 📊 Dashboard Endpoints

### Job Seeker Dashboard

**Endpoint:** `GET /dashboard/jobseeker`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/dashboard/jobseeker \
  -H "Authorization: Bearer YOUR_JOBSEEKER_TOKEN"
```

### Recruiter Dashboard

**Endpoint:** `GET /dashboard/recruiter`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/dashboard/recruiter \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

---

## 🔌 WebSocket Testing

### Socket.IO Connection Test

**Using JavaScript:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  
  // Announce user online
  socket.emit('userOnline', 'USER_ID');
});

// Join chat
socket.emit('joinChat', 'CHAT_ID');

// Send message
socket.emit('sendMessage', {
  chatId: 'CHAT_ID',
  senderId: 'USER_ID',
  text: 'Hello!'
});

// Receive messages
socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
});

// Typing indicators
socket.emit('typing', { chatId: 'CHAT_ID', userName: 'John' });
socket.emit('stopTyping', { chatId: 'CHAT_ID' });

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});
```

---

## 🧪 Automated Testing

### Run Tests

```bash
# All tests
cd server && npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode
npm run test:watch
```

### Production Readiness Check

```bash
cd server && npm run production-check
```

---

## ✅ Testing Checklist

### Authentication
- [ ] User registration (job seeker)
- [ ] User registration (recruiter)
- [ ] Login
- [ ] Logout
- [ ] Invalid credentials
- [ ] Duplicate email registration

### Authorization
- [ ] Protected routes require token
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] Role-based access control

### CRUD Operations
- [ ] Create resources
- [ ] Read resources (single & list)
- [ ] Update resources
- [ ] Delete resources
- [ ] Pagination working
- [ ] Filtering working
- [ ] Sorting working

### File Uploads
- [ ] Profile picture upload
- [ ] Resume upload
- [ ] Company logo upload
- [ ] File size limits enforced
- [ ] File type validation

### Real-time Features
- [ ] Socket.IO connection
- [ ] Send/receive messages
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] Notifications

### Error Handling
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 403 Forbidden
- [ ] 404 Not Found
- [ ] 500 Server Error
- [ ] Validation errors

---

## 📚 Additional Resources

- **Postman Collection**: Import from repository
- **API Documentation**: http://localhost:3000/api/v1/docs
- **Health Check**: http://localhost:3000/health
- **Production Guide**: See [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)

---

**Happy Testing! 🎉**
