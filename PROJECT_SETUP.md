# 🚀 Project Setup & Troubleshooting Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Common Issues & Fixes](#common-issues--fixes)
- [Project Architecture](#project-architecture)
- [API Documentation](#api-documentation)

---

## ✅ Prerequisites

Make sure you have these installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (running locally or MongoDB Atlas)
- **Git**: Latest version

```bash
# Check versions
node --version
npm --version
mongod --version
git --version
```

---

## 🔧 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aakashjoshi252/Jobs_placements.git
cd Jobs_placements
```

### 2. Install Dependencies

#### Backend (Server)
```bash
cd server
npm install
```

#### Frontend (Client)
```bash
cd ../client
npm install
```

### 3. Install PostCSS for Tailwind CSS 4.x

```bash
cd client
npm install -D @tailwindcss/postcss
```

---

## ⚙️ Environment Configuration

### Server Environment Variables

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/jobs_placements
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobs_placements?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cookie Configuration
COOKIE_SECRET=your_cookie_secret_here

# CORS Configuration
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Environment Variables

Create `client/.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_PORT=5000

# Socket.IO Configuration
VITE_SOCKET_URL=http://localhost:5000

# Environment
VITE_ENV=development

# Optional: Enable API logging
VITE_API_LOGGING=true
```

---

## 🏃 Running the Project

### Option 1: Run Separately

#### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```

Server will run on: **http://localhost:5000**

#### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```

Client will run on: **http://localhost:5173**

### Option 2: Run with Docker (If configured)

```bash
docker-compose up --build
```

---

## 🐛 Common Issues & Fixes

### Issue 1: `@import must precede all other statements`

**Error:**
```
@import must precede all other statements (besides @charset or empty @layer)
```

**Fix:**
Ensure Google Fonts import comes FIRST in `client/src/index.css`:

```css
/* ✅ CORRECT ORDER */
@import url('https://fonts.googleapis.com/...');
@import "tailwindcss";
```

### Issue 2: `Cannot apply unknown utility class`

**Error:**
```
Cannot apply unknown utility class `card`
```

**Fix:**
Tailwind CSS 4.x doesn't support `@apply` with custom classes. Use pure CSS instead:

```css
/* ❌ WRONG (Tailwind 4.x) */
.card {
  @apply bg-white rounded-lg;
}

/* ✅ CORRECT */
.card {
  background-color: white;
  border-radius: 0.5rem;
}
```

### Issue 3: `GET http://localhost:5173/api/api.jsx 500 Error`

**Error:**
```
GET http://localhost:5173/api/api.jsx net::ERR_ABORTED 500
```

**Fix:**
API file was in wrong location. It's now fixed:
- **Old:** `client/api/api.jsx` ❌
- **New:** `client/src/api/api.js` ✅

Update all imports:
```javascript
// Old import
import { userApi } from '../../api/api';

// New import
import { userApi } from '../api/api';
```

### Issue 4: Failed to Fetch Layout.jsx

**Error:**
```
Failed to fetch dynamically imported module: Layout.jsx
```

**Fix:**
1. Clear Vite cache:
```bash
cd client
rm -rf node_modules/.vite
rm -rf dist
```

2. Restart dev server:
```bash
npm run dev
```

3. Hard refresh browser:
- **Windows/Linux:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

### Issue 5: MongoDB Connection Error

**Error:**
```
MongoServerError: connect ECONNREFUSED
```

**Fix:**

1. **If using local MongoDB:**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

2. **If using MongoDB Atlas:**
- Check your connection string in `.env`
- Ensure IP whitelist includes your current IP
- Verify username/password are correct

### Issue 6: CORS Errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
Ensure `server/.env` has correct CLIENT_URL:
```env
CLIENT_URL=http://localhost:5173
```

### Issue 7: Authentication Not Working

**Symptoms:**
- Can't login
- Cookies not being set
- 401 Unauthorized errors

**Fix:**

1. Verify `withCredentials: true` in API config (`client/src/api/api.js`):
```javascript
const axiosConfig = {
  withCredentials: true, // ✅ Must be true
  headers: {
    'Content-Type': 'application/json',
  },
};
```

2. Check server CORS configuration allows credentials

3. Clear browser cookies and try again

---

## 🏗️ Project Architecture

```
Jobs_placements/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/              # ✅ API configuration
│   │   │   └── api.js        # Axios instances
│   │   ├── auth/             # Authentication pages
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React Context (Socket)
│   │   ├── layout/           # Layout components
│   │   ├── pages/            # Page components
│   │   ├── redux/            # Redux store & slices
│   │   ├── styles/           # CSS files
│   │   ├── index.css         # Main CSS (Tailwind)
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── vite.config.js        # Vite configuration
│   └── tailwind.config.js    # Tailwind configuration
│
├── server/                    # Backend (Node.js + Express)
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── .env                  # Environment variables
│   ├── server.js             # Entry point
│   └── package.json
│
├── .gitignore
├── docker-compose.yml        # Docker configuration
└── README.md
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Available Endpoints

#### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user
- `GET /api/user/me` - Get current user

#### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

#### Applications
- `GET /api/application` - Get user applications
- `POST /api/application` - Apply for job
- `PUT /api/application/:id` - Update application status (recruiter)

#### Company
- `GET /api/company/:id` - Get company details
- `POST /api/company` - Create company (recruiter)
- `PUT /api/company/:id` - Update company (recruiter)

#### Resume
- `GET /api/resume` - Get user resume
- `POST /api/resume` - Create resume
- `PUT /api/resume/:id` - Update resume

#### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (recruiter)
- `PUT /api/blogs/:id` - Update blog (recruiter)
- `DELETE /api/blogs/:id` - Delete blog (recruiter)

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

#### Chat
- `GET /api/chat` - Get user conversations
- `POST /api/chat` - Send message

---

## 🔄 Git Workflow

### Pull Latest Changes
```bash
git pull origin main
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Commit Changes
```bash
git add .
git commit -m "feat: Add your feature description"
```

### Push Changes
```bash
git push origin feature/your-feature-name
```

---

## 🧹 Cleanup Commands

### Clear All Caches
```bash
# Backend
cd server
rm -rf node_modules
npm install

# Frontend
cd ../client
rm -rf node_modules node_modules/.vite dist
npm install
```

### Reset Everything
```bash
# Remove all node_modules and reinstall
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "package-lock.json" -type f -delete

cd server && npm install
cd ../client && npm install
```

---

## 📝 Development Tips

1. **Always run backend before frontend**
2. **Check `.env` files are properly configured**
3. **Clear cache when changing dependencies**
4. **Use Redux DevTools for state debugging**
5. **Check browser console for API errors**
6. **Monitor server logs for backend errors**

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Clear all caches and restart
3. Verify environment variables
4. Check MongoDB is running
5. Review browser console errors
6. Check server terminal logs

---

## ✅ All Fixed Issues Summary

- ✅ Fixed `@import` order in CSS
- ✅ Removed `@apply` with custom classes (Tailwind 4.x)
- ✅ Moved `api.jsx` to correct location (`src/api/api.js`)
- ✅ Updated API base URLs to include `/api` prefix
- ✅ Fixed PostCSS configuration
- ✅ Cleaned up unnecessary files
- ✅ Updated environment variable examples

---

## 🎉 You're All Set!

Your project is now properly configured. Start both servers and begin development!

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit: **http://localhost:5173**

Happy Coding! 🚀