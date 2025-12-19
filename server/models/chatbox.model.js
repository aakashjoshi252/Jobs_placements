// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    lastMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
