"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBell,
  faHeart,
  faComment,
  faUserPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  updateNotification,
} from "@/redux/features/notifications/notificationThunks";
import { markAllAsReadLocal } from "@/redux/features/notifications/notificationSlice";
import { Notification, NotificationEnum } from "@/types/notification";

interface NotificationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  "data-overlay"?: string;
}

// Map icon theo type
const getNotificationIcon = (type: NotificationEnum) => {
  switch (type) {
    case NotificationEnum.LIKE_POST:
      return faHeart;
    case NotificationEnum.COMMENT_POST:
    case NotificationEnum.REPLY_COMMENT:
      return faComment;
    case NotificationEnum.FOLLOW:
      return faUserPlus;
    default:
      return faBell;
  }
};

// Map màu icon theo type
const getNotificationIconColor = (type: NotificationEnum) => {
  switch (type) {
    case NotificationEnum.LIKE_POST:
      return "text-red-500";
    case NotificationEnum.COMMENT_POST:
    case NotificationEnum.REPLY_COMMENT:
      return "text-blue-500";
    case NotificationEnum.FOLLOW:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

// Format message theo type
const getNotificationMessage = (notification: Notification) => {
  const senderName =
    `${notification.sender?.user?.firstName || ""} ${
      notification.sender?.user?.lastName || ""
    }`.trim() ||
    notification.sender?.user?.username ||
    "Người dùng";

  switch (notification.type) {
    case NotificationEnum.LIKE_POST:
      return `${senderName} đã thích bài viết của bạn`;
    case NotificationEnum.COMMENT_POST:
      return `${senderName} đã bình luận về bài viết của bạn`;
    case NotificationEnum.REPLY_COMMENT:
      return `${senderName} đã trả lời bình luận của bạn`;
    case NotificationEnum.FOLLOW:
      return `${senderName} đã bắt đầu theo dõi bạn`;
    case NotificationEnum.MENTION:
      return `${senderName} đã nhắc đến bạn`;
    case NotificationEnum.TAG:
      return `${senderName} đã gắn thẻ bạn trong bài viết`;
    default:
      return notification.metadata?.message || "Bạn có một thông báo mới";
  }
};

// Format thời gian
const formatTime = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInHours = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60)
    );
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  }
};

export function NotificationsOverlay({
  isOpen,
  onClose,
  ...props
}: NotificationsOverlayProps) {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading, pagination } = useAppSelector(
    (state) => state.notifications
  );
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    []
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch khi mở overlay
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
    }
  }, [isOpen, dispatch]);

  // Sync localNotifications
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Xử lý load more khi scroll đến cuối
  const handleScroll = useCallback(() => {
    const container = document.querySelector(".overflow-y-auto");
    if (!container || isLoadingMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && pagination && pagination.page < pagination.totalPages) {
      setIsLoadingMore(true);
      dispatch(
        fetchNotifications({
          page: pagination.page + 1,
          limit: pagination.limit,
        })
      )
        .unwrap()
        .finally(() => {
          setIsLoadingMore(false);
        });
    }
  }, [pagination, isLoadingMore, loading, dispatch]);

  // Thêm event listener scroll
  useEffect(() => {
    const container = document.querySelector(".overflow-y-auto");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
      .unwrap()
      .then(() => {
        dispatch(markAllAsReadLocal());
      })
      .catch((error) => {
        console.error("Failed to mark all as read:", error);
      });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      dispatch(
        updateNotification({
          notificationId: notification.id,
          payload: { isRead: true },
        })
      );
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 z-10 md:hidden"
        onClick={onClose}
      />

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-20 h-full w-100 bg-white shadow-xl z-20 border-r border-gray-200 flex flex-col"
        {...props}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-gray-800"
          >
            Thông báo
          </motion.h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
            <motion.button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="w-4 h-4 text-gray-600"
              />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !isLoadingMore ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {localNotifications.length > 0 ? (
                <>
                  {localNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar / Icon */}
                        <div className="flex-shrink-0">
                          {notification.sender?.avatar ? (
                            <img
                              src={notification.sender.avatar}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={getNotificationIcon(notification.type)}
                                className={`w-4 h-4 ${getNotificationIconColor(
                                  notification.type
                                )}`}
                              />
                            </div>
                          )}
                        </div>

                        {/* Nội dung */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            {getNotificationMessage(notification)}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading more indicator */}
                  {(isLoadingMore || (loading && isLoadingMore)) && (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="w-4 h-4 text-gray-500 animate-spin"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Đang tải thêm...
                      </p>
                    </div>
                  )}

                  {/* No more notifications indicator */}
                  {pagination && pagination.page >= pagination.totalPages && (
                    <div className="p-4 text-center">
                      <p className="text-xs text-gray-500">
                        Đã tải tất cả thông báo
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-8 text-center text-gray-500"
                >
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={faBell}
                      className="w-6 h-6 text-gray-400"
                    />
                  </div>
                  <p className="font-medium">Không có thông báo</p>
                  <p className="text-sm mt-1">
                    Tất cả thông báo sẽ xuất hiện ở đây
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {localNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="w-full py-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
