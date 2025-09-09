// components/features/notification/notificationUtils.ts
import {
    faBell,
    faHeart,
    faComment,
    faUserPlus,
    faReply,
    faCheckCircle,
    faExclamationTriangle, // Thêm icon reply
} from "@fortawesome/free-solid-svg-icons";
import { Notification, NotificationEnum } from "@/types/notification";

// Map icon theo type
export const getNotificationIcon = (type: NotificationEnum) => {
    switch (type) {
        case NotificationEnum.LIKE_POST:
            return faHeart;
        case NotificationEnum.COMMENT_POST:
            return faComment;
        case NotificationEnum.REPLY_COMMENT:
            return faReply;
        case NotificationEnum.FOLLOW:
            return faUserPlus;
        case NotificationEnum.FOLLOW_REQUEST:
            return faUserPlus;
        case NotificationEnum.FOLLOW_REQUEST_ACCEPTED:
            return faCheckCircle;
        case NotificationEnum.MENTION:
            return faComment;
        case NotificationEnum.TAG:
            return faComment;
        case NotificationEnum.POST_REMOVED:
            return faExclamationTriangle;
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
            return "text-blue-500";
        case NotificationEnum.REPLY_COMMENT:
            return "text-purple-500";
        case NotificationEnum.FOLLOW:
            return "text-green-500";
        case NotificationEnum.FOLLOW_REQUEST:
            return "text-orange-500";
        case NotificationEnum.FOLLOW_REQUEST_ACCEPTED:
            return "text-green-600";
        case NotificationEnum.MENTION:
            return "text-blue-500";
        case NotificationEnum.TAG:
            return "text-blue-500";
        case NotificationEnum.POST_REMOVED:
            return "text-red-600";
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
            return `${senderName} đã bình luận: "${notification.comment?.content || ""}"`;
        case NotificationEnum.REPLY_COMMENT:
            // Xử lý riêng cho reply comment
            if (notification.metadata?.parentCommentAuthor) {
                return `${senderName} đã trả lời bình luận của ${notification.metadata.parentCommentAuthor}: "${notification.comment?.content || ""}"`;
            }
            return `${senderName} đã trả lời bình luận: "${notification.comment?.content || ""}"`;
        case NotificationEnum.FOLLOW:
            return `${senderName} đã bắt đầu theo dõi bạn`;
        case NotificationEnum.FOLLOW_REQUEST:
            return `${senderName} đã gửi lời mời theo dõi`;
        case NotificationEnum.FOLLOW_REQUEST_ACCEPTED:
            return `${senderName} đã chấp nhận lời mời theo dõi của bạn`;
        case NotificationEnum.MENTION:
            return `${senderName} đã nhắc đến bạn trong một bình luận`;
        case NotificationEnum.TAG:
            return `${senderName} đã gắn thẻ bạn trong bài viết`;
        case NotificationEnum.POST_REMOVED:
            return notification.metadata?.message || "Bài viết của bạn đã bị xoá vì vi phạm";

        default:
            return notification.metadata?.message || "Bạn có một thông báo mới";
    }
};

// Format thời gian
export const formatTime = (createdAt: string | Date) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
            (now.getTime() - created.getTime()) / (1000 * 60)
        );
        if (diffInMinutes < 1) return "Vừa xong";
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} ngày trước`;
        } else {
            return created.toLocaleDateString("vi-VN");
        }
    }
};