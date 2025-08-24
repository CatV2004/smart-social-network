import {
    faBell,
    faHeart,
    faComment,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Notification, NotificationEnum } from "@/types/notification";

// Map icon theo type
export const getNotificationIcon = (type: NotificationEnum) => {
    switch (type) {
        case NotificationEnum.LIKE_POST:
            return faHeart;
        case NotificationEnum.COMMENT_POST:
        case NotificationEnum.REPLY_COMMENT:
            return faComment;
        case NotificationEnum.FOLLOW:
            return faUserPlus;
        default:
            return faBell;
    }
};

// Map màu icon theo type
export const getNotificationIconColor = (type: NotificationEnum) => {
    switch (type) {
        case NotificationEnum.LIKE_POST:
            return "text-red-500";
        case NotificationEnum.COMMENT_POST:
        case NotificationEnum.REPLY_COMMENT:
            return "text-blue-500";
        case NotificationEnum.FOLLOW:
            return "text-green-500";
        default:
            return "text-gray-500";
    }
};

// Format message theo type
export const getNotificationMessage = (notification: Notification) => {
    const senderName =
        `${notification.sender?.user?.firstName || ""} ${notification.sender?.user?.lastName || ""
            }`.trim() ||
        notification.sender?.user?.username ||
        "Người dùng";

    switch (notification.type) {
        case NotificationEnum.LIKE_POST:
            return `${senderName} đã thích bài viết của bạn`;
        case NotificationEnum.COMMENT_POST:
            return `${senderName} đã bình luận: "${notification.comment?.content || ""
                }"`;
        case NotificationEnum.REPLY_COMMENT:
            return `${senderName} đã trả lời: "${notification.comment?.content || ""
                }"`;
        case NotificationEnum.FOLLOW:
            return `${senderName} đã bắt đầu theo dõi bạn`;
        case NotificationEnum.MENTION:
            return `${senderName} đã nhắc đến bạn`;
        case NotificationEnum.TAG:
            return `${senderName} đã gắn thẻ bạn trong bài viết`;
        default:
            return notification.metadata?.message || "Bạn có một thông báo mới";
    }
};

// Format thời gian
export const formatTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
            (now.getTime() - created.getTime()) / (1000 * 60)
        );
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} ngày trước`;
    }
};