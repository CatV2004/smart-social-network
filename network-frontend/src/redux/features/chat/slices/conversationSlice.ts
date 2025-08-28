import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { conversationResponse } from '@/types/conversation';
import { fetchConversations, createConversation } from '../thunks/conversationThunks';
import { PaginationMeta } from '@/types/pagination-meta';

interface ConversationState {
    conversations: conversationResponse[];
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta;
}

const initialState: ConversationState = {
    conversations: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    },
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        addConversation: (state, action: PayloadAction<conversationResponse>) => {
            const existingIndex = state.conversations.findIndex(c => c.id === action.payload.id);
            if (existingIndex === -1) {
                state.conversations.unshift(action.payload);
                state.pagination.total += 1;
                state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
            }
        },
        resetConversations: (state) => {
            state.conversations = [];
            state.pagination = {
                total: 0,
                page: 1,
                limit: state.pagination.limit,
                totalPages: 1,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload?.data || [];
                const meta = action.payload?.meta || {
                    page: 1,
                    limit: state.pagination.limit,
                    total: 0,
                    totalPages: 0,
                };

                // Xử lý phân trang: append data khi page > 1, replace data khi page = 1
                if (meta.page === 1) {
                    state.conversations = data;
                } else {
                    // Merge data, tránh trùng lặp
                    const existingIds = new Set(state.conversations.map(c => c.id));
                    const newConversations = data.filter(conv => !existingIds.has(conv.id));
                    state.conversations.push(...newConversations);
                }
                state.pagination = meta;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;

                // Giữ lại pagination cũ nếu có lỗi
                state.pagination = state.pagination || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                };
            })
            .addCase(createConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createConversation.fulfilled, (state, action) => {
                const existingIndex = state.conversations.findIndex(c => c.id === action.payload.id);
                if (existingIndex === -1) {
                    state.conversations.unshift(action.payload);
                    state.pagination.total += 1;
                    state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                }
            })
            .addCase(createConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const {
    addConversation,
    resetConversations,
} = conversationSlice.actions;
export default conversationSlice.reducer;