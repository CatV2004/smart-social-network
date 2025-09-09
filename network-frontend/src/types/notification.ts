export interface Notification {
    id: string;
    type: NotificationEnum;
    sender?: {
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
    post?: PostPreview;
    comment?: CommentPreview;
}

export interface UpdateNotificationPayload {
    isRead?: boolean;
    metadata?: Record<string, any>;
}

export enum NotificationEnum {
    LIKE_POST = "LIKE_POST",
    COMMENT_POST = "COMMENT_POST",
    REPLY_COMMENT = "REPLY_COMMENT",
    FOLLOW = "FOLLOW",
    MENTION = "MENTION",
    TAG = "TAG",
    FOLLOW_REQUEST = "FOLLOW_REQUEST",
    FOLLOW_REQUEST_ACCEPTED = "FOLLOW_REQUEST_ACCEPTED",
    POST_REMOVED="POST_REMOVED"
}

export interface PostPreview {
    id: string;
    previewUrl: string;
}

export interface CommentPreview {
    id: string;
    content: string;
    post: PostPreview;
}
