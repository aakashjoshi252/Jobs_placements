import { useState, useEffect } from "react";
import { notificationApi } from "../../../../api/api";
import { Link } from "react-router-dom";
import { BiCheck, BiCheckDouble, BiTrash, BiFilter } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [stats, setStats] = useState({ unreadCount: 0, totalCount: 0 });

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.get("/", {
        params: {
          limit: 100,
          unreadOnly: filter === "unread",
        },
      });
      setNotifications(response.data.notifications);
      setStats({
        unreadCount: response.data.unreadCount,
        totalCount: response.data.totalCount,
      });
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
      setStats((prev) => ({
        ...prev,
        unreadCount: prev.unreadCount - 1,
      }));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.patch("/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setStats((prev) => ({ ...prev, unreadCount: 0 }));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId, isRead) => {
    try {
      await notificationApi.delete(`/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (!isRead) {
        setStats((prev) => ({
          unreadCount: prev.unreadCount - 1,
          totalCount: prev.totalCount - 1,
        }));
      } else {
        setStats((prev) => ({ ...prev, totalCount: prev.totalCount - 1 }));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteAllRead = async () => {
    if (!window.confirm("Delete all read notifications?")) return;

    try {
      await notificationApi.delete("/clear/read");
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting read notifications:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      APPLICATION_SUBMITTED: "📝",
      APPLICATION_REVIEWED: "👀",
      APPLICATION_SHORTLISTED: "⭐",
      APPLICATION_REJECTED: "❌",
      APPLICATION_APPROVED: "✅",
      NEW_MESSAGE: "💬",
      JOB_POSTED: "📢",
      JOB_UPDATED: "📝",
      JOB_CLOSED: "🔒",
      PROFILE_VIEWED: "👁️",
      RESUME_VIEWED: "📄",
      SYSTEM: "ℹ️",
    };
    return icons[type] || "🔔";
  };

  const filteredNotifications = notifications.filter((n) =>
    typeFilter === "ALL" ? true : n.type === typeFilter
  );

  const notificationTypes = [
    { value: "ALL", label: "All Types" },
    { value: "APPLICATION_SUBMITTED", label: "Applications" },
    { value: "APPLICATION_APPROVED", label: "Approvals" },
    { value: "NEW_MESSAGE", label: "Messages" },
    { value: "JOB_POSTED", label: "Jobs" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              {stats.unreadCount} unread of {stats.totalCount} total
            </p>
          </div>

          <div className="flex gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <BiCheckDouble size={20} />
                Mark all read
              </button>
            )}
            {notifications.some((n) => n.isRead) && (
              <button
                onClick={deleteAllRead}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <BiTrash size={18} />
                Clear read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread ({stats.unreadCount})
          </button>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <BiFilter size={18} />
              {notificationTypes.find((t) => t.value === typeFilter)?.label}
            </button>

            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                {notificationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setTypeFilter(type.value);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      typeFilter === type.value
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl">🔔</span>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No notifications
            </h3>
            <p className="mt-2 text-gray-500">
              {filter === "unread"
                ? "You're all caught up!"
                : "We'll notify you when something happens"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow ${
                !notification.isRead ? "border-l-4 border-blue-600" : ""
              }`}
            >
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  {notification.link ? (
                    <Link
                      to={notification.link}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification._id);
                        }
                      }}
                      className="block group"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                        {!notification.isRead && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                        {!notification.isRead && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <BiCheck size={24} />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      deleteNotification(
                        notification._id,
                        notification.isRead
                      )
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <BiTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
