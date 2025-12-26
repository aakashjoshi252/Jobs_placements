const Chat = require("../models/chatbox.model.js");
const Message = require("../models/message.model.js");

// Create or get existing chat between two users
exports.createOrGetChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user?._id || req.body.currentUserId;

    if (!participantId || !currentUserId) {
      return res.status(400).json({
        success: false,
        message: "Both user IDs are required",
      });
    }

    // Check if chat already exists between these users
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, participantId] },
    }).populate("participants", "username email role");

    // If no chat exists, create new one
    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, participantId],
      });
      chat = await chat.populate("participants", "username email role");
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Create/Get chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create or get chat",
      error: error.message,
    });
  }
};

// Get all chats for the current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "username email role")
      .populate("jobId", "title company")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
      count: chats.length,
    });
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user chats",
      error: error.message,
    });
  }
};

// Get a specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("participants", "username email role")
      .populate("jobId", "title company");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get chat by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message,
    });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Delete all messages in the chat
    await Message.deleteMany({ chatId });

    // Delete the chat
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat and all messages deleted successfully",
    });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};
