
export interface FollowResponse {
    id: string;
    follower: {
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
    };
    following: {
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
    };
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}

export interface FollowStatus {
    isFollowing: boolean;
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    followId?: string;
}