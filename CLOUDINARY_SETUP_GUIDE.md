# Cloudinary Setup Guide - Quick Start 🚀

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- **Free CDN** for fast image delivery worldwide
- **Automatic optimization** - compresses images without quality loss
- **Image transformations** - resize, crop, format conversion
- **Face detection** - smart cropping focused on faces
- **No server storage needed** - saves your disk space

**Free Tier:**
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations/month
- Perfect for small to medium projects!

---

## 📋 Step-by-Step Setup (5 minutes)

### Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com/users/register/free)
2. Sign up for a **FREE account**
3. Verify your email
4. Login to your dashboard

---

### Step 2: Get Your Credentials

1. After logging in, you'll see your **Dashboard**
2. Find the **Account Details** section (top of page)
3. You'll see three important values:

```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
```

4. Click the **"Copy to clipboard"** icon for each value

---

### Step 3: Add to Your Environment Variables

1. Open `server/.env` file
2. Add these three lines:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

**Replace** with your actual values from Cloudinary dashboard!

---

### Step 4: Install Required Packages

```bash
cd server
npm install cloudinary multer multer-storage-cloudinary
```

---

### Step 5: Test the Setup

1. Start your server:
```bash
cd server
npm run dev
```

2. Test upload with Postman or cURL:

**Using Postman:**
```
POST http://localhost:5000/api/v1/user/profile-picture

Headers:
Cookie: token=YOUR_JWT_TOKEN

Body (form-data):
profilePicture: [Select an image file]
```

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/user/profile-picture \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -F "profilePicture=@/path/to/your/image.jpg"
```

3. Check Cloudinary dashboard to see your uploaded image!

---

## ✅ Verification Checklist

- [ ] Cloudinary account created
- [ ] Cloud Name, API Key, and API Secret copied
- [ ] Environment variables added to `server/.env`
- [ ] Packages installed (`cloudinary`, `multer`, `multer-storage-cloudinary`)
- [ ] Server restarted
- [ ] Test upload successful
- [ ] Image visible in Cloudinary dashboard

---

## 🔍 How to View Uploaded Images

1. Login to [Cloudinary Console](https://cloudinary.com/console)
2. Go to **Media Library** in the left sidebar
3. Navigate to `jobs_portal/profile_pictures/` folder
4. You'll see all uploaded profile pictures!

---

## 🎨 Image Transformations Applied

Your profile pictures are automatically:
- **Resized** to 500x500 pixels
- **Cropped** to center on the face (using AI)
- **Optimized** for web (smaller file size)
- **Converted** to the best format for browsers

Example URL:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/
c_fill,g_face,h_500,w_500,q_auto:good/
jobs_portal/profile_pictures/user_123_1234567890.jpg
```

---

## 🔄 Alternative: Local Storage (Without Cloudinary)

If you don't want to use Cloudinary, the system has a **fallback** to local storage:

1. Images saved to: `server/uploads/profile-pictures/`
2. Accessible at: `http://localhost:5000/uploads/profile-pictures/filename.jpg`
3. No Cloudinary credentials needed

**Note:** Local storage is NOT recommended for production!

---

## 🌍 Production Deployment

### Heroku
```bash
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

### Vercel/Netlify
Add environment variables in the dashboard:
```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Docker
Add to `docker-compose.yml`:
```yaml
environment:
  - CLOUDINARY_CLOUD_NAME=your_cloud_name
  - CLOUDINARY_API_KEY=your_api_key
  - CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🐛 Common Issues

### Issue 1: "Cloudinary credentials not found"
**Solution:**
- Check `.env` file has correct variable names
- Restart server after adding credentials
- Verify no spaces in variable names

### Issue 2: "Upload failed: Invalid API key"
**Solution:**
- Double-check API Key from Cloudinary dashboard
- Make sure you copied the entire key (no extra spaces)

### Issue 3: "Cannot find module 'cloudinary'"
**Solution:**
```bash
cd server
npm install cloudinary multer multer-storage-cloudinary
```

### Issue 4: Images not appearing in dashboard
**Solution:**
- Check folder name: `jobs_portal/profile_pictures`
- Verify upload was successful (check API response)
- Refresh Cloudinary Media Library page

---

## 📊 Monitor Your Usage

1. Login to Cloudinary
2. Go to **Dashboard**
3. See usage stats:
   - Storage used
   - Bandwidth used this month
   - Number of transformations

**Free tier limits:**
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month

---

## 🎯 Quick Test Script

Create `test-cloudinary.js` in `server/` directory:

```javascript
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test connection
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('❌ Cloudinary connection failed:', error);
  } else {
    console.log('✅ Cloudinary connected successfully!');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  }
});
```

Run test:
```bash
node server/test-cloudinary.js
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** to Git
2. **Keep API Secret private** - it's like a password
3. **Use environment variables** in production
4. **Enable signed URLs** for sensitive images (optional)
5. **Set upload presets** to restrict file types

---

## 💡 Advanced Features (Optional)

### 1. Automatic Format Conversion
Images automatically served as WebP for Chrome, JPEG for Safari, etc.

### 2. Lazy Loading
Use Cloudinary's lazy load feature:
```html
<img loading="lazy" src="cloudinary-url" />
```

### 3. Responsive Images
Different sizes for mobile/desktop:
```javascript
transformation: [
  { width: 500, crop: 'scale' },  // Desktop
  { width: 200, crop: 'scale' },  // Mobile
]
```

### 4. Video Support
Cloudinary also supports video uploads (not implemented yet)

---

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Guide](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Free Training](https://training.cloudinary.com/)

---

## ✨ What's Next?

After setting up Cloudinary:

1. ✅ Test profile picture upload
2. ✅ Update frontend to show profile pictures
3. ✅ Add profile pictures to all user displays
4. 🔄 Consider adding:
   - Company logos
   - Job post images
   - Resume thumbnails
   - Chat image sharing

---

## 🎉 You're All Set!

Your profile picture upload feature is now powered by Cloudinary!

**Benefits you get:**
- ⚡ Fast image delivery via CDN
- 🗜️ Automatic optimization
- 🎨 Smart cropping
- 💾 No local storage needed
- 🌍 Global availability

---

**Need Help?**
- Check [Cloudinary Support](https://support.cloudinary.com)
- Read [PROFILE_PICTURE_FEATURE_GUIDE.md](./PROFILE_PICTURE_FEATURE_GUIDE.md) for API details

**Happy Coding! 🚀**