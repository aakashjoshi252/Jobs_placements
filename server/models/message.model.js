const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Chat", 
      required: true 
    },
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    text: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Check if model already exists before creating
module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);
