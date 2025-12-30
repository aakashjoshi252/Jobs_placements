const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Blog description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['event', 'achievement', 'growth', 'culture', 'news'],
      default: 'news'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required']
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required']
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
blogSchema.index({ companyId: 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);