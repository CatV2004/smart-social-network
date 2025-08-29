import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageRead, MessageResponse } from '@/types/message';
import { PaginationMeta } from '@/types/pagination-meta';
import { fetchMessages, getMessageReads, markMessageAsRead, sendMessage } from '../thunks/messageThunks';

interface MessageState {
    messages: MessageResponse[];
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
    messageReads: Record<string, MessageRead[]>;
}

const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,
    pagination: null,
    messageReads: {},
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<MessageResponse>) => {
            const existingIndex = state.messages.findIndex(
                msg => msg.id === action.payload.id
            );

            if (existingIndex === -1) {
                state.messages.unshift(action.payload);
                if (state.pagination) {
                    state.pagination.total += 1;
                    state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                }
            }
        },
        clearMessages: (state) => {
            state.messages = [];
            state.pagination = {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 1,
            };
            state.messageReads = {};
        },
        resetMessagesPagination: (state) => {
            state.pagination = {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 1,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
                if (state.pagination?.page === 1 || state.messages.length === 0) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload.data || [];
                const meta = action.payload?.meta || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                };

                if (meta.page === 1) {
                    state.messages = data;
                } else {
                    state.messages = [...state.messages, ...data];
                }
                state.pagination = meta;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;

                state.pagination = state.pagination || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                };
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages.unshift(action.payload);
                if (state.pagination) {
                    state.pagination.total += 1;
                    state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string;
            })
            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                const messageId = action.meta.arg.messageId;
                state.messages = state.messages.map((msg) => {
                    if (msg.id === messageId) {
                        return { ...msg, status: action.payload.status };
                    }
                    return msg;
                });
            })
            .addCase(getMessageReads.fulfilled, (state, action) => {
                const messageId = action.meta.arg;
                state.messageReads[messageId] = action.payload;
            });
    },
});

export const {
    addMessage,
    clearMessages,
    resetMessagesPagination,
} = messageSlice.actions;
export default messageSlice.reducer;