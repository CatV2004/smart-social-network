// components/features/notification/NotificationItem.tsx
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
import { useFollowRequests } from "@/hooks/useFollowRequests";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";
import { deleteNotification } from "@/redux/features/notifications/notificationThunks";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface NotificationItemProps {
  notification: Notification;
  index: number;
  onClick: (notification: Notification) => void;
  onActionComplete?: (notificationId: string) => void;
}

export function NotificationItem({
  notification,
  index,
  onClick,
  onActionComplete,
}: NotificationItemProps) {
  const { acceptRequest, rejectRequest } = useFollowRequests();
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowRequest = notification.type === NotificationEnum.FOLLOW_REQUEST;
  const followId = notification.metadata?.id;

  const handleDeleteNotification = async () => {
    try {
      await dispatch(deleteNotification(notification.id)).unwrap();
      onActionComplete?.(notification.id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!followId || isProcessing) return;

    setIsProcessing(true);
    try {
      await acceptRequest(followId);
      await handleDeleteNotification();
    } catch (error) {
      console.error("Failed to accept follow request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!followId || isProcessing) return;

    setIsProcessing(true);
    try {
      await rejectRequest(followId);
      await handleDeleteNotification();
    } catch (error) {
      console.error("Failed to reject follow request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleItemClick = () => {
    if (!isFollowRequest || !followId) {
      onClick(notification);
    }
  };

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
        !notification.isRead ? "bg-blue-50" : ""
      } ${isProcessing ? "opacity-70" : ""}`}
      onClick={handleItemClick}
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

          {!notification.isRead && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 border-2 border-white"></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800">
            {getNotificationMessage(notification)}
          </p>

          {/* {hasParentComment && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
              <p className="font-medium">Bình luận gốc:</p>
              <p className="truncate">"{notification.metadata.parentCommentContent}"</p>
            </div>
          )} */}

          <p className="text-xs text-gray-500 mt-1">
            {formatTime(notification.createdAt)}
          </p>

          {isFollowRequest && followId && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="default"
                onClick={handleAccept}
                disabled={isProcessing}
                className="h-7 text-xs min-w-[80px]"
              >
                {isProcessing ? (
                  <LoadingSpinner size="xs" className="mr-1" />
                ) : (
                  <FontAwesomeIcon
                    icon={getNotificationIcon(NotificationEnum.FOLLOW)}
                    className="h-3 w-3 mr-1"
                  />
                )}
                Chấp nhận
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReject}
                disabled={isProcessing}
                className="h-7 text-xs min-w-[80px]"
              >
                {isProcessing ? (
                  <LoadingSpinner size="xs" className="mr-1" />
                ) : (
                  <FontAwesomeIcon
                    icon={getNotificationIcon(NotificationEnum.FOLLOW_REQUEST)}
                    className="h-3 w-3 mr-1"
                  />
                )}
                Từ chối
              </Button>
            </div>
          )}
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
    </motion.div>
  );
}
