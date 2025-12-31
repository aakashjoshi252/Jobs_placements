import { useState, useEffect } from "react";
import { notificationApi } from "../../../api/api";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  HiBell,
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiFilter,
  HiCheck,
  HiDocumentText,
  HiStar,
  HiChatAlt2,
  HiBriefcase,
  HiEye,
  HiInformationCircle,
  HiLockClosed,
  HiRefresh,
  HiChevronDown,
  HiX
} from "react-icons/hi";

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
        unreadCount: Math.max(0, prev.unreadCount - 1),
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
          unreadCount: Math.max(0, prev.unreadCount - 1),
          totalCount: Math.max(0, prev.totalCount - 1),
        }));
      } else {
        setStats((prev) => ({ ...prev, totalCount: Math.max(0, prev.totalCount - 1) }));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteAllRead = async () => {
    if (!window.confirm("Delete all read notifications? This action cannot be undone.")) return;

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
      APPLICATION_SUBMITTED: <HiDocumentText className="text-blue-600" />,
      APPLICATION_REVIEWED: <HiEye className="text-purple-600" />,
      APPLICATION_SHORTLISTED: <HiStar className="text-yellow-600" />,
      APPLICATION_REJECTED: <HiXCircle className="text-red-600" />,
      APPLICATION_APPROVED: <HiCheckCircle className="text-green-600" />,
      NEW_MESSAGE: <HiChatAlt2 className="text-blue-600" />,
      JOB_POSTED: <HiBriefcase className="text-emerald-600" />,
      JOB_UPDATED: <HiDocumentText className="text-amber-600" />,
      JOB_CLOSED: <HiLockClosed className="text-gray-600" />,
      PROFILE_VIEWED: <HiEye className="text-indigo-600" />,
      RESUME_VIEWED: <HiDocumentText className="text-cyan-600" />,
      SYSTEM: <HiInformationCircle className="text-gray-600" />,
    };
    return icons[type] || <HiBell className="text-gray-600" />;
  };

  const filteredNotifications = notifications.filter((n) =>
    typeFilter === "ALL" ? true : n.type === typeFilter
  );

  const notificationTypes = [
    { value: "ALL", label: "All Types", icon: <HiFilter /> },
    { value: "APPLICATION_SUBMITTED", label: "Applications", icon: <HiDocumentText /> },
    { value: "APPLICATION_APPROVED", label: "Approvals", icon: <HiCheckCircle /> },
    { value: "NEW_MESSAGE", label: "Messages", icon: <HiChatAlt2 /> },
    { value: "JOB_POSTED", label: "Jobs", icon: <HiBriefcase /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <HiBell className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
                <p className="text-blue-100 text-sm mt-1">
                  {stats.unreadCount} unread • {stats.totalCount} total
                </p>
              </div>
            </div>

            <button
              onClick={fetchNotifications}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Refresh"
            >
              <HiRefresh className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 -mt-4">
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Unread
                {stats.unreadCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === "unread" ? "bg-white/20" : "bg-blue-600 text-white"
                  }`}>
                    {stats.unreadCount}
                  </span>
                )}
              </button>

              {/* Type Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  {notificationTypes.find((t) => t.value === typeFilter)?.icon}
                  {notificationTypes.find((t) => t.value === typeFilter)?.label}
                  <HiChevronDown className={`transition-transform ${showFilterMenu ? "rotate-180" : ""}`} />
                </button>

                {showFilterMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterMenu(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 bg-white border rounded-xl shadow-lg z-20 min-w-[180px] overflow-hidden">
                      {notificationTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => {
                            setTypeFilter(type.value);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${typeFilter === type.value
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700"
                            }`}
                        >
                          {type.icon}
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <HiCheck className="text-lg" />
                  Mark all read
                </button>
              )}
              {notifications.some((n) => n.isRead) && (
                <button
                  onClick={deleteAllRead}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <HiTrash className="text-lg" />
                  Clear read
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {typeFilter !== "ALL" && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">Active filter:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                {notificationTypes.find((t) => t.value === typeFilter)?.label}
                <button
                  onClick={() => setTypeFilter("ALL")}
                  className="hover:bg-blue-100 rounded-full p-0.5 transition"
                >
                  <HiX className="text-sm" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <HiBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter === "unread"
                  ? "You're all caught up! 🎉"
                  : "We'll notify you when something happens"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getIcon={getNotificationIcon}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Notification Card Component
function NotificationCard({ notification, onMarkAsRead, onDelete, getIcon }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${
        !notification.isRead
          ? "border-l-4 border-blue-600"
          : "border-l-4 border-transparent"
      }`}
    >
      <div className="p-5">
        <div className="flex gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">
              {getIcon(notification.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {notification.link ? (
              <Link
                to={notification.link}
                onClick={() => {
                  if (!notification.isRead) {
                    onMarkAsRead(notification._id);
                  }
                }}
                className="block group"
              >
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {notification.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {!notification.isRead && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
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
                <p className="text-gray-600 text-sm mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {!notification.isRead && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification._id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Mark as read"
              >
                <HiCheck className="text-xl" />
              </button>
            )}
            <button
              onClick={() => onDelete(notification._id, notification.isRead)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <HiTrash className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;