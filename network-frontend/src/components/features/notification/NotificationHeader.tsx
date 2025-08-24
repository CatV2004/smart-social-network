"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onClose,
}: NotificationHeaderProps) {
  return (
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
            onClick={onMarkAllAsRead}
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
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-gray-600" />
        </motion.button>
      </div>
    </div>
  );
}
