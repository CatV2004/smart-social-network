import { createAsyncThunk } from "@reduxjs/toolkit";
import { QueryParams } from "@/types/pagination-meta";
import { MessageRead, MessageRequest, MessageStatus } from "@/types/message";
import { messageApi } from "@/lib/api/message.api";

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageData: MessageRequest, { rejectWithValue }) => {
        try {
            return await messageApi.sendMessage(messageData);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to send message'
            );
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (
        {
            conversationId,
            params
        }: {
            conversationId: string;
            params?: QueryParams;
        },
        { rejectWithValue }
    ) => {
        try {
            return await messageApi.getMessages(conversationId, params);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch messages'
            );
        }
    }
);

export const markMessageAsRead = createAsyncThunk<
    { success: boolean; status: MessageStatus },
    { messageId: string }
>(
    "messages/markMessagesAsRead",
    async ({ messageId }, { rejectWithValue }) => {
        try {
            return await messageApi.markMessagesAsRead(messageId);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to mark messages as read"
            );
        }
    }
);

export const getMessageReads = createAsyncThunk<
    MessageRead[],
    string,
    { rejectValue: string }
>(
    "messages/getMessageReads",
    async (messageId, { rejectWithValue }) => {
        try {
            return await messageApi.getMessageReads(messageId);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch message reads"
            );
        }
    }
);

export const getUnreadCount = createAsyncThunk<
    number, 
    void,  
    { rejectValue: string }
>(
    "messages/getUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const res = await messageApi.getUnreadCount();
            return res.count;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch unread count"
            );
        }
    }
);