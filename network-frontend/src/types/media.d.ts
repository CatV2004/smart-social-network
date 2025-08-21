export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';


export interface MediaInput {
  id?: string;           // media cũ
  type?: "IMAGE" | "VIDEO" | "AUDIO";
  file?: File;           // media mới
}

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

export interface UpdateMediaPayload {
  id?: string;
  type?: 'IMAGE' | 'VIDEO';
  file?: File;
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