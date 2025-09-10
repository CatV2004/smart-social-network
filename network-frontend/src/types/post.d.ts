import { AudioMedia, ImageMedia, UpdateMediaPayload, VideoMedia } from "./media";
// import { PaginationMeta } from "./pagination-meta";
import { AuthorProfile } from "./profile";

export type MediaItem = ImageMedia | VideoMedia | AudioMedia;

export enum PostStatus {
  ACTIVE = 'active',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
  REPORTED = 'reported',
}

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
  status?: PostStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}


// export interface PostListResponse {
//   data: Post[];
//   meta: PaginationMeta;
// }

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

export interface MediaUpdatePayload {
  mediaId: string;
}

export interface UpdatePostPayload {
  content?: string;
  mediaToDelete?: string[];
  mediaToUpdate?: MediaUpdatePayload[];
  files?: File[];
  isPinned?: boolean;
}