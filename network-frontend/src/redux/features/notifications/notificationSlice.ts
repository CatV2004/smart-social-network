import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/types/notification";
import {
    deleteNotification,
    fetchNotifications,
    fetchUnreadCount,
    markAllNotificationsAsRead,
    updateNotification,
} from "./notificationThunks";
import { PaginationMeta } from "@/types/pagination-meta";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    hasNew: boolean;
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    hasNew: false,
    loading: false,
    error: null,
    pagination: null,
};

export const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            state.hasNew = true;
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        markAsReadLocal: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find((n) => n.id === action.payload);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsReadLocal: (state) => {
            state.notifications.forEach((notification) => {
                notification.isRead = true;
            });
            state.unreadCount = 0;
            state.hasNew = false;
        },
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },
        resetUnreadCount: (state) => {
            state.unreadCount = 0;
        },
        resetNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.hasNew = false;
            state.loading = false;
            state.error = null;
            state.pagination = null;
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const notificationId = action.payload;
            const notificationIndex = state.notifications.findIndex((n) => n.id === notificationId);

            if (notificationIndex !== -1) {
                const notification = state.notifications[notificationIndex];
                state.notifications.splice(notificationIndex, 1);

                if (!notification.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }

                if (state.pagination) {
                    state.pagination.total = Math.max(0, state.pagination.total - 1);
                    state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload?.data || [];
                const meta = action.payload?.meta || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                };

                if (meta.page === 1) {
                    state.notifications = data;
                } else {
                    state.notifications.push(...data);
                }

                state.pagination = meta;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch notifications";

                state.pagination = state.pagination || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                };
            })
            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            // Update single notification
            .addCase(updateNotification.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.notifications.findIndex((n) => n.id === updated.id);
                if (index !== -1) {
                    state.notifications[index] = updated;
                }
                if (updated.isRead) {
                    state.unreadCount = Math.max(
                        0,
                        state.notifications.filter((n) => !n.isRead).length
                    );
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach((notification) => {
                    notification.isRead = true;
                });
                state.unreadCount = 0;
                state.hasNew = false;
            })
            .addCase(deleteNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.loading = false;
                const notificationId = action.payload;
                const notificationIndex = state.notifications.findIndex((n) => n.id === notificationId);

                if (notificationIndex !== -1) {
                    const notification = state.notifications[notificationIndex];
                    state.notifications.splice(notificationIndex, 1);

                    if (!notification.isRead) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }

                    if (state.pagination) {
                        state.pagination.total = Math.max(0, state.pagination.total - 1);
                        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                    }
                }
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete notification";
            });
    },
});

export const {
    setNotifications,
    addNotification,
    markAsReadLocal,
    markAllAsReadLocal,
    incrementUnreadCount,
    resetUnreadCount,
    resetNotifications,
    removeNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
