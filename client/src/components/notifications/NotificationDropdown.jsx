import { useState, useEffect, useRef } from "react";
import { notificationApi } from "../../../api/api";
import { Link } from "react-router-dom";
import { BiCheck, BiCheckDouble, BiTrash, BiX } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = ({ onClose, onCountUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' or 'unread'
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Click outside to close
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.get("/", {
        params: {
          limit: 20,
          unreadOnly: filter === "unread",
        },
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.patch(`/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      onCountUpdate();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.patch("/mark-all-read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      onCountUpdate();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationApi.delete(`/${notificationId}`);
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notificationId)
      );
      onCountUpdate();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "APPLICATION_SUBMITTED":
        return "📝";
      case "APPLICATION_REVIEWED":
        return "👀";
      case "APPLICATION_SHORTLISTED":
        return "⭐";
      case "APPLICATION_REJECTED":
        return "❌";
      case "APPLICATION_APPROVED":
        return "✅";
      case "NEW_MESSAGE":
        return "💬";
      case "JOB_POSTED":
        return "📢";
      default:
        return "🔔";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread
          </button>
          <button
            onClick={markAllAsRead}
            className="ml-auto text-sm text-blue-600 hover:underline"
          >
            <BiCheckDouble size={18} className="inline mr-1" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl">🔔</span>
            <p className="mt-2">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={notification.link || "#"}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                      onClose();
                    }}
                    className="block"
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      <BiCheck size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <BiTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
