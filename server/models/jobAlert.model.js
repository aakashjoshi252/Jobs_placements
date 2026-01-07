const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    keywords: [{
      type: String,
      maxlength: 50,
    }],
    location: {
      type: String,
      maxlength: 100,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    },
    experience: {
      type: String,
      enum: ['Entry Level', '1-3 years', '3-5 years', '5+ years'],
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSent: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

jobAlertSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('JobAlert', jobAlertSchema);
