"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { addNotification } from '@/redux/features/notifications/notificationSlice';
import { addFollowRequestFromNotification } from '@/redux/features/follow-request/followRequestSlice';
import { Notification, NotificationEnum } from '@/types/notification';
import { useSingleSocket } from '@/context/SingleSocketContext';
import { FollowRequest } from '@/types/follow-request';
import { incrementFollowersCount } from '@/redux/features/profile/profileSlice';

export const useSocketNotifications = () => {
    const { onNewNotification, onNewNotificationsBatch, isConnected } = useSingleSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('[useSocketNotifications] Socket status:', { isConnected });

        const handleNewNotification = (notification: Notification) => {
            console.log('[SOCKET] New notification received:', notification);
            dispatch(addNotification(notification));

            if (notification.type === NotificationEnum.FOLLOW_REQUEST && notification.metadata) {
                try {
                    const followRequest = notification.metadata as unknown as FollowRequest;
                    if (followRequest.id && followRequest.profile && followRequest.followedAt) {
                        dispatch(addFollowRequestFromNotification(followRequest));
                        console.log('[SOCKET] Added follow request from notification:', followRequest);
                    }
                } catch (error) {
                    console.error('[SOCKET] Error processing follow request notification:', error);
                }
            } else if (notification.type === NotificationEnum.FOLLOW) {
                dispatch(incrementFollowersCount());
                console.log('[SOCKET] Incremented followers count due to follow notification');
            }
        };

        const handleNewNotificationsBatch = (notifications: Notification[]) => {
            console.log('[SOCKET] Batch notifications received:', notifications.length);
            notifications.forEach(notification => {
                dispatch(addNotification(notification));
            });
        };

        // Subscribe to events
        const unsubscribeNewNotification = onNewNotification(handleNewNotification);
        const unsubscribeNewNotificationsBatch = onNewNotificationsBatch(handleNewNotificationsBatch);

        return () => {
            console.log('[useSocketNotifications] Cleaning up listeners');
            unsubscribeNewNotification();
            unsubscribeNewNotificationsBatch();
        };
    }, [onNewNotification, onNewNotificationsBatch, isConnected, dispatch]);
};