export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

interface MediaFile {
  file: File;
  previewUrl?: string; 
}

export interface ImageMedia {
  id: string;
  type: 'IMAGE';
  url: string;
  thumbnail: string | null;
  duration: null;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

// Media cho video
export interface VideoMedia {
  id: string;
  type: 'VIDEO';
  url: string;
  thumbnail: string | null;
  duration: number; // giây
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

// Media cho audio
export interface AudioMedia {
  id: string;
  type: 'AUDIO';
  url: string;
  thumbnail: string | null;
  duration: number; // giây
  width: null;
  height: null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadMediaPayload {
  files: File[];
  postId: string;
  type: Extract<MediaType, 'IMAGE' | 'VIDEO'>;
}

export interface MediaResponse {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}


export type Media = ImageMedia | VideoMedia | AudioMedia;