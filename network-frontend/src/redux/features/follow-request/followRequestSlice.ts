import { PaginationMeta } from "@/hooks/usePaginatedData";
import { FollowRequest } from "@/types/follow-request";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { acceptFollowRequest, fetchFollowRequests, rejectFollowRequest } from "./followRequestThunks";

export interface FollowRequestsState {
    data: FollowRequest[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
}

const initialState: FollowRequestsState = {
    data: [],
    meta: null,
    loading: false,
    error: null,
};

const followRequestsSlice = createSlice({
    name: "followRequests",
    initialState,
    reducers: {
        clearFollowRequests: (state) => {
            state.data = [];
            state.meta = null;
            state.error = null;
        },
        addFollowRequestFromNotification: (state, action: PayloadAction<FollowRequest>) => {
            const newRequest = action.payload;

            const exists = state.data.some(req => req.id === newRequest.id);

            if (!exists) {
                state.data.unshift(newRequest);

                if (state.meta) {
                    state.meta.total += 1;
                    state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
                }
            }
        },
        removeFollowRequest: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter((req) => req.id !== action.payload);

            if (state.meta) {
                state.meta.total = Math.max(0, state.meta.total - 1);
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowRequests.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload?.data || [];
                const meta = action.payload?.meta || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                };

                if (meta.page === 1) {
                    state.data = data;
                } else {
                    const newData = data.filter(newItem =>
                        !state.data.some(existingItem => existingItem.id === newItem.id)
                    );
                    state.data.push(...newData);
                }

                state.meta = meta;
            })
            .addCase(fetchFollowRequests.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch follow requests";
                state.meta = state.meta || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                };
            })
            .addCase(acceptFollowRequest.fulfilled, (state, action) => {
                state.data = state.data.filter((req) => req.id !== action.meta.arg);
                if (state.meta) {
                    state.meta.total = Math.max(0, state.meta.total - 1);
                    state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
                }
            })
            .addCase(rejectFollowRequest.fulfilled, (state, action) => {
                state.data = state.data.filter((req) => req.id !== action.payload);
                if (state.meta) {
                    state.meta.total = Math.max(0, state.meta.total - 1);
                    state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
                }
            });
    },
});

export const {
    clearFollowRequests,
    addFollowRequestFromNotification,
    removeFollowRequest
} = followRequestsSlice.actions;
export default followRequestsSlice.reducer;
