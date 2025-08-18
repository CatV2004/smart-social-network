export interface UserInfo {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface Author {
    id: string;
    avatar: string;
    bio: string | null;
    user: UserInfo;
}

export interface Comment {
    id: string;
    content: string;
    repliesCount: number;
    isEdited: boolean;
    isPinned: boolean;
    author: Author;
    replyTo?: Author;
    parentId?:string;
    createdAt: string;
    updatedAt: string;
}

export type CreateCommentResponse = Comment;

export interface CreateCommentPayload {
    content: string;
    postId: string;
    parentCommentId?: string;
    replyToId?: string;
}
