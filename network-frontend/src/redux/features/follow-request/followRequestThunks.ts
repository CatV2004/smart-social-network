import { followRequestApi } from "@/lib/api/follow-request.api";
import { followService } from "@/services/follow.service";
import { FollowResponse } from "@/types/follow";
import { FollowRequest } from "@/types/follow-request";
import { ListResponse } from "@/types/pagination-meta";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFollowRequests = createAsyncThunk<
    ListResponse<FollowRequest>,
    { page?: number; limit?: number } | undefined,
    { rejectValue: ListResponse<FollowRequest> }
>(
    "followRequests/fetchFollowRequests",
    async (params, { rejectWithValue }) => {
        try {
            const payload = await followRequestApi.getFollowRequests({
                page: params?.page || 1,
                limit: params?.limit || 20,
            });

            if (!payload || !Array.isArray(payload.data)) {
                throw new Error("Invalid API response");
            }

            return payload;
        } catch (error: any) {
            return rejectWithValue({
                data: [],
                meta: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    total: 0,
                    totalPages: 0,
                },
            });
        }
    }
);


export const acceptFollowRequest = createAsyncThunk<
    FollowResponse,
    string,
    { rejectValue: string }
>("followRequests/accept", async (followId, { rejectWithValue }) => {
    try {
        const response = await followService.acceptFollow(followId);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Accept failed");
    }
});

export const rejectFollowRequest = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("followRequests/reject", async (followId, { rejectWithValue }) => {
    try {
        await followService.rejectFollow(followId);
        return followId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Reject failed");
    }
});