# 🔌 Blog System Backend Integration Guide

## Quick Setup (5 Minutes)

### Step 1: Register Blog Routes

Add this to your main server file (`server.js` or `app.js`):

```javascript
// Import blog routes
const blogRoutes = require('./routes/blogRoutes');

// Register route (add with other routes)
app.use('/api/blogs', blogRoutes);
```

### Step 2: Verify Authentication Middleware

Ensure you have `authMiddleware.js` with a `protect` function:

```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies or Authorization header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

module.exports = { protect };
```

### Step 3: Test the API

```bash
# Start your server
cd server
node server.js
# or
npm start

# Test endpoints
curl http://localhost:3000/api/blogs
```

### Step 4: Frontend Integration

The frontend is already configured! Just ensure your backend is running.

```bash
# Start frontend
cd client
npm run dev

# Visit these URLs:
# http://localhost:5173/blogs (Public)
# http://localhost:5173/recruiter/blogs (Recruiter)
```

---

## 📋 Complete File Checklist

```
✅ server/models/Blog.js               (Created)
✅ server/routes/blogRoutes.js         (Created)
✅ server/middleware/authMiddleware.js (Verify exists)
✅ server/server.js                    (Update - add route)
```

---

## 🔍 Verification Steps

### 1. Check Database Connection
```javascript
// Should see this in console
✅ MongoDB Connected: <your-db-url>
```

### 2. Check Route Registration
```javascript
// Console should show
✅ Blog routes registered at /api/blogs
```

### 3. Test API Endpoints

**Get all blogs (public):**
```bash
curl http://localhost:3000/api/blogs
```

**Expected Response:**
```json
{
  "success": true,
  "blogs": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "pages": 0
  }
}
```

**Create blog (requires auth):**
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog",
    "description": "Test description",
    "content": "Full blog content here",
    "category": "news",
    "status": "published",
    "companyId": "YOUR_COMPANY_ID"
  }'
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module './routes/blogRoutes'"

**Solution:**
```bash
# Verify file exists
ls server/routes/blogRoutes.js

# If not, the file should be at:
# server/routes/blogRoutes.js
```

### Issue 2: "Blog is not defined"

**Solution:**
```bash
# Verify model exists
ls server/models/Blog.js

# Check it's properly exported:
# module.exports = mongoose.model('Blog', blogSchema);
```

### Issue 3: "protect is not a function"

**Solution:**
```javascript
// In blogRoutes.js, check import:
const { protect } = require('../middleware/authMiddleware');

// Ensure authMiddleware exports it:
module.exports = { protect };
```

### Issue 4: "401 Unauthorized"

**Solution:**
- Ensure user is logged in
- Check token is being sent
- Verify JWT_SECRET in .env
- Check token expiry

### Issue 5: "Cannot read property 'companyId' of undefined"

**Solution:**
```javascript
// In frontend, ensure companyId is available:
const { user } = useSelector((state) => state.auth);

// When creating blog:
companyId: user?.companyId || user?.company?._id
```

---

## 📊 Database Indexes

The Blog model includes these indexes for performance:

```javascript
// Compound index for company queries
blogSchema.index({ companyId: 1, status: 1 });

// Index for category filtering
blogSchema.index({ category: 1, status: 1 });

// Index for sorting by date
blogSchema.index({ createdAt: -1 });
```

---

## 🔐 Environment Variables

Ensure these are in your `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# CORS (if needed)
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Production Deployment

### Before Deploying:

1. **Security Checklist**
   - [ ] JWT_SECRET is strong and secret
   - [ ] CORS is properly configured
   - [ ] Rate limiting is enabled
   - [ ] Input validation is working
   - [ ] SQL injection prevention
   - [ ] XSS protection

2. **Performance Checklist**
   - [ ] Database indexes created
   - [ ] Response caching configured
   - [ ] Image optimization
   - [ ] Gzip compression enabled

3. **Testing Checklist**
   - [ ] All API endpoints tested
   - [ ] Authentication flows tested
   - [ ] Error handling verified
   - [ ] Edge cases covered

---

## 📈 Monitoring

### Add Logging

```javascript
// In blogRoutes.js
const logger = require('../utils/logger');

router.post('/', protect, async (req, res) => {
  try {
    logger.info(`Blog created by user ${req.user._id}`);
    // ... rest of code
  } catch (error) {
    logger.error(`Error creating blog: ${error.message}`);
    // ... error handling
  }
});
```

### Track Metrics

```javascript
// Add analytics middleware
const trackBlogView = async (req, res, next) => {
  // Track blog views
  await Analytics.create({
    type: 'blog_view',
    blogId: req.params.id,
    userId: req.user?._id,
    timestamp: new Date()
  });
  next();
};

router.get('/:id', trackBlogView, async (req, res) => {
  // ... get blog
});
```

---

## 🔄 Migration Guide

### If you already have blogs in another format:

```javascript
// migration script: scripts/migrateBlogsToCompanyBlogs.js
const Blog = require('../models/Blog');
const OldBlog = require('../models/OldBlog');

async function migrateBlogs() {
  const oldBlogs = await OldBlog.find();
  
  for (const oldBlog of oldBlogs) {
    await Blog.create({
      title: oldBlog.title,
      description: oldBlog.description || oldBlog.title.substring(0, 100),
      content: oldBlog.content,
      category: 'news', // default category
      image: oldBlog.image,
      status: 'published',
      companyId: oldBlog.companyId,
      authorId: oldBlog.authorId,
      createdAt: oldBlog.createdAt,
      updatedAt: oldBlog.updatedAt
    });
  }
  
  console.log(`✅ Migrated ${oldBlogs.length} blogs`);
}

migrateBlogs();
```

---

## ✅ Post-Integration Checklist

- [ ] Blog routes registered in server
- [ ] Database connection working
- [ ] Authentication middleware configured
- [ ] Can create blog via API
- [ ] Can fetch blogs
- [ ] Can update blog
- [ ] Can delete blog
- [ ] Frontend can fetch blogs
- [ ] Frontend can create blogs
- [ ] Images display correctly
- [ ] Categories work
- [ ] Search functionality works
- [ ] Filters work
- [ ] Pagination works (if implemented)
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Loading states work

---

## 🎉 Success!

If all checks pass, your blog system is ready! 🚀

**Next Steps:**
1. Create your first blog post
2. Test all features
3. Share with your team
4. Start showcasing your company!

---

## 📞 Need Help?

- Check the main documentation: `COMPANY_BLOG_SYSTEM.md`
- Review error logs
- Test API endpoints with Postman
- Check browser console for errors

---

*Happy Blogging! ✍️*