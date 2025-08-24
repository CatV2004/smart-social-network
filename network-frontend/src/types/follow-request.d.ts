export interface FollowUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface FollowProfile {
    id: string;
    avatar: string | null;
    bio: string | null;
    user: FollowUser;
}

export interface FollowRequest {
    id: string;
    profile: FollowProfile;
    followedAt: string; 
}
