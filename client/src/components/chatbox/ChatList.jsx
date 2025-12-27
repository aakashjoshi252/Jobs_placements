import { useEffect, useState } from "react";
import { userApi, chatApi } from "../../../api/api";
import { useSelector } from "react-redux";

const ChatList = ({ onSelectChat }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.get("/data", {
          withCredentials: true,
        });

        // Remove logged-in user from list
        const filteredUsers = response.data.data.filter(
          (u) => u._id !== user?._id
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchUsers();
  }, [user]);

  const handleSelectUser = async (selectedUser) => {
    try {
      // Create or get existing chat
      const response = await chatApi.post(
        "/create",
        {
          participantId: selectedUser._id,
          currentUserId: user._id,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        onSelectChat(response.data.chat);
      }
    } catch (error) {
      console.error("Error creating/getting chat:", error);
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>

      <div className="flex-wrap overflow-y-auto h-[calc(100%-64px)]">
        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No users available
          </p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              onClick={() => handleSelectUser(u)}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                  {u.username?.charAt(0)?.toUpperCase()}
                </div>

                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-gray-800">
                    {u.username}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {u.email}
                  </p>
                </div>

                <span className="text-xs text-gray-400 capitalize">
                  {u.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
