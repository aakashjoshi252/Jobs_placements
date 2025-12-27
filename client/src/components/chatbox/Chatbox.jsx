import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { chatApi } from "../../../api/api";
import { FiSend } from "react-icons/fi";
import { BiArrowBack, BiDotsVerticalRounded } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";

const ChatBox = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);

  const chatId = chat._id;
  const otherUser = chat.participants.find((p) => p._id !== user._id);

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
    });

    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStoppedTyping", () => setIsTyping(false));

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [chatId, socket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { chatId, userName: user.username });

    // Stop typing after 2 seconds of inactivity
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
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-neutral-50 to-primary-50/30 overflow-hidden">
      {/* HEADER - Fixed */}
      <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 bg-gradient-primary shadow-lg z-10">
        <button
          onClick={onBack}
          className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <BiArrowBack className="text-white" size={22} />
        </button>

        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {otherUser.username[0].toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-lg truncate">
            {otherUser.username}
          </p>
          <p className="text-xs text-white/80">
            {isTyping ? "typing..." : "Active now"}
          </p>
        </div>

        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <BiDotsVerticalRounded className="text-white" size={24} />
        </button>
      </div>

      {/* MESSAGES - Scrollable */}
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
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <FiSend className="text-primary-600" size={24} />
              </div>
              <p className="text-neutral-500 font-medium">
                No messages yet
              </p>
              <p className="text-neutral-400 text-sm">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, index) => {
              const isOwn =
                m.senderId === user._id || m.senderId?._id === user._id;
              const showTimestamp =
                index === 0 ||
                new Date(messages[index - 1].createdAt).getTime() -
                  new Date(m.createdAt).getTime() >
                  300000; // 5 minutes

              return (
                <div key={m._id || index} className="animate-fade-in">
                  {/* Timestamp Divider */}
                  {showTimestamp && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-neutral-500 bg-white px-3 py-1 rounded-full shadow-sm">
                        {formatDistanceToNow(new Date(m.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[60%]`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-md ${
                          isOwn
                            ? "bg-gradient-primary text-white rounded-br-none"
                            : "bg-white text-neutral-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {m.text}
                        </p>
                      </div>
                      <p
                        className={`text-xs text-neutral-400 mt-1 px-1 ${
                          isOwn ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* Typing Indicator - Fixed */}
      {isTyping && (
        <div className="flex-shrink-0 px-6 py-2 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <span className="truncate">{otherUser.username} is typing...</span>
          </div>
        </div>
      )}

      {/* INPUT - Fixed */}
      <form
        onSubmit={sendMessage}
        className="flex-shrink-0 flex items-end gap-3 px-4 sm:px-6 py-4 bg-white border-t border-neutral-200 shadow-lg"
      >
        <div className="flex-1 relative">
          <textarea
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
            className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
            style={{
              minHeight: "44px",
              maxHeight: "128px",
              overflowY: text.split('\n').length > 3 ? 'auto' : 'hidden',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="flex-shrink-0 p-3.5 bg-gradient-primary text-white rounded-2xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-scale"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;