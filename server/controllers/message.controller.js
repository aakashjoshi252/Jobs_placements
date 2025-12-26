const Message = require("../models/message.model.js");
const Chat = require("../models/chatbox.model.js");

// Get all messages for a specific chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "username email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Create a new message (used by socket.io)
exports.createMessage = async (messageData) => {
  try {
    const { chatId, senderId, text } = messageData;

    // Validate required fields
    if (!chatId || !senderId || !text) {
      const missingFields = [];
      if (!chatId) missingFields.push("chatId");
      if (!senderId) missingFields.push("senderId");
      if (!text) missingFields.push("text");
      
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate text is not empty after trim
    if (text.trim() === "") {
      throw new Error("Message text cannot be empty");
    }

    console.log("Creating message with:", { chatId, senderId, text: text.substring(0, 50) });

    // Create message
    const message = await Message.create({
      chatId,
      senderId,
      text: text.trim(),
    });

    console.log("Message created:", message._id);

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text.trim().substring(0, 100),
    });

    // Populate sender info before returning
    await message.populate("senderId", "username email role");

    return message;
  } catch (error) {
    console.error("Create message error:", error);
    throw error;
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
      error: error.message,
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};
