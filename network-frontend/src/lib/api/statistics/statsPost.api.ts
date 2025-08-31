import {
    PostOverview,
    PostByDay,
    TopPost,
    GenderStat,
    AgeGroupStat,
} from '@/types/statistics';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

class StatsPostApi {
    // Get post overview statistics
    getPostOverview = (): Promise<AxiosResponse<PostOverview>> => {
        return axiosClient.get('/statistics/post/overview');
    };

    // Get posts by day statistics
    getPostsByDay = (): Promise<AxiosResponse<PostByDay[]>> => {
        return axiosClient.get('/statistics/post/by-day');
    };

    // Get top liked posts
    getTopLikedPosts = (limit: number = 5): Promise<AxiosResponse<TopPost[]>> => {
        return axiosClient.get(`/statistics/post/top-liked?limit=${limit}`);
    };

    // Get top commented posts
    getTopCommentedPosts = (limit: number = 5): Promise<AxiosResponse<TopPost[]>> => {
        return axiosClient.get(`/statistics/post/top-commented?limit=${limit}`);
    };

    // Get most saved posts
    getMostSavedPosts = (limit: number = 5): Promise<AxiosResponse<TopPost[]>> => {
        return axiosClient.get(`/statistics/post/most-saved?limit=${limit}`);
    };

    // Get posts by gender statistics
    getPostsByGender = (): Promise<AxiosResponse<GenderStat[]>> => {
        return axiosClient.get('/statistics/post/by-gender');
    };

    // Get posts by age group statistics
    getPostsByAgeGroup = (): Promise<AxiosResponse<AgeGroupStat[]>> => {
        return axiosClient.get('/statistics/post/by-age-group');
    };
}

export default new StatsPostApi();