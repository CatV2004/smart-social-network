import axiosClient from "./axiosClient";
import { ListResponse, QueryParams } from "@/types/pagination-meta";
import { MessageRead, MessageRequest, MessageResponse, MessageStatus } from "@/types/message";

export const messageApi = {

    sendMessage: (messageData: MessageRequest): Promise<MessageResponse> => {
        const formData = new FormData();
        formData.append('conversationId', messageData.conversationId);

        if (messageData.content) {
            formData.append('content', messageData.content);
        }

        if (messageData.files) {
            messageData.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        return axiosClient.post("/messages", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => res.data);
    },

    markMessagesAsRead: (
        messageId: string
    ): Promise<{ success: boolean; status: MessageStatus }> => {
        return axiosClient
            .post("/messages/read", { messageId })
            .then((res) => res.data);
    },

    getMessages: (
        conversationId: string,
        params?: QueryParams
    ): Promise<ListResponse<MessageResponse>> => {
        return axiosClient.get(`/messages/conversation/${conversationId}`, { params }).then((res) => res.data);
    },

    getMessageReads: (messageId: string): Promise<MessageRead[]> => {
        return axiosClient
            .get(`/messages/${messageId}/reads`)
            .then((res) => res.data);
    },

    getUnreadMessageIds: (conversationId: string): Promise<string[]> => {
        return axiosClient
            .get(`/messages/unread/${conversationId}`)
            .then((res) => res.data);
    },


    getMessageUnreads: (messageId: string): Promise<MessageRead[]> => {
        return axiosClient
            .get(`/messages/${messageId}/unreads`)
            .then((res) => res.data);
    },

    getUnreadCount: (): Promise<{ count: number }> => {
        return axiosClient.get("/messages/unread/count").then((res) => res.data);
    },
};
