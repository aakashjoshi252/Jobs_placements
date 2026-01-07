# 🚀 Admin Panel - Complete Guide

## Overview

The Jobs_P Admin Panel is a comprehensive dashboard for platform administrators to manage users, companies, jobs, and view analytics.

---

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics**: View total users, companies, jobs, and applications
- **Role Breakdown**: See counts for candidates, recruiters, and admins
- **Company Verification Status**: Track verified vs unverified companies
- **Job Status**: Monitor active and closed job postings
- **Application Analytics**: View pending, accepted, and rejected applications
- **Recent Activity**: Quick view of recently registered users and companies

### 👥 User Management
- View all registered users with pagination
- Search users by name, email, or phone
- Filter users by role (candidate/recruiter/admin)
- Edit user details and change roles
- Delete user accounts
- Sort by creation date, name, or role

### 🏢 Company Management
- View all registered companies
- Verify or unverify companies
- Search companies by name or email
- Filter by verification status
- Delete companies
- View company owner details

### 💼 Job Management
- View all job postings
- Filter by job status (Open/Closed)
- Search jobs by title or description
- Delete job postings
- View associated company and creator details

### 📈 Analytics Dashboard
- User growth trends over time
- Application submission trends
- Top companies by job count
- Customizable time periods
- Visual charts and graphs

---

## 🔧 Backend Setup

### API Endpoints

All admin endpoints require authentication and admin role. Base URL: `/api/v1/admin`

#### Dashboard & Analytics
```
GET  /stats         - Get admin dashboard statistics
GET  /analytics     - Get platform analytics (with period query param)
```

#### User Management
```
GET    /users       - Get all users (with pagination, search, filters)
GET    /users/:id   - Get user by ID
PUT    /users/:id   - Update user details
DELETE /users/:id   - Delete user
```

#### Company Management
```
GET    /companies          - Get all companies (with pagination, search)
PATCH  /companies/:id/verify - Verify/unverify company
DELETE /companies/:id      - Delete company
```

#### Job Management
```
GET    /jobs       - Get all jobs (with pagination, filters)
DELETE /jobs/:id   - Delete job
```

### Query Parameters

**Pagination:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Sorting:**
- `sortBy` - Field to sort by (e.g., 'createdAt', 'username')
- `order` - Sort order ('asc' or 'desc')

**Filtering:**
- `role` - Filter users by role
- `isVerified` - Filter companies by verification status
- `status` - Filter jobs by status
- `search` - Search across relevant fields

**Analytics:**
- `period` - Number of days to analyze (default: 30)

---

## 🎨 Frontend Setup

### 1. Install Required Dependencies

The admin panel uses the following packages (already in your project):

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "lucide-react": "latest"
}
```

### 2. Add Routes to Your App

Update your `App.jsx` or router configuration:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CompanyManagement from './pages/admin/CompanyManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Other routes */}
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="companies" element={<CompanyManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Update Redux Store (if using)

Make sure your auth state includes user role:

```javascript
// authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  // ... reducers
});
```

---

## 🔐 Authentication & Authorization

### Backend Middleware

The admin middleware checks for:
1. Valid authentication token
2. User role === 'admin'

```javascript
// Usage in routes
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');

adminRouter.use(protect, isAdmin); // All routes protected
```

### Frontend Protection

The `ProtectedAdminRoute` component:
- Checks if user is authenticated
- Verifies user has admin role
- Redirects unauthorized users

---

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with overlay

---
## 🚀 Quick Start

### 1. Create an Admin User

You can create an admin user in two ways:

**Option A: Directly in MongoDB**
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

**Option B: Register normally and update via MongoDB**
1. Register a new user through the app
2. Update their role to 'admin' in the database

### 2. Access Admin Panel

1. Log in with admin credentials
2. Navigate to: `http://localhost:5173/admin`
3. You'll see the admin dashboard

### 3. Start Managing

- **View Statistics**: Dashboard shows overview
- **Manage Users**: Click "Users" in sidebar
- **Verify Companies**: Click "Companies" in sidebar
- **Monitor Jobs**: Click "Jobs" in sidebar
- **View Analytics**: Click "Analytics" in sidebar

---

## 🎯 Usage Examples

### Search Users
1. Go to User Management
2. Enter search term in search box
3. Press Enter or click Search
4. Results update automatically

### Verify a Company
1. Go to Company Management
2. Find the company (use search if needed)
3. Click the checkmark icon to verify
4. Click the X icon to unverify

### Change User Role
1. Go to User Management
2. Click Edit (pencil icon) on a user
3. Select new role from dropdown
4. Click "Save Changes"

### Delete Records
1. Navigate to respective management page
2. Click trash icon on the item
3. Confirm deletion in popup
4. Record is permanently deleted

---

## 🎨 Customization

### Change Colors

Edit Tailwind colors in components:

```jsx
// Primary color (Blue)
className="bg-blue-600 hover:bg-blue-700"

// Success (Green)
className="bg-green-600 hover:bg-green-700"

// Danger (Red)
className="bg-red-600 hover:bg-red-700"
```

### Add New Management Page

1. Create component: `client/src/pages/admin/NewPage.jsx`
2. Add route to `AdminLayout`
3. Add navigation item
4. Create corresponding API endpoint

---

## 🔍 Troubleshooting

### "Access Denied" Error
**Solution**: Ensure your user account has role = 'admin'

### Admin Routes Not Working
**Solution**: Check that admin routes are imported in server.js:
```javascript
const adminRouter = require('./routes/admin.route.js');
app.use(`${API_VERSION}/admin`, adminRouter);
```

### Sidebar Not Responsive
**Solution**: Ensure Tailwind CSS is properly configured

### API Errors
**Solution**: Check browser console and server logs for details

---

## 📊 Statistics Explained

### User Statistics
- **Total Users**: All registered users
- **Candidates**: Users looking for jobs
- **Recruiters**: Company representatives
- **Admins**: Platform administrators

### Company Statistics
- **Total**: All registered companies
- **Verified**: Admin-approved companies
- **Unverified**: Pending verification

### Job Statistics
- **Total Jobs**: All job postings
- **Active**: Currently open positions
- **Closed**: Filled or expired positions

### Application Statistics
- **Total**: All job applications
- **Pending**: Awaiting review
- **Accepted**: Approved applications
- **Rejected**: Declined applications

---

## 🔒 Security Best Practices

1. **Never share admin credentials**
2. **Regularly review user roles**
3. **Monitor suspicious activity**
4. **Keep middleware updated**
5. **Use HTTPS in production**
6. **Implement rate limiting**
7. **Log all admin actions**

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Bulk user operations
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering options
- [ ] Email notifications for admin actions
- [ ] Activity audit logs
- [ ] Role-based permissions (super admin, moderator)
- [ ] Dashboard widgets customization
- [ ] Dark mode support

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Check browser console
4. Contact development team

---

## 🎉 Success!

You now have a fully functional admin panel! 🚀

**Admin Panel Features:**
- ✅ Dashboard with real-time stats
- ✅ User management (CRUD)
- ✅ Company verification
- ✅ Job monitoring
- ✅ Analytics and insights
- ✅ Protected routes
- ✅ Responsive design
- ✅ Search and filters
- ✅ Pagination

**Next Steps:**
1. Create your admin account
2. Explore the dashboard
3. Test all features
4. Customize as needed
5. Deploy to production

Happy managing! 🎊
