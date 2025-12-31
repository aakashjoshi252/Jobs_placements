import { useEffect, useState } from "react";
import { userApi, chatApi } from "../../api/api";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  HiSearch,
  HiChatAlt2,
  HiChevronRight,
  HiUserCircle,
  HiBadgeCheck,
  HiClock
} from "react-icons/hi";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchChatsWithMessages = async () => {
      try {
        setLoading(true);
        // Get all users first
        const usersRes = await userApi.get("/data", { withCredentials: true });
        const allUsers = usersRes.data.data.filter((u) => u._id !== user?._id);

        // For each user, try to get or create chat and fetch messages
        const chatsWithData = await Promise.all(
          allUsers.map(async (otherUser) => {
            try {
              // Create or get chat
              const chatRes = await chatApi.post(
                "/create",
                { participantId: otherUser._id, currentUserId: user._id },
                { withCredentials: true }
              );

              const chat = chatRes.data.chat;

              // Fetch messages for this chat
              let lastMessage = null;
              let lastMessageTime = null;
              let unreadCount = 0;
              try {
                const messagesRes = await chatApi.get(
                  `/chat/${chat._id}/messages`,
                  { withCredentials: true }
                );
                const messages = messagesRes.data.messages || [];
                if (messages.length > 0) {
                  const last = messages[messages.length - 1];
                  lastMessage = last.text;
                  lastMessageTime = last.createdAt;
                  // Count unread messages (you'd need to implement isRead field in backend)
                  unreadCount = messages.filter(m => m.senderId !== user._id && !m.isRead).length;
                }
              } catch (msgError) {
                console.error("Error fetching messages:", msgError);
              }

              return {
                chat,
                otherUser,
                lastMessage,
                lastMessageTime,
                unreadCount
              };
            } catch (error) {
              console.error("Error fetching chat:", error);
              return null;
            }
          })
        );

        // Filter out nulls and sort by last message time
        const validChats = chatsWithData
          .filter((c) => c !== null)
          .sort((a, b) => {
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return (
              new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
            );
          });

        setChats(validChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchChatsWithMessages();
    }
  }, [user]);

  const handleSelectChat = (chatData) => {
    onSelectChat(chatData.chat);
  };

  const filteredChats = chats.filter((c) =>
    c.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* HEADER - Fixed */}
      <div className="flex-shrink-0 px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <HiChatAlt2 className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <p className="text-blue-100 text-sm">{chats.length} conversations</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-0 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* CHATS LIST - Scrollable */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50"
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">
                Loading conversations...
              </p>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <HiChatAlt2 className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchQuery ? "No users found" : "No conversations yet"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation to connect"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chatData, index) => {
              const { otherUser, lastMessage, lastMessageTime, unreadCount } = chatData;
              return (
                <div
                  key={chatData.chat._id || index}
                  onClick={() => handleSelectChat(chatData)}
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer bg-white hover:bg-blue-50 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                      {otherUser.username[0].toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {otherUser.username}
                        </p>
                        {otherUser.verified && (
                          <HiBadgeCheck className="text-blue-600 text-lg flex-shrink-0" />
                        )}
                      </div>
                      {lastMessageTime && (
                        <span className="text-xs text-gray-500 font-medium flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(lastMessageTime), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                        {lastMessage || "Click to start chatting"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-bold flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        otherUser.role === "Candidate" 
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {otherUser.role === "Candidate" ? "Candidate" : "Recruiter"}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiChevronRight className="text-blue-600 text-xl" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;