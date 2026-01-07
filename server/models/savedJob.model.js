const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    tags: [{
      type: String,
      maxlength: 50,
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate saves
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

// Index for faster queries
savedJobSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SavedJob', savedJobSchema);
