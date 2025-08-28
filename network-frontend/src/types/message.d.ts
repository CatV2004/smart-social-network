import { AuthorProfile } from "./profile";

export interface MessageRequest {
  conversationId: string;
  content?: string;
  files?: File[];
}

export interface Attachment {
  url: string;
  type: string;
  publicId: string;
}

export interface MessageResponse {
  id: string;
  content: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  sender: AuthorProfile;
  attachments: Attachment[];
  conversationId: string;
}

export interface MessageRead {
  userId: string;
  avatar: string;
  readAt: string;
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}
