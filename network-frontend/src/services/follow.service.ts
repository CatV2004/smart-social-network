import axiosClient from "@/lib/api/axiosClient";
import { FollowResponse } from "@/types/follow";

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
        console.log("followid: ", followId)
        const response = await axiosClient.patch(`/follows/${followId}/accept`);
        return response.data;
    },

    rejectFollow: async (followId: string): Promise<void> => {
        await axiosClient.patch(`/follows/${followId}/reject`);
    },
};