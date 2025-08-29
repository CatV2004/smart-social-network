export interface conversationRequest {
    isGroup: boolean;
    memberIds: string[];
    name?: string;
}

export interface AttachmentSummaryResponse {
    type: AttachmentType;
}

export interface MessageSummaryResponse {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    senderFullName: string;
    attachments: AttachmentSummaryResponse[];
}

export interface conversationResponse {
    id: string;
    isGroup: boolean;
    createdAt: string;
    updatedAt: string;
    displayName: string;
    displayAvatar: string;
    unreadCount: number;
    memberCount: number;
    isPinned: boolean;
    lastMessage?: MessageSummaryResponse;
    targetUserId?: string;
}
