export interface Notification {
    id: string;
    type: NotificationEnum;
    sender: {
        id: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            username: string;
        };
        avatar?: string;
    };
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, any>;
}

export interface UpdateNotificationPayload {
    isRead?: boolean;
    metadata?: Record<string, any>;
}

export enum NotificationEnum {
    LIKE_POST = 1,
    COMMENT_POST = 2,
    REPLY_COMMENT = 3,
    FOLLOW = 4,
    MENTION = 5,
    TAG = 6,
}