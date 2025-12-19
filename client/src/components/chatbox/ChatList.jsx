import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/user/${user._id}`,
          { withCredentials: true }
        );
        setChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (user?._id) fetchChats();
  }, [user]);

  return (
    <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No conversations yet</p>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== user._id);
            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                    {otherUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-semibold text-gray-800">{otherUser?.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
