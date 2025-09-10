import { createAsyncThunk } from "@reduxjs/toolkit";
import { notificationApi } from "@/lib/api/notification.api";
import { Notification, UpdateNotificationPayload } from "@/types/notification";
import { ListResponse } from "@/types/pagination-meta";

export const fetchNotifications = createAsyncThunk<
    ListResponse<Notification>,
    { page?: number; limit?: number; unreadOnly?: boolean } | undefined
>(
    "notifications/fetchNotifications",
    async (params, { rejectWithValue }) => {
        try {
            const payload = await notificationApi.getNotifications(params);
            if (!payload || !Array.isArray(payload.data)) {
                throw new Error("Invalid API response");
            }
            return payload;
        } catch (error: any) {
            return rejectWithValue({
                data: [],
                meta: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    total: 0,
                    totalPages: 0,
                },
            } as ListResponse<Notification>);
        }
    }
);


export const fetchUnreadCount = createAsyncThunk<number>(
    "notifications/fetchUnreadCount",
    async () => {
        return await notificationApi.getUnreadCount();
    }
);

export const updateNotification = createAsyncThunk<
    Notification,
    { notificationId: string; payload: UpdateNotificationPayload }
>(
    "notifications/updateNotification",
    async ({ notificationId, payload }) => {
        return await notificationApi.updateNotification(notificationId, payload);
    }
);

// Đánh dấu tất cả đã đọc
export const markAllNotificationsAsRead = createAsyncThunk<void>(
    "notifications/markAllAsRead",
    async () => {
        await notificationApi.markAllAsRead();
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            await notificationApi.removeNotification(notificationId);
            return notificationId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete notification');
        }
    }
);
