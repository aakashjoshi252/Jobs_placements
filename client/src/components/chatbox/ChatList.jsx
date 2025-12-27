import { useEffect, useState } from "react";
import { userApi, chatApi } from "../../../api/api";
import { useSelector } from "react-redux";
import { BiSearch, BiMessageSquareDetail } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";

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
                }
              } catch (msgError) {
                console.error("Error fetching messages:", msgError);
              }

              return {
                chat,
                otherUser,
                lastMessage,
                lastMessageTime,
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
      <div className="flex-shrink-0 px-6 py-4 bg-gradient-primary shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <BiMessageSquareDetail className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      {/* CHATS LIST - Scrollable */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden bg-neutral-50"
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-neutral-500 font-medium">
                Loading conversations...
              </p>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-4">
              <BiMessageSquareDetail className="text-neutral-400" size={32} />
            </div>
            <p className="text-neutral-500 font-medium">
              {searchQuery ? "No users found" : "No conversations yet"}
            </p>
            <p className="text-neutral-400 text-sm mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation to connect"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredChats.map((chatData, index) => {
              const { otherUser, lastMessage, lastMessageTime } = chatData;
              return (
                <div
                  key={chatData.chat._id || index}
                  onClick={() => handleSelectChat(chatData)}
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer bg-white hover:bg-primary-50 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                      {otherUser.username[0].toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-success-500 border-2 border-white rounded-full" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                        {otherUser.username}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-500 truncate flex-1 mr-2">
                        {lastMessage || "Click to start chatting"}
                      </p>
                      {lastMessageTime && (
                        <span className="text-xs text-neutral-400 font-medium flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMessageTime), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {otherUser.role === "Candidate" ? "Candidate" : "Recruiter"}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
