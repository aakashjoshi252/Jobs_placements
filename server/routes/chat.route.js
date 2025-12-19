// routes/chat.routes.js
import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

const router = express.Router();

/* Create / Get chat */
router.post("/create", async (req, res) => {
  const { candidateId, recruiterId, jobId } = req.body;

  let chat = await Chat.findOne({
    participants: { $all: [candidateId, recruiterId] },
    jobId,
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [candidateId, recruiterId],
      jobId,
    });
  }

  res.json(chat);
});

/* Get messages */
router.get("/:chatId/messages", async (req, res) => {
  const messages = await Message.find({ chatId: req.params.chatId });
  res.json(messages);
});

export default router;
