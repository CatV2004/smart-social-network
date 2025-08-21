import { User } from "./user";

export interface Profile {
  id: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  location: string | null;
  gender: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  website: string | null;
  facebook: string | null;
  linkedin: string | null;
  github: string | null;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowed: boolean;
  createdAt: string;
  updatedAt: string;
  canViewPosts?: boolean;
}

export interface ProfileUpdatePayload {
  bio?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  github?: string | null;
  isPrivate?: boolean | null;
}

export interface AuthorProfile {
  id: string;
  avatar: string;
  bio: string | null;
  user?: User;
}