
import { createAsyncThunk } from '@reduxjs/toolkit';
import { conversationApi } from '@/lib/api/conversation.api';
import { QueryParams } from '@/types/pagination-meta';

export const fetchConversationMembers = createAsyncThunk(
    'chat/fetchConversationMembers',
    async ({ conversationId, params }: { conversationId: string; params?: QueryParams }, { rejectWithValue }) => {
        try {
            return await conversationApi.getConversationMembers(conversationId, params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch members');
        }
    }
);
