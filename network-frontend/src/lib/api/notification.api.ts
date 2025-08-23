import { Notification } from "@/types/notification";
import axiosClient from "./axiosClient";
import { ListResponse } from "@/types/pagination-meta";
import { UpdateNotificationPayload } from "@/types/notification";

export const notificationApi = {
    getNotifications: (params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "ASC" | "DESC";
    }): Promise<ListResponse<Notification>> => {
        return axiosClient
            .get<ListResponse<Notification>>("/notifications", { params })
            .then((res) => res.data);
    },

    // Đếm số thông báo chưa đọc
    getUnreadCount: (): Promise<number> => {
        return axiosClient.get("/notifications/unread-count")
            .then((res) => res.data);
    },

    // Đánh dấu tất cả thông báo đã đọc
    markAllAsRead: (): Promise<{ success: boolean }> => {
        return axiosClient.patch("/notifications/mark-all-as-read");
    },

    // Cập nhật 1 thông báo (ví dụ: đánh dấu đã đọc, update metadata)
    updateNotification: (
        notificationId: string,
        payload: UpdateNotificationPayload
    ): Promise<Notification> => {
        return axiosClient.patch(`/notifications/${notificationId}`, payload).then((res) => res.data);
    },

    // Xóa thông báo
    removeNotification: (notificationId: string): Promise<{ success: boolean }> => {
        return axiosClient.delete(`/notifications/${notificationId}`);
    },
};
