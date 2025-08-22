import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { addNotification, incrementUnreadCount } from '@/redux/features/notifications/notificationSlice';
import { Notification } from '@/types/notification';
import { useNotificationsSocket } from '@/context/NotificationsSocketContext';

export const useSocketNotifications = () => {
    const { socket } = useNotificationsSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!socket) return;

        // Lắng nghe notification mới
        const handleNewNotification = (notification: Notification) => {
            dispatch(addNotification(notification));
            console.log('📩 [SOCKET] New notification received:', notification);
        };

        socket.on('new_notification', handleNewNotification);

        // log khi connect
        socket.on("connect", () => {
            console.log("✅ [SOCKET] Connected:", socket.id);
        });

        // log khi disconnect
        socket.on("disconnect", (reason) => {
            console.log("❌ [SOCKET] Disconnected:", reason);
        });

        return () => {
            socket.off('new_notification', handleNewNotification);
        };
    }, [socket, dispatch]);
};