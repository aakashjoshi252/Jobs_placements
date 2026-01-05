const cloudinary = require("../config/cloudinary").cloudinary;
const fs = require("fs");
const path = require("path");

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @param {object} options - Additional Cloudinary options
 * @returns {Promise<object>} - Upload result with URL and public_id
 */
const uploadToCloudinary = async (filePath, folder = "jobs_portal", options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
      ...options,
    });

    // Delete local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    // Clean up local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

/**
 * Upload profile picture with optimizations
 * @param {string} filePath - Local file path
 * @param {string} userId - User ID for unique naming
 * @returns {Promise<object>} - Upload result
 */
const uploadProfilePicture = async (filePath, userId) => {
  return uploadToCloudinary(filePath, "jobs_portal/profile_pictures", {
    public_id: `user_${userId}_${Date.now()}`,
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
      },
    ],
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadProfilePicture,
};