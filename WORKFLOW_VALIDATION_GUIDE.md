# 🔍 Complete Project Workflow Validation & Debugging Guide

## 📋 Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [Recruiter Workflow](#recruiter-workflow)
3. [Candidate Workflow](#candidate-workflow)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [API Endpoints](#api-endpoints)
6. [Frontend Routes](#frontend-routes)
7. [Validation Rules](#validation-rules)

---

## 🔐 Authentication Flow

### Registration
**Route:** `/register`
**API:** `POST /user/register`

**Required Fields:**
- ✅ Username (min 3 characters)
- ✅ Email (valid email format)
- ✅ Password (min 6 characters)
- ✅ Role ("candidate" or "recruiter")
- ✅ Phone Number

**Validation:**
```javascript
// Client-side
- Email format check
- Password strength check
- Phone number format

// Server-side
- Unique email check
- Unique username check
- Password hashing (bcrypt)
```

**Success Flow:**
1. User submits registration form
2. Backend validates and creates user
3. JWT token generated
4. User logged in automatically
5. Redirect to role-based home:
   - Recruiter → `/recruiter/home`
   - Candidate → `/candidate/home`

**Common Errors:**
- ❌ "Email already exists" - Use different email
- ❌ "Username taken" - Choose different username
- ❌ "Password too short" - Min 6 characters required

---

### Login
**Route:** `/login`
**API:** `POST /user/login`

**Required Fields:**
- ✅ Email
- ✅ Password

**Success Flow:**
1. User enters credentials
2. Backend validates
3. JWT token returned
4. Token stored in Redux + localStorage
5. Redirect based on role

**Common Errors:**
- ❌ "Invalid credentials" - Check email/password
- ❌ "User not found" - Register first

---

## 👔 Recruiter Workflow

### Step 1: Company Registration
**Route:** `/recruiter/company/registration`
**API:** `POST /company/register`

**Required Fields:**
- ✅ Company Name
- ✅ **Business Type** (NEW - jewelry specific)
- ✅ Industry (auto-set to "Jewelry & Gems")
- ✅ Company Size
- ✅ Established Year
- ✅ Head Office Location
- ✅ Description
- ✅ Contact Email
- ✅ Contact Number

**Optional Jewelry Fields:**
- Specializations (multi-select)
- Certifications (multi-select)
- Workshop Facilities (multi-select)
- Additional Branches (dynamic array)
- Social Media Links
- Company Logo (file upload)

**Validation:**
```javascript
// Client-side
if (!companyType) {
  alert("Please select business type!");
  return;
}

// Server-side
if (!companyType || !companyName || !size) {
  return res.status(400).json({ message: "Required fields missing" });
}
```

**Success Flow:**
1. Recruiter fills form
2. Selects business type (REQUIRED)
3. Optionally adds specializations, certifications
4. Adds branches if needed
5. Uploads logo (optional)
6. Submit → Company created
7. Redirect to `/recruiter/home`

**Common Errors:**
- ❌ "companyType is required" → Select business type from dropdown
- ❌ "Company already exists" → Email/phone already registered
- ❌ "File upload failed" → Check file size (max 5MB)

**Debug Steps:**
1. Open browser console
2. Check FormData contents in Network tab
3. Verify `companyType` is being sent
4. Check backend logs for validation errors

---

### Step 2: Post a Job
**Route:** `/recruiter/company/jobpost` or `/recruiter/jobpost`
**API:** `POST /jobs/create`

**Required Fields:**
- ✅ Job Title
- ✅ Description
- ✅ Job Location
- ✅ Company ID (auto-fetched)
- ✅ Recruiter ID (auto-fetched)

**Jewelry-Specific Fields:**
- Jewelry Category (Design, Manufacturing, Sales, etc.)
- Specializations (Goldsmith, Gemologist, CAD Designer, etc.)
- Materials Experience (Gold, Silver, Diamonds, etc.)
- Techniques Proficiency (CAD/CAM, Stone Setting, etc.)
- Certifications Required (GIA, IGI, BIS, etc.)
- Portfolio Required (toggle)

**General Fields:**
- Job Type (On-site, Remote, Hybrid)
- Employment Type (Full-time, Part-time, Contract)
- Experience Level
- Salary Range
- Number of Openings
- Application Deadline
- Skills Required

**Success Flow:**
1. Select jewelry category
2. Add specializations needed
3. Select materials and techniques
4. Fill general job details
5. Submit → Job posted
6. View in "Posted Jobs"

---

### Step 3: View Posted Jobs
**Route:** `/recruiter/company/postedjobs` or `/recruiter/postedjobs`
**API:** `GET /jobs/recruiter/:recruiterId`

**Features:**
- View all posted jobs
- Edit job details
- Delete jobs
- View applicants count
- Job status (Open/Closed)

---

### Step 4: Manage Applications
**Route:** `/recruiter/candidates-list` or `/recruiter/applications`
**API:** `GET /application/recruiter/:recruiterId`

**Features:**
- View all applications
- Filter by job
- Filter by status (Pending, Accepted, Rejected)
- View candidate profiles
- Accept/Reject applications
- Send messages to candidates

---

## 👨‍💼 Candidate Workflow

### Step 1: Create Resume
**Route:** `/candidate/create-resume`
**API:** `POST /resume/create`

**Required Sections:**
- Personal Information
- Education
- Work Experience
- Skills

**Optional Sections:**
- Certifications
- Projects
- Languages
- Portfolio Links

**Success Flow:**
1. Fill personal details
2. Add education history
3. Add work experience
4. Add skills
5. Submit → Resume created
6. Redirect to resume view

---

### Step 2: Browse Jobs
**Route:** `/candidate/jobs` or `/jobs`
**API:** `GET /jobs`

**Features:**
- View all available jobs
- Filter by jewelry category
- Filter by location
- Filter by experience level
- Search by keywords
- View job details

---

### Step 3: Apply for Jobs
**Route:** `/candidate/job/:jobId`
**API:** `POST /application/apply`

**Requirements:**
- ✅ Resume must be created first
- ✅ Valid job ID

**Success Flow:**
1. Click "Apply Now" on job
2. Review job details
3. Confirm application
4. Application submitted
5. Notification sent to recruiter

**Common Errors:**
- ❌ "Resume not found" → Create resume first
- ❌ "Already applied" → Can't apply twice

---

### Step 4: Track Applications
**Route:** `/candidate/applications/list` or `/candidate/appliedJobs`
**API:** `GET /application/candidate/:candidateId`

**Features:**
- View all applications
- Application status
- Interview schedules
- Messages from recruiters

---

## 🐛 Common Issues & Solutions

### Issue 1: "companyType is required" Error

**Symptoms:**
- 400 Bad Request on company registration
- Error: "Path `companyType` is required"

**Solution:**
```javascript
// Make sure dropdown is filled
<select 
  name="companyType"
  value={formik.values.companyType}
  onChange={formik.handleChange}
  required
>
  <option value="">Select Business Type</option>
  {COMPANY_TYPES.map(type => (
    <option key={type} value={type}>{type}</option>
  ))}
</select>

// Verify it's sent in FormData
formData.append("companyType", values.companyType);
```

---

### Issue 2: Resume 404 Error

**Symptoms:**
- "Resume not found" error
- 404 on `/resume/:userId`

**Solution:**
- This is NORMAL for new users who haven't created a resume yet
- Sidepanel correctly shows "Create Resume" button
- Error can be ignored or handled gracefully:

```javascript
try {
  const response = await resumeApi.get(`/${userId}`);
  dispatch(setResume(response.data));
} catch (error) {
  if (error.response?.status === 404) {
    dispatch(setResume(null)); // No resume yet - normal
  } else {
    console.error("Error:", error); // Real error
  }
}
```

---

### Issue 3: FormData Not Received

**Symptoms:**
- Fields show as undefined in backend
- Validation errors for filled fields

**Solution:**
1. Check Content-Type header:
```javascript
const response = await api.post("/endpoint", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

2. Parse JSON arrays on backend:
```javascript
const specializations = JSON.parse(req.body.specializations);
```

3. Debug FormData:
```javascript
for (let pair of formData.entries()) {
  console.log(pair[0] + ': ' + pair[1]);
}
```

---

### Issue 4: Navigation Not Working

**Symptoms:**
- Clicking links doesn't navigate
- Page refreshes instead of client-side routing

**Solution:**
```javascript
// Use React Router's useNavigate
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/target/path');

// NOT:
window.location.href = '/target/path'; // This causes full reload
```

---

## 🌐 API Endpoints

### Authentication
```
POST   /user/register          - Register new user
POST   /user/login             - Login user
GET    /user/:id               - Get user details
PUT    /user/update/:id        - Update user profile
```

### Company
```
POST   /company/register       - Register company (jewelry fields)
GET    /company/:id            - Get company by ID
GET    /company/recruiter/:id  - Get company by recruiter
PUT    /company/update/:id     - Update company
DELETE /company/:id            - Delete company
```

### Jobs
```
POST   /jobs/create            - Create job (jewelry fields)
GET    /jobs                   - Get all jobs
GET    /jobs/:id               - Get job by ID
GET    /jobs/recruiter/:id     - Get jobs by recruiter
GET    /jobs/company/:id       - Get jobs by company
PUT    /jobs/update/:id        - Update job
DELETE /jobs/:id               - Delete job
GET    /jobs/featured          - Get featured jobs
GET    /jobs/categories        - Get jewelry categories stats
```

### Resume
```
POST   /resume/create          - Create resume
GET    /resume/:userId         - Get resume by user
PUT    /resume/update/:id      - Update resume
DELETE /resume/:id             - Delete resume
```

### Applications
```
POST   /application/apply      - Apply for job
GET    /application/candidate/:id - Get candidate applications
GET    /application/recruiter/:id - Get recruiter applications
PUT    /application/update/:id    - Update application status
```

---

## 🗺️ Frontend Routes

### Public Routes
```
/                    - Home page
/login               - Login page
/register            - Registration page
/jobs                - Browse jobs (public)
/about               - About page
/contact             - Contact page
/blogs               - Company blogs/stories
/faq                 - FAQ page
/privacy-policy      - Privacy policy
```

### Recruiter Routes
```
/recruiter/home                           - Recruiter dashboard
/recruiter/company/registration           - Register company (JEWELRY FORM)
/recruiter/company/:id                    - View company
/recruiter/company/edit/:id               - Edit company
/recruiter/company/jobpost                - Post job (JEWELRY FORM)
/recruiter/company/postedjobs             - View posted jobs
/recruiter/company/postedjobs/edit/:id    - Edit job
/recruiter/candidates-list                - View applications
/recruiter/candidates-list/:id            - View candidate details
/recruiter/profile                        - Recruiter profile
/recruiter/blogs                          - Company blogs
/recruiter/chat                           - Messaging
/recruiter/notifications                  - Notifications
```

### Candidate Routes
```
/candidate/home                  - Candidate dashboard
/candidate/resume                - View resume
/candidate/create-resume         - Create resume
/candidate/edit-resume           - Edit resume
/candidate/jobs                  - Browse jobs
/candidate/job/:id               - View job details
/candidate/job/apply             - Apply for job
/candidate/applications/list     - View applications
/candidate/profile               - Candidate profile
/candidate/chat                  - Messaging
/candidate/notifications         - Notifications
```

---

## ✅ Validation Rules

### Company Registration
```javascript
REQUIRED:
- companyName         (string, min 2 chars)
- companyType         (enum - 13 options) ⭐ NEW
- industry            (string - auto "Jewelry & Gems")
- size                (enum - 5 options)
- establishedYear     (number, 1800-2026)
- location            (string)
- description         (string, min 20 chars)
- contactEmail        (valid email)
- contactNumber       (valid phone)
- recruiterId         (ObjectId)

OPTIONAL:
- uploadLogo          (file, max 5MB)
- website             (valid URL)
- specializations     (array of strings)
- certifications      (array of strings)
- workshopFacilities  (array of strings)
- branches            (array of objects)
- socialMedia         (object with URLs)
```

### Job Posting
```javascript
REQUIRED:
- title               (string)
- description         (string, min 50 chars)
- jobLocation         (string)
- companyId           (ObjectId)
- recruiterId         (ObjectId)

OPTIONAL (but recommended for jewelry jobs):
- jewelryCategory            (enum)
- jewelrySpecialization      (array)
- materialsExperience        (array)
- techniquesProficiency      (array)
- certifications             (array)
- portfolioRequired          (boolean)
- jobType                    (enum)
- empType                    (enum)
- experience                 (enum)
- salary                     (string)
- openings                   (number, default 1)
- deadline                   (date)
- skills                     (array)
```

### Resume Creation
```javascript
REQUIRED:
- userId              (ObjectId)
- fullName            (string)
- email               (valid email)
- phone               (valid phone)
- headline            (string)

OPTIONAL:
- summary             (string)
- education           (array)
- experience          (array)
- skills              (array)
- certifications      (array)
- projects            (array)
- languages           (array)
- portfolio           (array of URLs)
```

---

## 🔧 Debug Checklist

### Before Submitting Forms:
- [ ] All required fields filled?
- [ ] Valid email format?
- [ ] Valid phone format?
- [ ] File size within limits?
- [ ] Dropdowns selected (not default "Select...")

### Frontend Debugging:
- [ ] Check browser console for errors
- [ ] Check Network tab for API calls
- [ ] Verify FormData contents
- [ ] Check Redux state
- [ ] Verify localStorage tokens

### Backend Debugging:
- [ ] Check server console logs
- [ ] Verify database connection
- [ ] Check MongoDB collections
- [ ] Verify JWT token validity
- [ ] Check file upload middleware

### Common Console Commands:
```javascript
// Check Redux state
console.log(store.getState());

// Check localStorage
console.log(localStorage.getItem('token'));

// Check FormData
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

// Check API response
console.log('Response:', response.data);
```

---

## 🎯 Testing Workflow

### Complete Recruiter Flow Test:
1. ✅ Register as recruiter
2. ✅ Login
3. ✅ Register jewelry company (select business type!)
4. ✅ Post jewelry job (select category)
5. ✅ View posted jobs
6. ✅ Edit job
7. ✅ View applications (when candidates apply)
8. ✅ Accept/Reject applications

### Complete Candidate Flow Test:
1. ✅ Register as candidate
2. ✅ Login
3. ✅ Create resume
4. ✅ Browse jobs
5. ✅ View job details
6. ✅ Apply for job
7. ✅ Track application status
8. ✅ Receive notifications

---

## 📞 Support & Issues

If you encounter issues:
1. Check this guide first
2. Check browser console
3. Check server logs
4. Verify database connection
5. Clear cache and retry

**Most Common Fix:** Pull latest changes and restart both servers!

```bash
git pull origin main
cd server && npm run dev
cd client && npm run dev
```

---

## ✨ New Jewelry Features Summary

### Company Registration:
- 13 business types (Manufacturer, Retailer, Designer, etc.)
- 15 specializations (Gold, Diamond, Bridal, etc.)
- 9 certifications (BIS, ISO, RJC, etc.)
- 10 workshop facilities (CAD Lab, Gemology Lab, etc.)
- Dynamic branches management
- Social media integration

### Job Posting:
- 10 jewelry categories (Design, Manufacturing, Sales, etc.)
- 12 specializations (Goldsmith, Gemologist, CAD Designer, etc.)
- 15+ materials (Gold, Silver, Diamonds, Gemstones, etc.)
- 12 techniques (CAD/CAM, Stone Setting, Filigree, etc.)
- 8 certifications (GIA, IGI, BIS, etc.)
- Portfolio requirement toggle

---

**Last Updated:** January 3, 2026
**Version:** 2.0.0 (Jewelry Industry Update)
