const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'hr'],
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    location: {
      type: String, // physical location or video link
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'],
      default: 'scheduled',
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: String,
      strengths: [String],
      weaknesses: [String],
      recommendation: {
        type: String,
        enum: ['strong-hire', 'hire', 'maybe', 'no-hire'],
      },
    },
    reminder: {
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ recruiter: 1, scheduledAt: 1 });
interviewSchema.index({ candidate: 1, status: 1 });
interviewSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
