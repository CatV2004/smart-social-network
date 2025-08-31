import {
    UserStatusStat,
    UserVerificationStat,
    NewUsersStat,
    GenderStat,
    AgeGroupStat,
    PeriodType,
} from '@/types/statistics';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

class statsUserProfile {
    // Get user status statistics
    getUserStatusStats = (): Promise<AxiosResponse<UserStatusStat[]>> => {
        return axiosClient.get('/statistics/users/status');
    };

    // Get total users count
    getTotalUsers = (): Promise<AxiosResponse<number>> => {
        return axiosClient.get('/statistics/users/total');
    };

    // Get user verification statistics
    getUserVerificationStats = (): Promise<AxiosResponse<UserVerificationStat>> => {
        return axiosClient.get('/statistics/users/verified');
    };

    // Get new users statistics by period
    getNewUsersStats = (period: PeriodType = 'month'): Promise<AxiosResponse<NewUsersStat[]>> => {
        return axiosClient.get('/statistics/users/new', { params: { period } });
    };

    // Get gender distribution statistics
    getGenderStats = (): Promise<AxiosResponse<GenderStat[]>> => {
        return axiosClient.get('/statistics/profiles/gender');
    };

    // Get age distribution statistics
    getAgeStats = (): Promise<AxiosResponse<AgeGroupStat[]>> => {
        return axiosClient.get('/statistics/profiles/age');
    };

    // Get all statistics at once
    getAllStatistics = async (period: PeriodType = 'month') => {
        try {
            const [
                userStatus,
                totalUsers,
                userVerification,
                newUsers,
                genderDistribution,
                ageDistribution,
            ] = await Promise.all([
                this.getUserStatusStats(),
                this.getTotalUsers(),
                this.getUserVerificationStats(),
                this.getNewUsersStats(period),
                this.getGenderStats(),
                this.getAgeStats(),
            ]);

            return {
                userStatus: userStatus.data,
                totalUsers: totalUsers.data,
                userVerification: userVerification.data,
                newUsers: newUsers.data,
                genderDistribution: genderDistribution.data,
                ageDistribution: ageDistribution.data,
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error');
        }
    };


}

export const StatsUserProfile = new statsUserProfile();
