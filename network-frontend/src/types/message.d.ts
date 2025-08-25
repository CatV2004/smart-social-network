export interface User {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: string;
}

export interface Message {
    id: string;
    content: string;
    sender: User;
    timestamp: string;
    isRead: boolean;
    type: 'text' | 'image' | 'file';
    mediaUrl?: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
    isGroup: boolean;
    groupName?: string;
    groupAvatar?: string;
}