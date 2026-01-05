const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jobs_portal/profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
      },
    ],
    public_id: (req, file) => {
      // Generate unique filename with user ID
      const userId = req.user._id;
      return `user_${userId}_${Date.now()}`;
    },
  },
});

// Multer upload configuration for profile pictures
const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
        ),
        false
      );
    }
  },
});

module.exports = {
  cloudinary,
  uploadProfilePicture,
};