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
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);

  if (!chat || !user) return null;

  const otherUser = chat.participants?.find((p) => p._id !== user._id);
  const chatId = chat._id;

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (!chatId || !socket) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await chatApi.get(`/chat/${chatId}/messages`, {
          withCredentials: true,
        });

        console.log("Messages fetched:", res.data);
        setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join chat room
    socket.emit("joinChat", chatId);
    console.log("Joined chat:", chatId);

    // Listen for new messages
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = () => setIsTyping(true);
    const handleUserStoppedTyping = () => setIsTyping(false);

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    // Cleanup
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.emit("leaveChat", chatId);
    };
  }, [chatId, socket]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    console.log("Sending message:", { chatId, senderId: user._id, text: newMessage });

    socket.emit("sendMessage", {
      chatId,
      senderId: user._id,
      text: newMessage.trim(),
    });

    setNewMessage("");
    socket.emit("stopTyping", { chatId });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    socket.emit("typing", { chatId, userName: user.username });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId });
    }, 1000);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-blue-600 text-white">
        <button onClick={onBack} className="lg:hidden hover:bg-blue-700 p-1 rounded">
          <BiArrowBack size={22} />
        </button>

        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold">
          {otherUser?.username?.charAt(0)?.toUpperCase() || otherUser?.email?.charAt(0)?.toUpperCase()}
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
        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId?._id === user._id || msg.senderId === user._id;

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
                  <p className="break-words">{msg.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <p className="text-sm text-gray-500 italic">
            {otherUser?.username || otherUser?.email} is typing...
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
            disabled={!socket}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !socket}
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
