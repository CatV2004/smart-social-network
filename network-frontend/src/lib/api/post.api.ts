import { ListResponse } from '@/types/pagination-meta';
import axiosClient from './axiosClient';
import { CreatePostPayload, CreatePostResponse, Post, UpdatePostPayload } from '@/types/post';
import { AxiosResponse } from 'axios';

const postApi = {
  getPosts: (
    page = 1,
    limit = 3,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AxiosResponse<ListResponse<Post>>> => {
    return axiosClient.get('/posts', {
      params: { page, limit, sortBy, sortOrder },
    });
  },

  getPostsByProfile: (
    profileId: string,
    page = 1,
    limit = 3,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AxiosResponse<ListResponse<Post>>> => {
    return axiosClient.get(`/posts/profile/${profileId}`, {
      params: { page, limit, sortBy, sortOrder },
    });
  },

  getPostsByUsername: (
    username: string,
    page = 1,
    limit = 3,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AxiosResponse<ListResponse<Post>>> => {
    return axiosClient.get(`/posts/user/${username}`, {
      params: { page, limit, sortBy, sortOrder },
    });
  },

  getPostForEdit(postId: string): Promise<AxiosResponse<Post>> {
    return axiosClient.get(`/posts/${postId}/edit`);
  },

  createPost: (
    data: CreatePostPayload
  ): Promise<AxiosResponse<CreatePostResponse>> => {
    return axiosClient.post('/posts', data);
  },

  likePost: (postId: string, liked: boolean) =>
    axiosClient.post('/reactions/posts/toggle', { postId, liked }),

  savePost: (postId: string, saved: boolean) =>
    axiosClient.post('/save-posts/toggle', { postId, saved }),

  getSavedPosts: (
    page = 1,
    limit = 3,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AxiosResponse<ListResponse<Post>>> => {
    return axiosClient.get(`/posts/saved`, {
      params: { page, limit, sortBy, sortOrder },
    });
  },

  deletePost: (postId: string) => axiosClient.delete("posts/" + postId),

  hardDeletePost: (postId: string) => axiosClient.delete("posts/" + postId + "/hard"),

  restorePost: (postId: string) => axiosClient.patch("posts/" + postId + "/restore"),

  getTrashPosts: (
    page = 1,
    limit = 3,
    sortBy = 'deletedAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AxiosResponse<ListResponse<Post>>> => {
    return axiosClient.get('/posts/deleted', {
      params: { page, limit, sortBy, sortOrder },
    });
  },

  updatePost: (
    postId: string,
    payload: UpdatePostPayload
  ): Promise<AxiosResponse<Post>> => {
    const formData = new FormData();

    if (payload.content) {
      formData.append('content', payload.content);
    }

    if (payload.isPinned !== undefined) {
      formData.append('isPinned', String(payload.isPinned));
    }

    if (payload.mediaToDelete && payload.mediaToDelete.length > 0) {
      payload.mediaToDelete.forEach((id) =>
        formData.append('mediaToDelete', id)
      );
    }

    if (payload.mediaToUpdate && payload.mediaToUpdate.length > 0) {
      payload.mediaToUpdate.forEach((m) =>
        formData.append('mediaToUpdate', JSON.stringify({ mediaId: m.mediaId }))
      );
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    return axiosClient.patch(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getPostsByIds: (
    ids: string[],
    page = 1,
    limit = 10,
    sortBy: keyof Post = 'createdAt',
    sortOrder: 'DESC' | 'ASC' = 'DESC'
  ): Promise<AxiosResponse<ListResponse<Post>>> => {
    return axiosClient.get('/posts/by-ids', {
      params: {
        ids: ids.join(','),
        page,
        limit,
        sortBy,
        sortOrder,
      },
      paramsSerializer: params =>
        Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&'),
    });
  },



};
export default postApi;
