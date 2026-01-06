# 📚 Jobs Placements Portal - API Documentation

## Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.yourcompany.com/api/v1
```

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Company Management](#company-management)
4. [Job Listings](#job-listings)
5. [Applications](#applications)
6. [Resume Management](#resume-management)
7. [Chat & Messaging](#chat--messaging)
8. [Notifications](#notifications)
9. [Blog](#blog)
10. [Dashboard](#dashboard)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)

---

## Authentication

### Register User
```http
POST /user/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "role": "jobseeker"
}
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

### Login
```http
POST /user/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
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

### Logout
```http
GET /user/logout
```
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Management

### Get User Profile
```http
GET /user/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "jobseeker",
    "profile": {
      "bio": "Experienced developer",
      "skills": ["JavaScript", "React", "Node.js"],
      "resume": "resume_url",
      "profilePhoto": "photo_url"
    }
  }
}
```

### Update Profile
```http
PUT /user/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "phoneNumber": "+1234567890",
  "profile": {
    "bio": "Senior Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"]
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

### Upload Profile Photo
```http
POST /user/profile/photo
```
**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file (jpg, jpeg, png)

**Response (200):**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "photoUrl": "https://cloudinary.com/photo_url"
}
```

---

## Company Management

### Register Company
```http
POST /company/register
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Tech Corp",
  "description": "Leading technology company",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "industry": "Technology",
  "size": "100-500"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Company registered successfully",
  "company": {
    "_id": "company_id",
    "name": "Tech Corp",
    "description": "Leading technology company",
    "website": "https://techcorp.com",
    "userId": "user_id"
  }
}
```

### Get Company Details
```http
GET /company/:id
```

**Response (200):**
```json
{
  "success": true,
  "company": {
    "_id": "company_id",
    "name": "Tech Corp",
    "description": "Leading technology company",
    "website": "https://techcorp.com",
    "location": "San Francisco, CA",
    "industry": "Technology",
    "jobs": 15,
    "logo": "logo_url"
  }
}
```

### Update Company
```http
PUT /company/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "description": "Updated company description",
  "website": "https://newtechcorp.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Company updated successfully",
  "company": { /* updated company object */ }
}
```

---

## Job Listings

### Get All Jobs
```http
GET /jobs?page=1&limit=10&search=developer&location=Remote
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `search`: Search term
- `location`: Job location
- `jobType`: full-time, part-time, contract
- `salary`: Minimum salary
- `experience`: Years of experience

**Response (200):**
```json
{
  "success": true,
  "jobs": [
    {
      "_id": "job_id",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for...",
      "company": {
        "_id": "company_id",
        "name": "Tech Corp",
        "logo": "logo_url"
      },
      "location": "Remote",
      "salary": "$120,000 - $150,000",
      "jobType": "full-time",
      "experience": "5+ years",
      "skills": ["React", "Node.js", "MongoDB"],
      "createdAt": "2026-01-06T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalJobs": 95,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Job by ID
```http
GET /jobs/:id
```

**Response (200):**
```json
{
  "success": true,
  "job": {
    "_id": "job_id",
    "title": "Senior Full Stack Developer",
    "description": "Detailed job description...",
    "requirements": ["5+ years experience", "React expertise"],
    "responsibilities": ["Lead development", "Mentor juniors"],
    "company": {
      "_id": "company_id",
      "name": "Tech Corp",
      "description": "Company description",
      "logo": "logo_url"
    },
    "location": "Remote",
    "salary": "$120,000 - $150,000",
    "jobType": "full-time",
    "experience": "5+ years",
    "skills": ["React", "Node.js", "MongoDB"],
    "applications": 25,
    "createdAt": "2026-01-06T10:00:00Z"
  }
}
```

### Create Job (Recruiter only)
```http
POST /jobs
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for...",
  "requirements": ["5+ years experience", "React expertise"],
  "responsibilities": ["Lead development", "Mentor juniors"],
  "location": "Remote",
  "salary": "$120,000 - $150,000",
  "jobType": "full-time",
  "experience": "5+ years",
  "skills": ["React", "Node.js", "MongoDB"],
  "companyId": "company_id",
  "positions": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "job": { /* job object */ }
}
```

### Update Job
```http
PUT /jobs/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Job Title",
  "salary": "$130,000 - $160,000"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "job": { /* updated job object */ }
}
```

### Delete Job
```http
DELETE /jobs/:id
```
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## Applications

### Apply for Job
```http
POST /application/apply/:jobId
```
**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `coverLetter`: Text
- `resume`: PDF file (optional if already uploaded)

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "_id": "application_id",
    "job": "job_id",
    "applicant": "user_id",
    "status": "pending",
    "appliedAt": "2026-01-06T10:00:00Z"
  }
}
```

### Get My Applications
```http
GET /application/my-applications
```
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "applications": [
    {
      "_id": "application_id",
      "job": {
        "_id": "job_id",
        "title": "Senior Developer",
        "company": {
          "name": "Tech Corp",
          "logo": "logo_url"
        }
      },
      "status": "pending",
      "appliedAt": "2026-01-06T10:00:00Z"
    }
  ]
}
```

### Get Applications for Job (Recruiter)
```http
GET /application/job/:jobId
```
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "applications": [
    {
      "_id": "application_id",
      "applicant": {
        "_id": "user_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "profile": {
          "resume": "resume_url",
          "skills": ["React", "Node.js"]
        }
      },
      "status": "pending",
      "coverLetter": "I am interested...",
      "appliedAt": "2026-01-06T10:00:00Z"
    }
  ]
}
```

### Update Application Status
```http
PUT /application/:id/status
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application status updated",
  "application": { /* updated application */ }
}
```

---

## Socket.IO Events

### Client to Server

#### Connect User
```javascript
socket.emit('userOnline', userId);
```

#### Join Chat
```javascript
socket.emit('joinChat', chatId);
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  chatId: 'chat_id',
  senderId: 'user_id',
  text: 'Hello!'
});
```

#### Typing Indicator
```javascript
socket.emit('typing', {
  chatId: 'chat_id',
  userName: 'John Doe'
});

socket.emit('stopTyping', { chatId: 'chat_id' });
```

### Server to Client

#### User Status Change
```javascript
socket.on('userStatusChange', (data) => {
  // { userId, status: 'online'/'offline', timestamp }
});
```

#### Receive Message
```javascript
socket.on('receiveMessage', (message) => {
  // { _id, chatId, senderId, text, createdAt }
});
```

#### New Message Notification
```javascript
socket.on('newMessageNotification', (data) => {
  // { chatId, message, senderId, timestamp }
});
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information",
  "statusCode": 400
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

---

## Rate Limiting

### General API
- 100 requests per 15 minutes per IP

### Authentication Endpoints
- 5 requests per 15 minutes per IP

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1704542400
```

---

## Authentication

Include JWT token in all authenticated requests:

```
Authorization: Bearer <your_jwt_token>
```

---

**Last Updated**: January 2026
**API Version**: 1.0.0
