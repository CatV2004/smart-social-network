
export interface Profile {
  id: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  location: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  phoneNumber: string | null;
  website: string | null;
  facebook: string | null;
  linkedin: string | null;
  github: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdatePayload {
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  website?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  isPrivate?: boolean;
}