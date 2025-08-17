import { ListResponse } from '@/types/pagination-meta';
import axiosClient from './axiosClient';
import { CreatePostPayload, CreatePostResponse, Post } from '@/types/post';
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

  createPost: (
    data: CreatePostPayload
  ): Promise<AxiosResponse<CreatePostResponse>> => {
    return axiosClient.post('/posts', data);
  },

  likePost: (postId: string, liked: boolean) =>
    axiosClient.post('/reactions/posts/toggle', { postId, liked }),

  savePost: (postId: string, saved: boolean) =>
    axiosClient.post('/save-posts/toggle', { postId, saved }),
};

export default postApi;
