import { createAsyncThunk } from '@reduxjs/toolkit';
import { conversationApi } from '@/lib/api/conversation.api';
import { QueryParams } from '@/types/pagination-meta';
import { conversationRequest } from '@/types/conversation';

export const fetchConversations = createAsyncThunk(
    'conversation/fetchConversations',
    async (params: QueryParams, { rejectWithValue }) => {
        try {
            const response = await conversationApi.getConversations(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
        }
    }
);

export const createConversation = createAsyncThunk(
    'conversation/createConversation',
    async (conversationData: conversationRequest, { rejectWithValue }) => {
        try {
            return await conversationApi.createConversation(conversationData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
        }
    }
);

export const fetchConversationById = createAsyncThunk(
    'conversation/fetchConversationById',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            return await conversationApi.getConversationById(conversationId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
        }
    }
);

export const markConversationAsRead = createAsyncThunk<
    { success: boolean; markedCount: number },
    string
>(
    'conversation/markAsRead',
    async (conversationId, { rejectWithValue }) => {
        try {
            const res = await conversationApi.markConversationAsRead(conversationId);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark conversation as read');
        }
    }
);

export const markConversationAsUnread = createAsyncThunk<
    { success: boolean; markedCount: number },
    string
>(
    'conversation/markAsUnread',
    async (conversationId, { rejectWithValue, dispatch }) => {
        try {
            const res = await conversationApi.markConversationAsUnread(conversationId);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark conversation as unread');
        }
    }
);
