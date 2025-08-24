import { ListResponse } from "@/types/pagination-meta";
import axiosClient from "./axiosClient";
import { FollowRequest } from "@/types/follow-request";

export const followRequestApi = {
    getFollowRequests: (
        params: { page?: number; limit?: number } = { page: 1, limit: 5 }
    ): Promise<ListResponse<FollowRequest>> => {
        return axiosClient.get("/follows/received-requests", {
            params,
        }).then((res) => res.data);
    },

    acceptFollowRequest: (requestId: string): Promise<void> => {
        return axiosClient.post(`/follow-requests/${requestId}/accept`);
    },

    rejectFollowRequest: (requestId: string): Promise<void> => {
        return axiosClient.post(`/follow-requests/${requestId}/reject`);
    },
};