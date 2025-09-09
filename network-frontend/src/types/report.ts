import { Post } from './post';
import { User } from './user';

export interface Prediction {
  label: string;
  probability: number;
}

export interface AiAnalysis {
  predictions: Prediction[];
  reviewedAt: string;
  modelVersion: string;
}

export interface Report {
  id: string;
  reason: string;
  status: ReportStatus;
  type: ReportType;
  reporter: User | null;
  post: Post;
  aiAnalysis: AiAnalysis;
  createdAt: string;
  updatedAt: string;
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
}

export enum ReportType {
  POST = 'post',
  COMMENT = 'comment',
  USER = 'user',
}
