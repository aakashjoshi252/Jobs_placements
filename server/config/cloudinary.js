const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify Cloudinary configuration
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  logger.warn('⚠️  Cloudinary credentials not configured. Image uploads will fail.');
  logger.warn('   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
}

// Use memory storage (no multer-storage-cloudinary needed)
const storage = multer.memoryStorage();

// Multer upload configuration for profile pictures
const uploadProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'),
        false
      );
    }
  },
});

// Multer configuration for company logos
const uploadCompanyLogo = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for logo.'), false);
    }
  },
});

// Multer configuration for blog images
const uploadBlogImage = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for blog images
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'),
        false
      );
    }
  },
});

// Multer configuration for resumes
const uploadResume = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX allowed.'), false);
    }
  },
});

// Helper: Upload buffer to Cloudinary
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

    const { Readable } = require('stream');
    const bufferStream = Readable.from(buffer);
    bufferStream.pipe(uploadStream);
  });
};

// Upload blog image with optimizations
const uploadBlogImageToCloudinary = async (buffer, fileName) => {
  try {
    const result = await uploadToCloudinary(buffer, {
      folder: 'jobs_portal/blogs',
      public_id: `blog_${Date.now()}_${fileName.split('.')[0]}`,
      transformation: [
        { width: 1200, height: 630, crop: 'limit' }, // Max dimensions
        { quality: 'auto:good' }, // Auto quality
        { fetch_format: 'auto' }, // Auto format (WebP if supported)
      ],
    });
    return result;
  } catch (error) {
    logger.error(`Blog image upload failed: ${error.message}`);
    throw error;
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted image from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Error deleting from Cloudinary: ${error.message}`);
    throw error;
  }
};

// Verify exports before exporting
if (!uploadBlogImage) {
  console.error('❌ CRITICAL: uploadBlogImage is undefined before export!');
}

// Export everything
module.exports = {
  cloudinary,
  uploadProfilePicture,
  uploadCompanyLogo,
  uploadBlogImage,
  uploadResume,
  uploadToCloudinary,
  uploadBlogImageToCloudinary,
  deleteFromCloudinary,
};

// Debug log
console.log('✅ Cloudinary config loaded. Exports:', {
  cloudinary: !!cloudinary,
  uploadProfilePicture: !!uploadProfilePicture,
  uploadCompanyLogo: !!uploadCompanyLogo,
  uploadBlogImage: !!uploadBlogImage,
  uploadResume: !!uploadResume,
});
