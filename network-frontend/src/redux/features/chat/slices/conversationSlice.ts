import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { conversationResponse } from '@/types/conversation';
import { fetchConversations, createConversation, markConversationAsRead } from '../thunks/conversationThunks';
import { PaginationMeta } from '@/types/pagination-meta';
import { MessageResponse } from '@/types/message';
import { ConservationService } from '@/services/conversation.service';

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
        updateConversationLastMessage: (
            state,
            action: PayloadAction<{ conversationId: string; lastMessage: MessageResponse }>
        ) => {
            const { conversationId, lastMessage } = action.payload;
            const index = state.conversations.findIndex(c => c.id === conversationId);
            if (index !== -1) {
                state.conversations[index].lastMessage = ConservationService.mapToSummary(lastMessage);
                state.conversations[index].updatedAt = lastMessage.createdAt;
                const updatedConv = state.conversations.splice(index, 1)[0];
                state.conversations.unshift(updatedConv);
            }
        },
        inCreaseUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
            const conversationId = action.payload.conversationId
            const index = state.conversations.findIndex(c => c.id === conversationId)
            if (index !== -1) {
                state.conversations[index].unreadCount += 1;
            }
        },
        deCreaseUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
            const conversationId = action.payload.conversationId
            const index = state.conversations.findIndex(c => c.id === conversationId)
            if (index !== -1) {
                state.conversations[index].unreadCount -= 1;
            }
        }
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
            .addCase(markConversationAsRead.fulfilled, (state, action) => {
                const conversationId = action.meta.arg;
                const index = state.conversations.findIndex(c => c.id === conversationId);
                if (index !== -1) {
                    state.conversations[index].unreadCount = 0;
                }
            })
    },
});

export const {
    addConversation,
    resetConversations,
    updateConversationLastMessage,
    inCreaseUnreadCount,
    deCreaseUnreadCount
} = conversationSlice.actions;
export default conversationSlice.reducer;