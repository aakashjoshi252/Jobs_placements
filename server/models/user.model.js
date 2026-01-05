const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      required: true,
      default: "candidate",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    // Profile Picture Fields
    profilePicture: {
      type: String,
      default: null, // URL of the profile picture
    },
    profilePicturePublicId: {
      type: String,
      default: null, // Cloudinary public ID for deletion
    },
    // Additional profile fields (optional)
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false }
);

// Virtual field for avatar URL (fallback when no profile picture)
usersSchema.virtual("avatarUrl").get(function () {
  if (this.profilePicture) {
    return this.profilePicture;
  }
  // Generate avatar with user initials
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

// Ensure virtuals are included when converting to JSON
usersSchema.set("toJSON", { virtuals: true });
usersSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", usersSchema);
module.exports = User;