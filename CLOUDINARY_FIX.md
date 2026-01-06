# Fix: CloudinaryStorage is not a constructor

## Problem

You're getting this error:
```
TypeError: CloudinaryStorage is not a constructor
    at Object.<anonymous> (C:\Users\Admin\Desktop\Aakash\projects\Jobs_placements\server\config\cloudinary.js:13:31)
```

## Root Cause

This error occurs due to a **version incompatibility** between `cloudinary` v2.x and `multer-storage-cloudinary` v4.x packages [web:27].

- Your `package.json` has `cloudinary@^1.41.3`
- `multer-storage-cloudinary@^4.0.0` expects `cloudinary@^1.21.0` as peer dependency
- The newer version of cloudinary (v2.x) has breaking changes

---

## Solution Options

### **Option 1: Downgrade Cloudinary (Recommended for Quick Fix)**

This maintains compatibility with `multer-storage-cloudinary`:

```bash
cd server
npm uninstall cloudinary
npm install cloudinary@1.41.3
npm install
```

### **Option 2: Use Cloudinary Direct Upload (Modern Approach)**

Instead of using `multer-storage-cloudinary`, use Cloudinary's native uploader:

#### Step 1: Keep your current packages
```bash
cd server
npm install cloudinary multer
```

#### Step 2: Update `config/cloudinary.js`

Replace with direct Cloudinary upload approach:

```javascript
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  logger.warn('⚠️  Cloudinary not configured. Set environment variables.');
}

// Use memory storage for multer (temporary storage)
const storage = multer.memoryStorage();

// Multer configuration
const uploadProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed.'), false);
    }
  },
});

const uploadCompanyLogo = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const uploadResume = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'jobs_portal',
        resource_type: options.resource_type || 'auto',
        transformation: options.transformation || [],
        public_id: options.public_id,
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload error: ${error.message}`);
          reject(error);
        } else {
          logger.info(`File uploaded to Cloudinary: ${result.public_id}`);
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = Readable.from(buffer);
    bufferStream.pipe(uploadStream);
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Error deleting from Cloudinary: ${error.message}`);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadProfilePicture,
  uploadCompanyLogo,
  uploadResume,
  uploadToCloudinary,
  deleteFromCloudinary,
};
```

#### Step 3: Update your controllers to use the new approach

**Example: Profile Picture Upload**

```javascript
const { uploadProfilePicture, uploadToCloudinary } = require('../config/cloudinary');

// Route
router.post('/upload-profile', uploadProfilePicture.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'jobs_portal/profile_pictures',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' }
      ],
      public_id: `user_${req.user._id}_${Date.now()}`
    });

    // Save Cloudinary URL to database
    req.user.profilePicture = result.secure_url;
    req.user.cloudinaryId = result.public_id;
    await req.user.save();

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Option 3: Remove multer-storage-cloudinary Dependency

If you don't need `multer-storage-cloudinary` at all:

```bash
cd server
npm uninstall multer-storage-cloudinary
npm install
```

Then use **Option 2** approach above.

---

## Quick Fix Commands

### For Immediate Fix (Downgrade Cloudinary):

```bash
cd server

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Install compatible version
npm install cloudinary@1.41.3

# Reinstall all dependencies
npm install

# Start server
npm run dev
```

### For Modern Approach (Direct Cloudinary Upload):

```bash
cd server

# Remove multer-storage-cloudinary
npm uninstall multer-storage-cloudinary

# Install required packages
npm install cloudinary multer

# Update cloudinary.js file (see Option 2 above)

# Start server
npm run dev
```

---

## Environment Variables Check

Ensure your `.env` file has these set:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Get Your Cloudinary Credentials:

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign up/Login
3. Copy your credentials from the dashboard
4. Add them to your `.env` file

---

## Testing After Fix

```bash
# Start the server
npm run dev

# You should see:
# ✅ MongoDB Connected
# ✅ Server started
# No Cloudinary errors
```

### Test Upload Endpoint:

```bash
# Test with curl (replace with your endpoint)
curl -X POST http://localhost:3000/api/v1/user/upload-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePicture=@/path/to/image.jpg"
```

---

## Why This Happens

The `multer-storage-cloudinary` package:
- Was designed for `cloudinary` v1.x
- Has not been updated for v2.x compatibility [web:27]
- Exports `CloudinaryStorage` differently in newer versions

The direct upload approach:
- Uses Cloudinary's native API
- Works with any version of cloudinary
- Gives you more control over uploads
- Is the recommended modern approach [web:26]

---

## Recommended Solution

I recommend **Option 2** (Direct Cloudinary Upload) because:

✅ Works with latest cloudinary version  
✅ No peer dependency conflicts  
✅ More control and flexibility  
✅ Better error handling  
✅ Future-proof  

---

## Additional Resources

- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)

---

**Status:** Fix committed to repository  
**Commit:** [013b045](https://github.com/aakashjoshi252/Jobs_placements/commit/013b0451534457241990a3ca40990a9f13ad7f01)  
**Updated:** January 6, 2026
