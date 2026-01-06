# Security Middleware Setup Guide

## Quick Setup Instructions

After running `npm install`, add these security middlewares to your `server.js`.

---

## Step 1: Import Security Packages

Add these imports at the top of `server/server.js` (around line 8):

```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
```

---

## Step 2: Add Middleware Configuration

Add this code after the body parsing middleware (around line 125):

```javascript
/* ================= BODY PARSING ================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ================= DATA SANITIZATION ================= */
// Prevent MongoDB injection attacks
app.use(
  mongoSanitize({
    replaceWith: '_', // Replace prohibited characters with underscore
    onSanitize: ({ req, key }) => {
      logger.warn(`⚠️  MongoDB injection attempt detected - Sanitized field: ${key}`);
    },
  })
);

// Prevent XSS attacks - sanitize user input
app.use(xss());

logger.info('✅ Security middleware initialized');
```

---

## Complete Security Middleware Section

Here's the complete updated section for reference:

```javascript
/* ================= BODY PARSING ================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ================= DATA SANITIZATION ================= */
// MongoDB Injection Prevention
// Prevents queries like: { "username": { "$gt": "" } }
app.use(
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      logger.warn(`⚠️  MongoDB injection attempt detected:`);
      logger.warn(`   - Endpoint: ${req.method} ${req.originalUrl}`);
      logger.warn(`   - Field: ${key}`);
      logger.warn(`   - IP: ${req.ip}`);
    },
  })
);

// XSS Prevention
// Sanitizes HTML/Script tags from user input
app.use(xss());

/* ================= STATIC FILES ================= */
app.use('/uploads', express.static('uploads'));

/* ================= RATE LIMITING ================= */
// Apply general rate limiting to API routes
app.use('/api', limiter);
```

---

## What These Middlewares Protect Against

### 1. express-mongo-sanitize

**Protects against:** MongoDB Injection Attacks

**Example Attack (Blocked):**
```javascript
// Malicious login attempt
POST /api/v1/user/login
{
  "email": { "$gt": "" },  // ❌ Will be sanitized to { "_gt": "" }
  "password": { "$ne": null }  // ❌ Will be sanitized
}
```

**What it does:**
- Removes or replaces MongoDB operators (`$gt`, `$ne`, `$in`, etc.)
- Sanitizes keys in req.body, req.query, req.params
- Logs sanitization attempts for security monitoring

### 2. xss-clean

**Protects against:** Cross-Site Scripting (XSS) Attacks

**Example Attack (Blocked):**
```javascript
// Malicious user input
POST /api/v1/blog/create
{
  "title": "Normal Title",
  "content": "<script>alert('XSS')</script>"  // ❌ Will be sanitized
}
```

**What it does:**
- Removes potentially dangerous HTML/JavaScript
- Sanitizes `<script>`, `<iframe>`, `onerror=`, etc.
- Cleans req.body, req.query, req.params

---

## Testing the Security

### Test MongoDB Injection Protection

```bash
# This malicious request will be blocked
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": {"$gt": ""},
    "password": {"$ne": null}
  }'

# Check logs - you should see:
# ⚠️  MongoDB injection attempt detected - Sanitized field: email
```

### Test XSS Protection

```bash
# This malicious script will be sanitized
curl -X POST http://localhost:3000/api/v1/blog/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Post",
    "content": "<script>alert('XSS Attack')</script>Hello World"
  }'

# The script tag will be removed before saving to database
```

---

## Verification Checklist

After adding the middleware, verify:

- [ ] `npm install` completed successfully
- [ ] Both packages imported at the top of server.js
- [ ] Middleware added after body parsing
- [ ] Server starts without errors
- [ ] Check logs for "✅ Security middleware initialized"
- [ ] Test MongoDB injection protection
- [ ] Test XSS protection

---

## Additional Security Best Practices

### Already Implemented in Your Project:

1. **Helmet** - Secure HTTP headers
2. **Rate Limiting** - Prevent brute force attacks
3. **CORS** - Control cross-origin requests
4. **JWT** - Secure authentication
5. **bcryptjs** - Password hashing
6. **express-validator** - Input validation

### Still Need These:

7. **express-mongo-sanitize** ✅ (Added)
8. **xss-clean** ✅ (Added)

---

## Production Environment Variables

Ensure these are set in production:

```env
# Strong, randomly generated secret
JWT_SECRET=your_very_strong_random_secret_key_at_least_32_chars

# Production URLs only
CLIENT_URL=https://yourapp.com
FRONTEND_URL=https://yourapp.com
PRODUCTION_URL=https://api.yourapp.com

# Production mode
NODE_ENV=production

# Secure MongoDB connection
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

---

## Monitoring & Logging

Security events are automatically logged:

```javascript
// View security logs
npm run logs:view

// View error logs
npm run logs:errors

// Monitor in real-time
tail -f logs/combined.log | grep "injection\|XSS\|sanitized"
```

---

## Common Security Errors

### Error: Cannot find module 'express-mongo-sanitize'

**Solution:**
```bash
cd server
npm install express-mongo-sanitize xss-clean
```

### Error: Server crashes on startup

**Solution:**
Check that imports are correct:
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
```

---

## Resources

- [express-mongo-sanitize Documentation](https://github.com/fiznool/express-mongo-sanitize)
- [xss-clean Documentation](https://github.com/jsonmaur/xss-clean)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

---

## Quick Reference

### Installation
```bash
cd server
npm install
```

### Add to server.js
```javascript
// Top of file
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// After body parsing
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(xss());
```

### Test
```bash
npm run dev
curl http://localhost:3000/health
```

---

**Last Updated:** January 6, 2026  
**Status:** ✅ Ready for Implementation
