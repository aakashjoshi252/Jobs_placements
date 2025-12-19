import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import axios from "axios";
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

  const otherUser = chat.participants.find((p) => p._id !== user._id);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/${chat._id}/messages`,
          { withCredentials: true }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Join chat room
    socket?.emit("joinChat", chat._id);

    // Listen for new messages
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
  }, [chat._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket?.emit("sendMessage", {
      chatId: chat._id,
      senderId: user._id,
      text: newMessage,
    });

    setNewMessage("");
    socket?.emit("stopTyping", { chatId: chat._id });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    socket.emit("typing", { chatId: chat._id, userName: user.name });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: chat._id });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <button onClick={onBack} className="lg:hidden">
          <BiArrowBack size={24} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold">
          {otherUser?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold">{otherUser?.name}</h3>
          <p className="text-sm text-blue-100">{otherUser?.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isOwn = msg.senderId._id === user._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow"
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
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
          <div className="flex gap-1 items-center text-gray-500 text-sm">
            <span>{otherUser?.name} is typing</span>
            <div className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white rounded-b-lg">
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
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
