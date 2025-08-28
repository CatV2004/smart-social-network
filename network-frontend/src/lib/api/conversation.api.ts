import { conversationRequest, conversationResponse } from "@/types/conversation";
import axiosClient from "./axiosClient";
import { ListResponse, QueryParams } from "@/types/pagination-meta";
import { MemberListResponse } from "@/types/member";

export const conversationApi = {
    createConversation: (conversation: conversationRequest): Promise<conversationResponse> => {
        return axiosClient.post("/conversations", conversation).then((res) => res.data);
    },

    getConversations: (params?: QueryParams): Promise<ListResponse<conversationResponse>> => {
        return axiosClient.get("/conversations", { params }).then((res) => res.data);
    },

    getConversationById: (id: string): Promise<conversationResponse> => {
        return axiosClient.get(`/conversations/${id}`).then((res) => res.data);
    },

    getConversationMembers: (
        conversationId: string,
        params?: QueryParams
    ): Promise<MemberListResponse> => {
        return axiosClient.get(`/conversations/${conversationId}/members`, { params }).then((res) => res.data);
    },

    markConversationAsRead: (conversationId: string): Promise<{ success: boolean; markedCount: number }> => {
        return axiosClient
            .post(`/conversations/${conversationId}/read`)
            .then((res) => res.data);
    },

    markConversationAsUnread: (
        conversationId: string,
    ): Promise<{ success: boolean; markedCount: number }> => {
        return axiosClient
            .post(`/conversations/${conversationId}/unread`)
            .then((res) => res.data);
    },


}