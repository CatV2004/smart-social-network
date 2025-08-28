import { AuthorProfile } from "./profile";

export interface Member {
    id: string;
    role: string;
    profile: AuthorProfile;
}

export interface MemberListResponse {
    data: Member[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}