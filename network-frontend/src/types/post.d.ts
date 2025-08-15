import { AudioMedia, ImageMedia, VideoMedia } from "./media";
import { PaginationMeta } from "./pagination-meta";
import { AuthorProfile } from "./profile";

export type MediaItem = ImageMedia | VideoMedia | AudioMedia;

export interface Post {
  id: string;
  content: string;
  author: AuthorProfile;
  media: MediaItem[];
  isEdited: boolean;
  isPinned: boolean;
  likesCount: number;
  commentsCount: number;
  isReacted: boolean;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  data: Post[];
  meta: PaginationMeta;
}

export interface CreatePostPayload {
  content?: string;
}

export interface CreatePostResponse {
  message: string;
  postId: string;
}

export type PostCreationStep = 'select-media' | 'add-caption' | 'uploading';

export interface PostCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface PostCreateState {
  step: PostCreationStep;
  mediaFiles: MediaFile[];
  caption: string;
  uploadProgress: number;
  showBackConfirm: boolean;
  currentIndex: number;
}