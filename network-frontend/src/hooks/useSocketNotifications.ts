// hooks/useSocketNotifications.ts - SỬA LẠI
"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { addNotification } from '@/redux/features/notifications/notificationSlice';
import { addFollowRequestFromNotification } from '@/redux/features/follow-request/followRequestSlice';
import { Notification, NotificationEnum } from '@/types/notification';
import { useNotificationsSocket } from '@/context/NotificationsSocketContext';
import { FollowRequest } from '@/types/follow-request';
import { incrementFollowersCount } from '@/redux/features/profile/profileSlice';

export const useSocketNotifications = () => {
    const { socket, isConnected } = useNotificationsSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('[useSocketNotifications] Socket status:', {
            hasSocket: !!socket,
            isConnected,
            socketId: socket?.id
        });

        if (!socket) {
            console.log('[useSocketNotifications] No socket available');
            return;
        }

        // Lắng nghe notification mới
        const handleNewNotification = (notification: Notification) => {
            console.log('[SOCKET] New notification received:', notification);
            dispatch(addNotification(notification));

            if (notification.type === NotificationEnum.FOLLOW_REQUEST && notification.metadata) {
                try {
                    // Metadata đã là FollowRequest object, chỉ cần ép kiểu
                    const followRequest = notification.metadata as unknown as FollowRequest;

                    if (followRequest.id && followRequest.profile && followRequest.followedAt) {
                        dispatch(addFollowRequestFromNotification(followRequest));
                        console.log('[SOCKET] Added follow request from notification:', followRequest);
                    } else {
                        console.warn('[SOCKET] Invalid follow request format in metadata:', notification.metadata);
                    }
                } catch (error) {
                    console.error('[SOCKET] Error processing follow request notification:', error);
                }
            }
            else if (notification.type === NotificationEnum.FOLLOW) {
                dispatch(incrementFollowersCount());
                console.log('[SOCKET] Incremented followers count due to follow notification');
            }
        };

        socket.on('new_notification', handleNewNotification);

        // log khi connect
        socket.on("connect", () => {
            console.log("[SOCKET] Connected to notifications:", socket.id);
        });

        // log khi disconnect
        socket.on("disconnect", (reason) => {
            console.log("[SOCKET] Disconnected from notifications:", reason);
        });

        return () => {
            console.log('[useSocketNotifications] Cleaning up listeners');
            socket.off('new_notification', handleNewNotification);
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket, dispatch]);
};