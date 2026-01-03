# ✅ Blog System - FIXED! Workflow & Troubleshooting Guide

## 🐛 **Issue Resolved: Invalid CompanyId Error**

### **The Problem:**
```
Error: Blog validation failed: companyId: Cast to ObjectId failed
```

### **Root Cause:**
The company API returns:
```javascript
{ data: { _id: '...', companyName: '...', ... } }
```

But the code was trying to access:
```javascript
response.data._id  // ❌ undefined
```

### **The Fix:**
```javascript
// OLD ❌
setCompanyId(response.data._id);

// NEW ✅
const company = response.data.data || response.data;
setCompanyId(company._id);
```

---

## 🚀 **Complete Fixed Workflow**

### **Step 1: Company Registration (REQUIRED FIRST)**

```javascript
// Route: /recruiter/company/registration
// API: POST /company/register
// Returns: { message: '...', data: { _id: 'companyId', ... } }
```

**What happens:**
1. Recruiter fills company registration form
2. Company is created in database
3. Company gets unique `_id` (MongoDB ObjectId)
4. This `_id` is used for all blogs

---

### **Step 2: Blog Manager Component Flow**

#### **A. Fetch Company ID**
```javascript
// API: GET /company/recruiter/:recruiterId
// Response: { data: { _id: '67783...', companyName: 'ABC Jewels', ... } }

const response = await companyApi.get(`/recruiter/${loggedUser._id}`);
const company = response.data.data || response.data;  // ✅ Handle nested structure
setCompanyId(company._id);  // ✅ Now has valid ObjectId
```

#### **B. Fetch Existing Blogs**
```javascript
// API: GET /blogs/company/:companyId
// Response: { success: true, blogs: [...] }

const response = await blogApi.get(`/company/${companyId}`);
setBlogs(response.data.blogs || []);
```

#### **C. Create New Blog**
```javascript
// API: POST /blogs
// Request Body:
{
  title: 'Our New Collection',
  description: 'Brief summary...',
  content: 'Full content...',
  category: 'event',
  image: 'https://...',
  status: 'published',
  companyId: '67783...'  // ✅ Valid MongoDB ObjectId
}

// Response: { success: true, message: '...', blog: {...} }
```

#### **D. Update Blog**
```javascript
// API: PUT /blogs/:blogId
// Same request body as create
// Response: { success: true, message: '...', blog: {...} }
```

#### **E. Delete Blog**
```javascript
// API: DELETE /blogs/:blogId
// Response: { success: true, message: '...' }
```

---

## 🔍 **Complete API Endpoints**

### **Company APIs**
```javascript
POST   /company/register              // Register new company
GET    /company/:id                   // Get company by ID
GET    /company/recruiter/:recruiterId // Get company by recruiter
PUT    /company/update/:id            // Update company
DELETE /company/delete/:id            // Delete company
```

### **Blog APIs**
```javascript
GET    /blogs                         // Get all published blogs (public)
GET    /blogs/company/:companyId      // Get company blogs (private)
GET    /blogs/:id                     // Get single blog
POST   /blogs                         // Create blog
PUT    /blogs/:id                     // Update blog
DELETE /blogs/:id                     // Delete blog
POST   /blogs/:id/like                // Like/unlike blog
```

---

## ✅ **Testing Checklist**

### **Pre-requisites:**
- [ ] Server running on port 5000
- [ ] Client running on port 5173
- [ ] User logged in as recruiter
- [ ] Company registered

### **Test Flow:**
```bash
1. Login as recruiter
   ✅ Check: User role is 'recruiter'
   
2. Register company (if not done)
   ✅ Navigate to /recruiter/company/registration
   ✅ Fill all fields
   ✅ Submit form
   ✅ Check: Success message appears
   
3. Navigate to blogs
   ✅ Go to /recruiter/blogs
   ✅ Check: No 404 errors in console
   ✅ Check: Company ID is logged in console
   
4. Create blog
   ✅ Click "Create New Blog"
   ✅ Fill all required fields
   ✅ Submit
   ✅ Check: Success alert appears
   ✅ Check: Blog appears in list
   
5. Edit blog
   ✅ Click "Edit" on a blog
   ✅ Modify fields
   ✅ Submit
   ✅ Check: Changes saved
   
6. Delete blog
   ✅ Click "Delete" on a blog
   ✅ Confirm deletion
   ✅ Check: Blog removed from list
```

---

## 🐛 **Common Errors & Solutions**

### **Error 1: "Cast to ObjectId failed"**
```
Error: companyId: Cast to ObjectId failed
```

**Cause:** Invalid or missing company ID

**Solution:**
```bash
1. Check browser console for company ID:
   console.log('Company ID:', companyId)
   
2. If undefined/null:
   - Register company first
   - Check company API response structure
   
3. If still failing:
   - Check backend Blog model
   - Ensure companyId field accepts ObjectId
```

---

### **Error 2: 404 Not Found**
```
GET /api/blogs/company/undefined - 404
```

**Cause:** Company ID not loaded yet

**Solution:**
- Wait for company API call to complete
- Check useEffect dependencies
- Ensure companyId state is set before blog fetch

---

### **Error 3: "Company not found"**
```
GET /company/recruiter/:id - 404
```

**Cause:** No company registered for this recruiter

**Solution:**
```bash
1. Navigate to /recruiter/company/registration
2. Fill and submit registration form
3. Return to /recruiter/blogs
4. Blog manager should now work
```

---

### **Error 4: "Not authorized to update/delete"**
```
403 Forbidden: Not authorized to update this blog
```

**Cause:** User is not the blog author

**Solution:**
- Only the blog creator can edit/delete
- Check if logged in with correct recruiter account
- Each blog has `authorId` field

---

## 🛠️ **Debugging Tips**

### **1. Check Console Logs**
```javascript
// In BlogManager.jsx, these logs are added:
console.log('Fetching company for user:', loggedUser._id);
console.log('Company API response:', response.data);
console.log('Company ID set:', company._id);
console.log('Fetching blogs for company:', companyId);
console.log('Submitting blog data:', blogData);
```

### **2. Check Network Tab**
```bash
1. Open DevTools (F12)
2. Go to Network tab
3. Try creating a blog
4. Check API calls:
   
   ✅ GET http://localhost:5000/company/recruiter/xxx
   ✅ GET http://localhost:5000/blogs/company/xxx
   ✅ POST http://localhost:5000/blogs
   
   ❌ NOT: http://localhost:5173/api/blogs
```

### **3. Check MongoDB**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use your_database_name

# Check companies
db.companies.find({ recruiterId: ObjectId('...') })

# Check blogs
db.blogs.find({ companyId: ObjectId('...') })
```

---

## 📊 **Data Flow Diagram**

```
RECRUITER LOGIN
    ↓
GET /company/recruiter/:recruiterId
    ↓
Extract company._id
    ↓
SET companyId state
    ↓
GET /blogs/company/:companyId
    ↓
Display blogs in UI
    ↓
USER CREATES BLOG
    ↓
POST /blogs { ...data, companyId }
    ↓
Blog saved with companyId & authorId
    ↓
Refresh blog list
    ↓
Display new blog
```

---

## ✅ **Verification Commands**

### **1. Check Server Running**
```bash
cd server
npm run dev

# Should see:
# ✅ Server running on port 5000
# ✅ MongoDB connected
```

### **2. Check Client Running**
```bash
cd client
npm run dev

# Should see:
# ✅ VITE ready
# ✅ Local: http://localhost:5173
```

### **3. Check API Connection**
```bash
# Open browser console
# Should see:
🌐 API Base URL: http://localhost:5000
```

### **4. Test Company API**
```bash
curl http://localhost:5000/company/:companyId

# Should return company data
```

### **5. Test Blog API**
```bash
curl http://localhost:5000/blogs

# Should return published blogs
```

---

## 📝 **Code Changes Made**

### **File: client/src/pages/recruiter/blogs/BlogManager.jsx**

#### **Change 1: Import API instances**
```javascript
// OLD ❌
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// NEW ✅
import { blogApi, companyApi } from '../../../api/api';
```

#### **Change 2: Fix company ID extraction**
```javascript
// OLD ❌
const response = await axios.get(`${API_URL}/api/company/recruiter/${loggedUser._id}`);
setCompanyId(response.data._id);  // undefined!

// NEW ✅
const response = await companyApi.get(`/recruiter/${loggedUser._id}`);
const company = response.data.data || response.data;
setCompanyId(company._id);  // Valid ObjectId!
```

#### **Change 3: Use configured API instances**
```javascript
// OLD ❌
await axios.get(`${API_URL}/api/blogs/company/${companyId}`);
await axios.post(`${API_URL}/api/blogs`, blogData);
await axios.put(`${API_URL}/api/blogs/${id}`, blogData);
await axios.delete(`${API_URL}/api/blogs/${id}`);

// NEW ✅
await blogApi.get(`/company/${companyId}`);
await blogApi.post('/', blogData);
await blogApi.put(`/${id}`, blogData);
await blogApi.delete(`/${id}`);
```

#### **Change 4: Enhanced error handling**
```javascript
// Added detailed console logging
console.log('Company ID set:', company._id);
console.log('Submitting blog data:', blogData);
console.log('Error response:', error.response?.data);

// Better error messages
const errorMsg = error.response?.data?.message || 
                 error.response?.data?.error || 
                 error.message;
alert('❌ Error: ' + errorMsg);
```

---

## 🎉 **Summary**

### **What Was Fixed:**
1. ✅ Company ID extraction from nested API response
2. ✅ API calls using configured instances
3. ✅ Proper error handling and logging
4. ✅ Company registration check before blogs

### **What Now Works:**
1. ✅ Fetch company by recruiter ID
2. ✅ Extract valid MongoDB ObjectId
3. ✅ Create blogs with valid companyId
4. ✅ Update existing blogs
5. ✅ Delete blogs
6. ✅ List all company blogs

### **Required Steps:**
1. ✅ Pull latest code: `git pull origin main`
2. ✅ Restart servers (both client & server)
3. ✅ Register company (if not done)
4. ✅ Navigate to `/recruiter/blogs`
5. ✅ Create your first blog!

---

## 📞 **Need Help?**

### **Check These First:**
1. Company registered? → `/recruiter/company/registration`
2. Servers running? → Check terminals
3. Console errors? → Open DevTools
4. API calls correct? → Check Network tab
5. Company ID valid? → Check console logs

### **Still Having Issues?**
1. Clear browser cache
2. Restart both servers
3. Check MongoDB connection
4. Verify user is logged in as recruiter
5. Check company exists in database

---

**🎉 Your blog system is now fully functional and ready to use!**

Navigate to `/recruiter/blogs` and start sharing your company's story! 🚀
