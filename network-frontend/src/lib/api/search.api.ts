// src/api/searchApi.ts
import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { ListResponse } from '@/types/pagination-meta';
import { SearchResultDto, UserSearchDto } from '@/types/search';
import { PostSearchDto } from '@/types/search';

interface SearchUsersParams {
    query: string;
    page?: number;
    limit?: number;
}

interface SearchPostsParams {
    query: string;
    page?: number;
    limit?: number;
}

interface SearchParams {
    q: string;
}

const searchApi = {
    searchUsers: (
        params: SearchUsersParams
    ): Promise<AxiosResponse<ListResponse<UserSearchDto>>> => {
        return axiosClient.get('/search/users', {
            params: {
                query: params.query,
                page: params.page || 1,
                limit: params.limit || 10,
            },
        });
    },

    searchPosts: (
        params: SearchPostsParams
    ): Promise<AxiosResponse<ListResponse<PostSearchDto>>> => {
        return axiosClient.get('/search/posts', {
            params: {
                q: params.query,
                page: params.page || 1,
                limit: params.limit || 10,
            },
        });
    },

    searchAll: (
        params: SearchParams
    ): Promise<AxiosResponse<SearchResultDto[]>> => {
        return axiosClient.get('/search', {
            params: {
                q: params.q,
            },
        });
    },
};

export default searchApi;
