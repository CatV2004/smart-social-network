export interface RecommendationUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface CommonConnection {
  avatar: string;
  user_id: string;
  username: string;
  last_name: string;
  first_name: string;
}

export interface CommonConnectionsInfo {
  followers: CommonConnection[];
  following: CommonConnection[];
  description: string;
}

export interface CommonFeatures {
  common_followers: number;
  common_following: number;
  common_neighbors: number;
  common_connections_info: CommonConnectionsInfo;
}

export interface Recommendation {
  id: string;
  candidate: RecommendationUser;
  commonFeatures: CommonFeatures;
  isSendFollow: boolean;
}