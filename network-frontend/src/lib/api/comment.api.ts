// lib/api/comment.api.ts
import { Comment, CreateCommentPayload, CreateCommentResponse } from '@/types/comment';
import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { ListResponse } from '@/types/pagination-meta';

const commentApi = {
    // Lấy danh sách comment cấp 1 (top-level) của 1 post
    getCommentsByPost: (
        postId: string,
        page = 1,
        limit = 10,
    ): Promise<AxiosResponse<ListResponse<Comment>>> => {
        return axiosClient.get(`/comments/post/${postId}`, {
            params: { page, limit },
        });
    },

    // Lấy replies (cấp con) của 1 comment
    getReplies: (
        commentId: string,
        page = 1,
        limit = 5
    ): Promise<AxiosResponse<ListResponse<Comment>>> => {
        return axiosClient.get(`/comments/${commentId}/replies`, {
            params: { page, limit },
        });
    },

    // Tạo comment mới
    createComment: (
        data: CreateCommentPayload
    ): Promise<AxiosResponse<CreateCommentResponse>> => {
        return axiosClient.post('/comments', data);
    },

    // Chỉnh sửa comment
    updateComment: (
        commentId: string,
        content: string
    ): Promise<AxiosResponse<Comment>> => {
        return axiosClient.patch(`/comments/${commentId}`, { content });
    },

    // Xóa comment
    deleteComment: (commentId: string): Promise<AxiosResponse<void>> => {
        return axiosClient.delete(`/comments/${commentId}`);
    },
};

export default commentApi;
