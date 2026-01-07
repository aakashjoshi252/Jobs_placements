# 🛠️ Implementation Guide - Integrating Error Handling & Validation

## 📌 Overview

This guide shows you **exactly** how to integrate the newly added error handling and validation system into your existing codebase.

---

## 🚨 Step 1: Update server.js

### Add Error Handler Middleware

Update your `server/server.js` file to use the global error handler:

```javascript
// At the top with other imports
const { errorHandler, notFound } = require('./middlewares/errorHandler.middleware');

// ... your existing middleware ...

// Register all your routes here
app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/user`, userRouter);
app.use(`${API_VERSION}/company`, companyRouter);
app.use(`${API_VERSION}/job`, jobRouter);
app.use(`${API_VERSION}/application`, applicationRouter);
app.use(`${API_VERSION}/admin`, adminRouter);
// ... other routes ...

// ⚠️ ADD THESE AFTER ALL ROUTES (Order matters!)
// 404 Handler - catches routes that don't exist
app.use(notFound);

// Global Error Handler - catches all errors
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**🔑 Key Points:**
- Put `notFound` middleware AFTER all routes
- Put `errorHandler` middleware LAST
- Order is critical!

---

## 🚨 Step 2: Update Route Handlers

### Wrap Async Functions with asyncHandler

#### Example: Auth Controller

**Before:**
```javascript
// auth.controller.js
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // ... your code ...
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**After:**
```javascript
// auth.controller.js
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // ... your code ...
  return ApiResponse.success(res, user, 'User registered successfully', 201);
});
```

**Benefits:**
- No more try-catch blocks
- Automatic error handling
- Cleaner code
- Errors automatically caught by global handler

---

## 🚨 Step 3: Add Validation to Routes

### Example: Auth Routes

**Before:**
```javascript
// auth.route.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

**After:**
```javascript
// auth.route.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
```

**What This Does:**
1. Validates request body before reaching controller
2. Returns 400 error with specific validation messages
3. Strips unknown fields
4. Sanitizes input

---

## 🚨 Step 4: Update Controllers to Use ApiResponse

### Standardize All Responses

**Before:**
```javascript
// Different response formats
res.json({ success: true, data: jobs });
res.status(200).json({ jobs, message: 'Success' });
res.send({ result: user });
```

**After:**
```javascript
const ApiResponse = require('../utils/apiResponse');

// Success response
ApiResponse.success(res, jobs, 'Jobs fetched successfully');

// Success with pagination
ApiResponse.successWithPagination(res, jobs, pagination, 'Jobs fetched');

// Error response
ApiResponse.error(res, 'Failed to fetch jobs', 500);

// Not found
ApiResponse.notFound(res, 'Job not found');

// Unauthorized
ApiResponse.unauthorized(res, 'Please login to continue');
```

---

## 📝 Complete Example: Job Controller

### Before (Old Way)

```javascript
// job.controller.js
const Job = require('../models/job.model');

const createJob = async (req, res) => {
  try {
    const { title, description, company } = req.body;
    
    // No validation here
    const job = new Job({
      title,
      description,
      company,
      createdBy: req.user._id
    });
    
    await job.save();
    
    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createJob, getJobs };
```

### After (New Way)

```javascript
// job.controller.js
const Job = require('../models/job.model');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/apiResponse');

/**
 * Create new job
 * @route POST /api/v1/job
 * @access Private (Recruiter only)
 */
const createJob = asyncHandler(async (req, res) => {
  // Validation already done by middleware
  const jobData = {
    ...req.body,
    createdBy: req.user._id
  };
  
  const job = await Job.create(jobData);
  
  return ApiResponse.success(
    res,
    job,
    'Job created successfully',
    201
  );
});

/**
 * Get all jobs with filters
 * @route GET /api/v1/job
 * @access Public
 */
const getJobs = asyncHandler(async (req, res) => {
  // Query validation done by middleware
  const { page = 1, limit = 10, search, location, jobType } = req.query;
  
  // Build query
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (location) query.location = new RegExp(location, 'i');
  if (jobType) query.jobType = jobType;
  
  // Execute with pagination
  const jobs = await Job.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const total = await Job.countDocuments(query);
  
  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total
  };
  
  return ApiResponse.successWithPagination(
    res,
    jobs,
    pagination,
    'Jobs fetched successfully'
  );
});

module.exports = { createJob, getJobs };
```

### Route File

```javascript
// job.route.js
const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isRecruiter } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createJobSchema, jobQuerySchema } = require('../validations/job.validation');

// Public routes
router.get('/', validate(jobQuerySchema, 'query'), getJobs);

// Protected routes
router.post(
  '/',
  protect,
  isRecruiter,
  validate(createJobSchema),
  createJob
);

module.exports = router;
```

---

## ✅ Testing the Integration

### Test Error Handling

1. **Test Invalid Route (404)**
```bash
curl http://localhost:3000/api/v1/invalid-route

# Expected Response:
{
  "success": false,
  "message": "Route /api/v1/invalid-route not found",
  "timestamp": "2026-01-07T09:00:00.000Z"
}
```

2. **Test Validation Error**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'

# Expected Response:
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" },
    { "field": "username", "message": "Username is required" },
    { "field": "password", "message": "Password is required" }
  ],
  "timestamp": "2026-01-07T09:00:00.000Z"
}
```

3. **Test Server Error**
```javascript
// Intentionally throw error
const testError = asyncHandler(async (req, res) => {
  throw new Error('Test error');
});

// Response:
{
  "success": false,
  "message": "Test error",
  "timestamp": "2026-01-07T09:00:00.000Z"
}
```

---

## 📝 Checklist

### Backend Updates

- [ ] Update `server.js` with error handlers
- [ ] Wrap all async controllers with `asyncHandler`
- [ ] Replace response methods with `ApiResponse`
- [ ] Add validation middleware to routes
- [ ] Test each endpoint
- [ ] Check logs for errors

### Controllers to Update

- [ ] `auth.controller.js`
- [ ] `user.controller.js`
- [ ] `job.controller.js`
- [ ] `company.controller.js`
- [ ] `application.controller.js`
- [ ] `admin.controller.js`
- [ ] `chat.controller.js`
- [ ] `notification.controller.js`

### Routes to Add Validation

- [ ] `auth.route.js` - Use `auth.validation.js`
- [ ] `job.route.js` - Use `job.validation.js`
- [ ] `company.route.js` - Use `company.validation.js`
- [ ] Other routes as needed

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property 'statusCode' of undefined"
**Cause**: Error not thrown properly  
**Solution**: Make sure to use `throw new Error('message')` or return error

### Issue 2: Validation not working
**Cause**: Validation middleware not in correct order  
**Solution**: Put validation BEFORE controller in route

```javascript
// ❌ Wrong
router.post('/', controller, validate(schema));

// ✅ Correct
router.post('/', validate(schema), controller);
```

### Issue 3: Error handler not catching errors
**Cause**: Error handler not at the end  
**Solution**: Put error handler LAST in server.js

### Issue 4: Try-catch still needed?
**No!** If you use `asyncHandler`, you don't need try-catch

```javascript
// ❌ Old way (still works but verbose)
const func = async (req, res) => {
  try {
    // code
  } catch (error) {
    // handle
  }
};

// ✅ New way (cleaner)
const func = asyncHandler(async (req, res) => {
  // code - errors automatically caught
});
```

---

## 🎯 Priority Order

### Day 1: Core Integration
1. Update `server.js` with error handlers
2. Test 404 and 500 errors
3. Wrap auth controller with asyncHandler
4. Add validation to auth routes

### Day 2: Controllers
1. Update all controllers to use asyncHandler
2. Replace response methods with ApiResponse
3. Test each endpoint

### Day 3: Validation
1. Add validation to all routes
2. Create missing validation schemas
3. Test validation errors

### Day 4: Testing & Polish
1. Test all endpoints
2. Check error logs
3. Fix any issues
4. Update frontend error handling

---

## 📚 Additional Resources

### Validation Schema Examples

**Create more schemas as needed:**

```javascript
// server/validations/application.validation.js
const Joi = require('joi');

const applyJobSchema = Joi.object({
  jobId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  coverLetter: Joi.string()
    .min(50)
    .max(1000)
    .optional(),
  resume: Joi.string()
    .uri()
    .optional(),
});

module.exports = { applyJobSchema };
```

### Error Types Reference

```javascript
// Custom error class (optional enhancement)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage:
throw new AppError('User not found', 404);
```

---

## ✅ Success Criteria

You'll know the integration is successful when:

1. ✅ No unhandled promise rejections
2. ✅ All errors return consistent JSON format
3. ✅ Validation errors show specific field messages
4. ✅ 404 errors work for invalid routes
5. ✅ Server doesn't crash on errors
6. ✅ Logs show detailed error information
7. ✅ Frontend receives expected error format

---

## 🚀 You're Ready!

With these changes, your backend will be:
- ✅ **More robust** - Handles all errors gracefully
- ✅ **More secure** - Validates all input
- ✅ **More maintainable** - Cleaner code
- ✅ **More consistent** - Standard API responses
- ✅ **Production-ready** - Follows best practices

Start with auth routes and gradually update the rest. Take it step by step! 💪
