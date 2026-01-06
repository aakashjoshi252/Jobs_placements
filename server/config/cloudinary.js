const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
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

// Cloudinary storage for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jobs_portal/profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      {
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto:good',
      },
    ],
    public_id: (req, file) => {
      // Generate unique filename with user ID
      const userId = req.user?._id || 'unknown';
      return `user_${userId}_${Date.now()}`;
    },
  },
});

// Cloudinary storage for company logos
const companyLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jobs_portal/company_logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: 'limit',
        quality: 'auto:good',
      },
    ],
    public_id: (req, file) => {
      const companyId = req.params.id || req.body.companyId || 'temp';
      return `company_${companyId}_${Date.now()}`;
    },
  },
});

// Cloudinary storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jobs_portal/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // For non-image files
    public_id: (req, file) => {
      const userId = req.user?._id || 'unknown';
      return `resume_${userId}_${Date.now()}`;
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

// Multer upload configuration for company logos
const uploadCompanyLogo = multer({
  storage: companyLogoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
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
      cb(
        new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG images are allowed.'),
        false
      );
    }
  },
});

// Multer upload configuration for resumes
const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
  },
});

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

// Upload buffer to Cloudinary (for direct uploads without multer)
const uploadBufferToCloudinary = (buffer, folder = 'jobs_portal/misc') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary upload error: ${error.message}`);
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadProfilePicture,
  uploadCompanyLogo,
  uploadResume,
  deleteFromCloudinary,
  uploadBufferToCloudinary,
};
