import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { chatApi } from "../../../api/api";
import { formatDistanceToNow } from "date-fns";
import {
  HiArrowLeft,
  HiDotsVertical,
  HiPaperAirplane,
  HiEmojiHappy,
  HiPaperClip,
  HiCheckCircle,
  HiCheck,
  HiUserCircle
} from "react-icons/hi";

const ChatBox = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);

  const chatId = chat._id;
  const otherUser = chat.participants.find((p) => p._id !== user._id);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Track window focus for smart notifications
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Show browser notification
  const showNotification = (message) => {
    // Only show notification if window is not focused
    if (!isWindowFocused && Notification.permission === "granted") {
      const notification = new Notification(`💬 ${otherUser.username}`, {
        body: message.text,
        icon: "/chat-icon.png",
        badge: "/badge-icon.png",
        tag: chatId,
        requireInteraction: false,
        silent: false,
      });

      // Play notification sound
      playNotificationSound();

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      // Click notification to open chat
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch((err) => console.log("Audio play failed:", err));
    } catch (error) {
      console.log("Notification sound error:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await chatApi.get(`/chat/${chatId}/messages`, {
          withCredentials: true,
        });
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      
      // Show notification if message is from other user
      const isOwnMessage = msg.senderId === user._id || msg.senderId?._id === user._id;
      if (!isOwnMessage) {
        showNotification(msg);
      }
    });

    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStoppedTyping", () => setIsTyping(false));

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [chatId, socket, isWindowFocused]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { chatId, userName: user.username });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { chatId });
    }, 2000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: user._id,
      text,
    });

    setText("");
    socket.emit("stopTyping", { chatId });
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* HEADER - Sticky at top */}
      <div className="sticky top-0 z-20 flex-shrink-0 flex items-center gap-4 px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <button
          onClick={onBack}
          className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <HiArrowLeft className="text-white text-xl" />
        </button>

        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-lg shadow-md">
            {otherUser.username[0].toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-lg truncate">
            {otherUser.username}
          </p>
          <p className="text-xs text-blue-100">
            {isTyping ? (
              <span className="flex items-center gap-1">
                <span className="animate-pulse">typing</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-blue-100 rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-blue-100 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-1 h-1 bg-blue-100 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </span>
              </span>
            ) : (
              "Active now"
            )}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <HiDotsVertical className="text-white text-xl" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                  View Profile
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                  Search in Chat
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                  Mute Notifications
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-red-600">
                  Delete Chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MESSAGES - Scrollable area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4"
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <HiPaperAirplane className="text-blue-600 text-2xl" />
              </div>
              <p className="text-gray-600 font-medium">
                No messages yet
              </p>
              <p className="text-gray-500 text-sm">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, index) => {
              const isOwn = m.senderId === user._id || m.senderId?._id === user._id;
              const showTimestamp =
                index === 0 ||
                new Date(m.createdAt).getTime() -
                  new Date(messages[index - 1].createdAt).getTime() >
                  300000;

              return (
                <div key={m._id || index}>
                  {showTimestamp && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                        {formatDistanceToNow(new Date(m.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%]`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-md ${isOwn
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm"
                          }`}
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {m.text}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                        <p className="text-xs text-gray-500">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {isOwn && (
                          <HiCheckCircle className="text-blue-600 text-sm" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex-shrink-0 px-4 sm:px-6 py-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <span className="truncate">{otherUser.username} is typing...</span>
          </div>
        </div>
      )}

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="flex-shrink-0 flex items-end gap-3 px-4 sm:px-6 py-4 bg-white border-t border-gray-200 shadow-lg"
      >
        <button
          type="button"
          className="flex-shrink-0 p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Attach file"
        >
          <HiPaperClip className="text-xl" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type your message..."
            rows={1}
            className="w-full px-4 py-3 pr-10 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            style={{
              minHeight: "44px",
              maxHeight: "120px",
              overflowY: "auto",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Add emoji"
          >
            <HiEmojiHappy className="text-xl" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="flex-shrink-0 p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Send message"
        >
          <HiPaperAirplane className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;