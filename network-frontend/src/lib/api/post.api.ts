import axiosClient from './axiosClient';
import { CreatePostPayload, CreatePostResponse, PostListResponse } from '@/types/post';
import { AxiosResponse } from 'axios';

const postApi = {
  getPosts: (
    page = 1,
    limit = 3,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AxiosResponse<PostListResponse>> => {
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
  ): Promise<AxiosResponse<PostListResponse>> => {
    return axiosClient.get(`/posts/profile/${profileId}`, {
      params: { page, limit, sortBy, sortOrder },
    });
  },

  createPost: (
    data: CreatePostPayload
  ): Promise<AxiosResponse<CreatePostResponse>> => {
    return axiosClient.post('/posts', data);
  },
};

export default postApi;
