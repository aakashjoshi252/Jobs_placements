import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chatApi } from "../../../api/api";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default function ChatBox({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [chatId]);

  useEffect(() => {
    chatApi.get(`/${chatId}/messages`).then((res) => {
      setMessages(res.data);
    });
  }, [chatId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      chatId,
      senderId: userId,
      text,
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs ${
              m.senderId === userId
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-3 flex gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg p-2"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
