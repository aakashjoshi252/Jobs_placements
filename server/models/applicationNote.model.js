const mongoose = require('mongoose');

const applicationNoteSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    isPrivate: {
      type: Boolean,
      default: true, // visible to recruiters only
    },
    tags: [{
      type: String,
      maxlength: 50,
    }],
  },
  {
    timestamps: true,
  }
);

applicationNoteSchema.index({ application: 1, createdAt: -1 });

module.exports = mongoose.model('ApplicationNote', applicationNoteSchema);
