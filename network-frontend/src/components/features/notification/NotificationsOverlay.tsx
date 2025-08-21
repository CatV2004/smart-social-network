"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBell,
  faHeart,
  faComment,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

interface NotificationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  "data-overlay"?: string;
}

export function NotificationsOverlay({
  isOpen,
  onClose,
  ...props
}: NotificationsOverlayProps) {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Mock data cho thông báo
  const mockNotifications = [
    {
      id: 1,
      type: "like",
      user: { name: "Nguyễn Văn A", avatar: "/default-avatar.jpg" },
      text: "đã thích bài viết của bạn",
      target: "Bài viết về du lịch Đà Lạt",
      time: "2 giờ trước",
      isRead: false,
    },
    {
      id: 2,
      type: "comment",
      user: { name: "Trần Thị B", avatar: "/default-avatar.jpg" },
      text: "đã bình luận về bài viết của bạn",
      target: "Ăn gì ở Sài Gòn?",
      time: "5 giờ trước",
      isRead: true,
    },
    {
      id: 3,
      type: "follow",
      user: { name: "Lê Văn C", avatar: "/default-avatar.jpg" },
      text: "đã bắt đầu theo dõi bạn",
      time: "1 ngày trước",
      isRead: false,
    },
    {
      id: 4,
      type: "like",
      user: { name: "Phạm Thị D", avatar: "/default-avatar.jpg" },
      text: "đã thích bình luận của bạn",
      target: "Cảm ơn bạn đã chia sẻ",
      time: "2 ngày trước",
      isRead: true,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setNotifications(mockNotifications);
    }
  }, [isOpen]);

  // Lấy icon theo type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return faHeart;
      case "comment":
        return faComment;
      case "follow":
        return faUserPlus;
      default:
        return faBell;
    }
  };

  // Lấy màu cho icon
  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case "like":
        return "text-red-500";
      case "comment":
        return "text-blue-500";
      case "follow":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
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

      {/* Container chính */}
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
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={getNotificationIcon(notification.type)}
                          className={`w-4 h-4 ${getNotificationIconColor(
                            notification.type
                          )}`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {notification.user.name}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {notification.text}
                        </span>
                      </div>
                      {notification.target && (
                        <p className="text-sm text-gray-700 mt-1 truncate">
                          {notification.target}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </motion.div>
              ))
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
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
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
