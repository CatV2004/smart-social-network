"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  updateNotification,
} from "@/redux/features/notifications/notificationThunks";
import { markAllAsReadLocal } from "@/redux/features/notifications/notificationSlice";
import { Notification } from "@/types/notification";
import {
  NotificationHeader,
  NotificationItem,
  NotificationEmpty,
  NotificationLoading,
  NotificationFooter,
} from "./";

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
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading, pagination } = useAppSelector(
    (state) => state.notifications
  );
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    []
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch khi mở overlay
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
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
    const container = scrollContainerRef.current;
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

  const handleViewAll = () => {
    // Logic để xem tất cả thông báo
    console.log("Xem tất cả thông báo");
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
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          {loading && !isLoadingMore ? (
            <NotificationLoading />
          ) : (
            <div className="divide-y divide-gray-100">
              {localNotifications.length > 0 ? (
                <>
                  {localNotifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      index={index}
                      onClick={handleNotificationClick}
                    />
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
                <NotificationEmpty />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <NotificationFooter
          hasNotifications={localNotifications.length > 0}
          onViewAll={handleViewAll}
        />
      </motion.div>
    </>
  );
}
