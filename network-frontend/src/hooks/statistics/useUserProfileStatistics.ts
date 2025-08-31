import { useState, useEffect } from 'react';
import {
    UserStatusStat,
    UserVerificationStat,
    NewUsersStat,
    GenderStat,
    AgeGroupStat,
    PeriodType
} from '@/types/statistics';
import { AxiosResponse } from 'axios';
import { StatsUserProfile } from '@/lib/api/statistics/statsUserProfile.api';

interface AllStatistics {
    userStatus: UserStatusStat[];
    totalUsers: number;
    userVerification: UserVerificationStat;
    newUsers: NewUsersStat[];
    genderDistribution: GenderStat[];
    ageDistribution: AgeGroupStat[];
}

export const useUserProfileStatistics = (period: PeriodType = 'month') => {
    const [data, setData] = useState<AllStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);
                const stats = await StatsUserProfile.getAllStatistics(period);
                setData(stats); 
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [period]);

    return { data, loading, error };
};

export const useUserStatusStats = () => {
    const [data, setData] = useState<UserStatusStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats: AxiosResponse<UserStatusStat[]> = await StatsUserProfile.getUserStatusStats();
                setData(stats.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user status stats');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Hook cho gender stats
export const useGenderStats = () => {
    const [data, setData] = useState<GenderStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats: AxiosResponse<GenderStat[]> = await StatsUserProfile.getGenderStats();
                setData(stats.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch gender stats');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Hook cho age stats
export const useAgeStats = () => {
    const [data, setData] = useState<AgeGroupStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats: AxiosResponse<AgeGroupStat[]> = await StatsUserProfile.getAgeStats();
                setData(stats.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch age stats');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Hook cho verification stats
export const useVerificationStats = () => {
    const [data, setData] = useState<UserVerificationStat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats: AxiosResponse<UserVerificationStat> = await StatsUserProfile.getUserVerificationStats();
                setData(stats.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch verification stats');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Hook cho new users stats
export const useNewUsersStats = (period: PeriodType = 'month') => {
    const [data, setData] = useState<NewUsersStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats: AxiosResponse<NewUsersStat[]> = await StatsUserProfile.getNewUsersStats(period);
                setData(stats.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch new users stats');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]);

    return { data, loading, error };
};

// Hook cho total users
export const useTotalUsers = () => {
    const [data, setData] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const total: AxiosResponse<number> = await StatsUserProfile.getTotalUsers();
                setData(total.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch total users');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
