import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { chatApi } from "../../../api/api";
import { FiSend } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";

const ChatBox = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);

  if (!chat || !user) return null;

  /* ---------------- CHAT INFO ---------------- */

  const otherUser = chat.participants?.find(
    (p) => p._id !== user._id
  );

  const chatId = chat._id;

  /* ---------------- FETCH MESSAGES ---------------- */

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await chatApi.get(
          `/chat/${chatId}/messages`,
          { withCredentials: true }
        );

        console.log("Messages API:", res.data);

        setMessages(
          Array.isArray(res.data.messages)
            ? res.data.messages
            : []
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket?.emit("joinChat", chatId);

    socket?.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket?.on("userTyping", () => setIsTyping(true));
    socket?.on("userStoppedTyping", () => setIsTyping(false));

    return () => {
      socket?.off("receiveMessage");
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
    };
  }, [chatId, socket]);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket?.emit("sendMessage", {
      chatId,
      senderId: user._id,
      text: newMessage,
    });

    setNewMessage("");
    socket?.emit("stopTyping", { chatId });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    socket?.emit("typing", { chatId });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", { chatId });
    }, 1000);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-blue-600 text-white">
        <button onClick={onBack} className="lg:hidden">
          <BiArrowBack size={22} />
        </button>

        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold">
          {otherUser?.email?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">
            {otherUser?.username || otherUser?.email}
          </h3>
          <p className="text-sm capitalize">{otherUser?.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isOwn = msg.senderId?._id === user._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-md ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <p className="text-sm text-gray-500">
            {otherUser?.email} is typing...
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-full"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
