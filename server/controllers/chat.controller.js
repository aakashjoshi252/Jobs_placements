const Chat = require("../models/chatbox.model.js");
const Message = require("../models/message.model.js");

// Create or get existing chat
exports.createChat = async (req, res) => {
  try {
    const { candidateId, recruiterId, jobId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [candidateId, recruiterId] },
      jobId,
    }).populate("participants", "name email role");

    if (!chat) {
      chat = await Chat.create({
        participants: [candidateId, recruiterId],
        jobId,
      });
      chat = await chat.populate("participants", "name email role");
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name email role")
      .populate("jobId", "title company")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.find({ chatId })
      .populate("senderId", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a message (called via Socket.io)
exports.sendMessage = async (messageData) => {
  try {
    const message = await Message.create(messageData);
    
    // Update lastMessage in chat
    await Chat.findByIdAndUpdate(messageData.chatId, {
      lastMessage: messageData.text,
      updatedAt: Date.now(),
    });

    return await message.populate("senderId", "name email");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
