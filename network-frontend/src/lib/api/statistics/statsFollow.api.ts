import {
    UserStatusStat,
    UserVerificationStat,
    NewUsersStat,
    GenderStat,
    AgeGroupStat,
    PeriodType,
    TopFollower,
    TopFollowing,
    FollowGrowthStat,
    MutualRateStat,
    FollowStatusDistribution,
    RejectedRateStat,
} from '@/types/statistics';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

class statsFollowApi {

    // Get top followers
    getTopFollowers = (limit: number = 10): Promise<AxiosResponse<TopFollower[]>> => {
        return axiosClient.get(`/statistics/follows/top-followers?limit=${limit}`);
    };

    // Get top following
    getTopFollowing = (limit: number = 10): Promise<AxiosResponse<TopFollowing[]>> => {
        return axiosClient.get(`/statistics/follows/top-following?limit=${limit}`);
    };

    // Get follow growth statistics
    getFollowGrowth = (period: 'day' | 'week' | 'month' = 'day'): Promise<AxiosResponse<FollowGrowthStat[]>> => {
        return axiosClient.get(`/statistics/follows/growth?period=${period}`);
    };

    // Get mutual follow rate
    getMutualRate = (): Promise<AxiosResponse<MutualRateStat>> => {
        return axiosClient.get('/statistics/follows/mutual-rate');
    };

    // Get follow status distribution
    getFollowStatusDistribution = (): Promise<AxiosResponse<FollowStatusDistribution[]>> => {
        return axiosClient.get('/statistics/follows/status-distribution');
    };

    // Get rejected follow rate
    getRejectedRate = (): Promise<AxiosResponse<RejectedRateStat>> => {
        return axiosClient.get('/statistics/follows/rejected-rate');
    };

    // Get all follow statistics in one call (optional - if you want to get everything at once)
    getAllFollowStatistics = async (): Promise<{
        topFollowers: TopFollower[];
        topFollowing: TopFollowing[];
        growth: FollowGrowthStat[];
        mutualRate: MutualRateStat;
        statusDistribution: FollowStatusDistribution[];
        rejectedRate: RejectedRateStat;
    }> => {
        const [topFollowers, topFollowing, growth, mutualRate, statusDistribution, rejectedRate] = await Promise.all([
            this.getTopFollowers(),
            this.getTopFollowing(),
            this.getFollowGrowth('week'),
            this.getMutualRate(),
            this.getFollowStatusDistribution(),
            this.getRejectedRate(),
        ]);

        return {
            topFollowers: topFollowers.data,
            topFollowing: topFollowing.data,
            growth: growth.data,
            mutualRate: mutualRate.data,
            statusDistribution: statusDistribution.data,
            rejectedRate: rejectedRate.data,
        };
    };
}

export const StatsFollowApi = new statsFollowApi();