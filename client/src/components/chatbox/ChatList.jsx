import { useEffect, useState } from "react";
import { userApi, chatApi } from "../../api/api";
import { useSelector } from "react-redux";
import { BiSearch, BiMessageSquareDetail } from "react-icons/bi";

const ChatList = ({ onSelectChat }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.get("/data", { withCredentials: true });
        setUsers(res.data.data.filter((u) => u._id !== user?._id));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (user?._id) fetchUsers();
  }, [user]);

  const handleSelectUser = async (u) => {
    try {
      const res = await chatApi.post(
        "/create",
        { participantId: u._id, currentUserId: user._id },
        { withCredentials: true }
      );
      onSelectChat(res.data.chat);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="px-6 py-4 bg-gradient-primary shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <BiMessageSquareDetail className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
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

      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto bg-neutral-50">
        {filteredUsers.length === 0 ? (
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
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => handleSelectUser(u)}
                className="flex items-center gap-4 px-6 py-4 cursor-pointer bg-white hover:bg-primary-50 transition-all duration-200 group"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                    {u.username[0].toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-success-500 border-2 border-white rounded-full" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                      {u.username}
                    </p>
                    <span className="text-xs text-neutral-400 font-medium">
                      Online
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 truncate">
                    {u.email || "Click to start chatting"}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
