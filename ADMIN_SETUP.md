# 🚀 Admin Panel Quick Setup

## ✅ Already Done!

Your admin panel is **fully integrated** and ready to use! Here's what's been added:

### Backend ✅
- Admin middleware for authentication
- Complete admin controller with all CRUD operations
- Admin routes registered at `/api/v1/admin`
- Statistics and analytics endpoints

### Frontend ✅
- Admin layout with sidebar navigation
- Dashboard with real-time statistics
- User management page
- Company management page
- Job management page
- Analytics page with trends
- Protected admin routes
- Mobile responsive design

---

## 🔑 Step 1: Create Admin User

### Option A: Using MongoDB Compass or Studio 3T

1. Open your database
2. Find the `users` collection
3. Find your user account
4. Update the `role` field from `"candidate"` or `"recruiter"` to `"admin"`
5. Save the document

### Option B: Using MongoDB Shell

```bash
# Connect to your MongoDB
mongosh

# Use your database
use jobs_placement

# Update your user to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Option C: Using Mongoose in Node.js

Create a temporary script `makeAdmin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('./models/user.model.js');

mongoose.connect('your-mongodb-connection-string')
  .then(async () => {
    const email = 'your-email@example.com';
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    console.log('User updated:', user);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

Run: `node makeAdmin.js`

---

## 💻 Step 2: Start Your Application

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

---

## 🌐 Step 3: Access Admin Panel

1. **Login** to your account at: `http://localhost:5173/login`
2. **Navigate** to admin panel: `http://localhost:5173/admin`
3. **Explore** the dashboard and management pages!

---

## 📊 Available Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with statistics |
| `/admin/users` | User management (CRUD) |
| `/admin/companies` | Company verification |
| `/admin/jobs` | Job monitoring |
| `/admin/analytics` | Platform analytics |

---

## 🔍 Troubleshooting

### Can't Access Admin Panel?

**Error: "Access Denied" or redirected to home**

✅ **Solution**: Check your user role in database
```bash
db.users.findOne({ email: "your-email@example.com" })
```
Make sure `role: "admin"`

---

### Admin Routes Not Working?

✅ **Solution**: Check server logs for errors
```bash
# In server terminal, you should see:
✓ Admin routes registered at /api/v1/admin
```

---

### Sidebar Not Showing?

✅ **Solution**: Check browser console for errors and ensure:
1. User is logged in
2. Redux store has user with `role: "admin"`
3. No JavaScript errors

---

## 🎯 Quick Test Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] User account has `role: "admin"` in database
- [ ] Can login successfully
- [ ] Can access `/admin` route
- [ ] Dashboard loads with statistics
- [ ] Can navigate between admin pages
- [ ] Can perform CRUD operations

---

## 📦 What's Included

### Pages
1. **Dashboard** - Real-time platform statistics
2. **User Management** - View, edit, delete users
3. **Company Management** - Verify/reject companies
4. **Job Management** - Monitor and delete jobs
5. **Analytics** - Growth trends and insights

### Features
- 🔍 Search and filtering
- 📄 Pagination
- ✏️ Inline editing
- 🗑️ Delete with confirmation
- 📊 Real-time statistics
- 📱 Mobile responsive
- 🔒 Role-based access control
- 🎨 Beautiful UI with Tailwind CSS

---

## 📧 Need Help?

If you encounter any issues:

1. Check the [main admin guide](./ADMIN_PANEL_GUIDE.md)
2. Review server logs for errors
3. Check browser console for frontend errors
4. Verify MongoDB connection
5. Ensure all dependencies are installed

---

## 🎉 You're All Set!

Your admin panel is ready to use. Just:
1. Make yourself an admin in the database
2. Login and visit `/admin`
3. Start managing your platform!

Enjoy your powerful admin panel! 🚀
