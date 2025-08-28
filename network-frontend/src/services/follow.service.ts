import axiosClient from "@/lib/api/axiosClient";
import { FollowResponse } from "@/types/follow";
import { FollowRequest } from "@/types/follow-request";
import { ListResponse } from "@/types/pagination-meta";

export const followService = {
    follow: async (userId: string): Promise<FollowResponse> => {
        const response = await axiosClient.post(`/follows/${userId}`);
        return response.data;
    },

    unfollow: async (userId: string): Promise<{ message: string }> => {
        const response = await axiosClient.delete(`/follows/${userId}/unfollow`);
        return response.data;
    },

    acceptFollow: async (followId: string): Promise<FollowResponse> => {
        const response = await axiosClient.patch(`/follows/${followId}/accept`);
        return response.data;
    },

    rejectFollow: async (followId: string): Promise<void> => {
        await axiosClient.patch(`/follows/${followId}/reject`);
    },

    getFollowing: async (
        page: number = 1,
        limit: number = 10,
        sortBy: string = "createdAt",
        sortOrder: "ASC" | "DESC" = "DESC"
    ): Promise<ListResponse<FollowRequest>> => {
        const response = await axiosClient.get(
            `/follows/following?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        return response.data;
    },
};