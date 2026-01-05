# Profile Picture Upload Feature - Complete Guide 📸

## Overview

This guide covers the complete implementation of profile picture upload functionality for your Jobs Portal application, including backend endpoints, frontend integration, and best practices.

---

## 🎯 Features Implemented

### Backend Features
- ✅ Profile picture upload to Cloudinary
- ✅ Automatic image optimization (500x500, face-focused)
- ✅ Update/replace existing profile pictures
- ✅ Delete profile pictures
- ✅ Auto-generated avatar fallback with user initials
- ✅ Secure file validation (type, size)
- ✅ Clean up of old images when updating

### File Formats Supported
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limit
- Maximum: 5MB per upload

---

## 📋 API Endpoints

### 1. Upload Profile Picture

**Endpoint:** `POST /api/v1/user/profile-picture`

**Authentication:** Required (JWT Token)

**Request Type:** `multipart/form-data`

**Form Data:**
```
profilePicture: <file>
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/v1/user/profile-picture \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -F "profilePicture=@/path/to/image.jpg"
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "profilePicture": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/jobs_portal/profile_pictures/user_123_1234567890.jpg",
    "avatarUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/jobs_portal/profile_pictures/user_123_1234567890.jpg"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

### 2. Delete Profile Picture

**Endpoint:** `DELETE /api/v1/user/profile-picture`

**Authentication:** Required

**Example (cURL):**
```bash
curl -X DELETE http://localhost:5000/api/v1/user/profile-picture \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile picture deleted successfully",
  "data": {
    "avatarUrl": "https://ui-avatars.com/api/?name=JD&background=random&size=200"
  }
}
```

---

### 3. Get User Profile Picture

**Endpoint:** `GET /api/v1/user/:id/profile-picture`

**Authentication:** Not required

**Example:**
```bash
curl http://localhost:5000/api/v1/user/USER_ID/profile-picture
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "John Doe",
    "profilePicture": "https://res.cloudinary.com/.../user_123.jpg",
    "avatarUrl": "https://res.cloudinary.com/.../user_123.jpg"
  }
}
```

---

## 🔧 Backend Implementation Details

### Updated User Model

```javascript
// server/models/user.model.js
const usersSchema = new mongoose.Schema({
  // ... existing fields
  profilePicture: {
    type: String,
    default: null,
  },
  profilePicturePublicId: {
    type: String,
    default: null,
  },
});

// Virtual field for avatar fallback
usersSchema.virtual("avatarUrl").get(function () {
  if (this.profilePicture) {
    return this.profilePicture;
  }
  const initials = this.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=random&size=200`;
});
```

### Image Storage Options

**Option 1: Cloudinary (Recommended for Production)**
- Automatic CDN delivery
- Image transformations
- No local storage needed

**Option 2: Local Storage (Development/Testing)**
- Files stored in `server/uploads/profile-pictures/`
- Requires serving static files

---

## 🌐 Frontend Implementation

### React Component Example

```jsx
import { useState } from 'react';
import { userApi } from '../api/api';

const ProfilePictureUpload = ({ currentUser, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUser.profilePicture || currentUser.avatarUrl);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    await uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await userApi.post('/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPreview(response.data.data.profilePicture);
        onUpdate(response.data.data);
        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const deleteProfilePicture = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    try {
      setUploading(true);
      const response = await userApi.delete('/profile-picture');

      if (response.data.success) {
        setPreview(response.data.data.avatarUrl);
        onUpdate({ profilePicture: null });
        alert('Profile picture deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="avatar-container">
        <img 
          src={preview} 
          alt={currentUser.username}
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>

      <div className="upload-controls mt-4">
        <label className="btn btn-primary cursor-pointer">
          {uploading ? 'Uploading...' : 'Change Photo'}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {currentUser.profilePicture && (
          <button
            onClick={deleteProfilePicture}
            disabled={uploading}
            className="btn btn-danger ml-2"
          >
            Delete Photo
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
```

---

## 📍 Where Profile Pictures Are Displayed

### 1. User Profile Page
- Main profile view
- Edit profile section

### 2. Navigation Bar
- User dropdown menu
- Avatar in header

### 3. Job Applications
- Candidate profile in application list
- Application detail view

### 4. Chat/Messaging
- User avatars in chat list
- Message sender avatars

### 5. Comments & Reviews
- User avatar next to comments
- Review author display

### 6. Job Listings
- Recruiter profile picture
- Company representative

### 7. Dashboard
- User profile widget
- Recent activity feed

---

## 🛠️ Setup Requirements

### 1. Install Dependencies

```bash
cd server
npm install cloudinary multer multer-storage-cloudinary
```

### 2. Environment Variables

Add to `server/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env` file

---

## 🧪 Testing

### Test with Postman

**1. Upload Profile Picture**
```
POST http://localhost:5000/api/v1/user/profile-picture

Headers:
Cookie: token=YOUR_JWT_TOKEN

Body (form-data):
profilePicture: [Select File]
```

**2. Get User with Profile Picture**
```
GET http://localhost:5000/api/v1/user/me

Headers:
Cookie: token=YOUR_JWT_TOKEN
```

**3. Delete Profile Picture**
```
DELETE http://localhost:5000/api/v1/user/profile-picture

Headers:
Cookie: token=YOUR_JWT_TOKEN
```

---

## 🔒 Security Features

1. **File Type Validation**
   - Only allows JPEG, PNG, WebP
   - Validates MIME type

2. **File Size Limit**
   - Maximum 5MB per upload

3. **Authentication Required**
   - Only authenticated users can upload
   - Users can only modify their own pictures

4. **Automatic Cleanup**
   - Old images deleted when updating
   - Cloudinary handles CDN and backups

---

## 🎨 Avatar Fallback

If no profile picture is uploaded, the system automatically generates an avatar with:
- User's initials (first 2 letters)
- Random background color
- 200x200 size
- Generated via [ui-avatars.com](https://ui-avatars.com)

Example: `https://ui-avatars.com/api/?name=JD&background=random&size=200`

---

## 📊 Image Transformations (Cloudinary)

```javascript
transformation: [
  {
    width: 500,
    height: 500,
    crop: "fill",
    gravity: "face",  // Focus on face detection
    quality: "auto:good",
  },
]
```

**Benefits:**
- Consistent 500x500 size
- Face-centered cropping
- Optimized file size
- Fast CDN delivery

---

## 🚀 Deployment Considerations

### Production Checklist

- [ ] Set up Cloudinary account
- [ ] Add environment variables to hosting platform
- [ ] Test image uploads in production
- [ ] Verify HTTPS for secure uploads
- [ ] Set up CDN caching rules
- [ ] Monitor Cloudinary usage/quota

### Cloudinary Free Tier
- 25 GB storage
- 25 GB bandwidth/month
- Sufficient for small to medium projects

---

## 📱 Mobile Support

```jsx
// Accept camera input on mobile
<input
  type="file"
  accept="image/*"
  capture="user"  // Front camera
  onChange={handleFileChange}
/>
```

---

## 🐛 Troubleshooting

### Issue: "No file uploaded"
**Solution:** Ensure `Content-Type: multipart/form-data` header is set

### Issue: "File size too large"
**Solution:** Compress image before upload or increase limit

### Issue: "Cloudinary upload failed"
**Solution:** 
- Check environment variables
- Verify API credentials
- Check Cloudinary quota

### Issue: Images not displaying
**Solution:**
- Check CORS settings
- Verify image URL is accessible
- Check browser console for errors

---

## 📝 Summary

✅ **Backend:** Complete profile picture upload system with Cloudinary
✅ **Frontend:** React component for upload/delete
✅ **Security:** File validation and authentication
✅ **Fallback:** Auto-generated avatars
✅ **Optimization:** Automatic image transformations

**Status:** Ready for production! 🎉

---

**Last Updated:** January 5, 2026  
**Version:** 1.0.0