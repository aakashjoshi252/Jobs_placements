const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Job" 
    },
    lastMessage: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

// Check if model already exists before creating
module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
