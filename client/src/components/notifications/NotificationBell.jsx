import { useState, useEffect } from "react";
import { BiBell } from "react-icons/bi";
import { notificationApi } from "../../../api/api";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.get("/unread-count");
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <BiBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown
          onClose={() => setShowDropdown(false)}
          onCountUpdate={fetchUnreadCount}
        />
      )}
    </div>
  );
};

export default NotificationBell;
