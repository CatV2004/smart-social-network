"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notification, NotificationEnum } from "@/types/notification";
import {
  getNotificationIcon,
  getNotificationIconColor,
  getNotificationMessage,
  formatTime,
} from "./notificationUtils";

interface NotificationItemProps {
  notification: Notification;
  index: number;
  onClick: (notification: Notification) => void;
}

export function NotificationItem({
  notification,
  index,
  onClick,
}: NotificationItemProps) {
  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start gap-3 relative">
        {/* Avatar / Icon */}
        <div className="flex-shrink-0 relative">
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

          {/* Chấm xanh badge */}
          {!notification.isRead && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 border-2 border-white"></span>
          )}
        </div>

        {/* Nội dung + preview image */}
        <div className="flex items-center justify-between min-w-0 gap-4 flex-1">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 truncate">
              {getNotificationMessage(notification)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(notification.createdAt)}
            </p>
          </div>

          {/* Preview image */}
          {notification.post?.previewUrl && (
            <div className="flex-shrink-0">
              <img
                src={notification.post.previewUrl}
                alt="preview"
                className="w-16 h-16 rounded object-cover border"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
