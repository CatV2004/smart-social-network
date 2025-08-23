// hooks/useSocketNotifications.ts - SỬA LẠI
"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { addNotification, incrementUnreadCount } from '@/redux/features/notifications/notificationSlice';
import { Notification } from '@/types/notification';
import { useNotificationsSocket } from '@/context/NotificationsSocketContext';

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