import { useState, useEffect } from 'react';
import {
    TopFollower,
    TopFollowing,
    FollowGrowthStat,
    MutualRateStat,
    FollowStatusDistribution,
    RejectedRateStat,
} from '@/types/statistics';
import { StatsFollowApi } from '@/lib/api/statistics/statsFollow.api'; 

// Hook cho top followers
export const useTopFollowers = (limit: number = 10) => {
    const [data, setData] = useState<TopFollower[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopFollowers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StatsFollowApi.getTopFollowers(limit);
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch top followers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopFollowers();
    }, [limit]);

    const refetch = () => {
        fetchTopFollowers();
    };

    return { data, loading, error, refetch };
};

// Hook cho top following
export const useTopFollowing = (limit: number = 10) => {
    const [data, setData] = useState<TopFollowing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopFollowing = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StatsFollowApi.getTopFollowing(limit);
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch top following');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopFollowing();
    }, [limit]);

    const refetch = () => {
        fetchTopFollowing();
    };

    return { data, loading, error, refetch };
};

// Hook cho follow growth
export const useFollowGrowth = (period: 'day' | 'week' | 'month' = 'day') => {
    const [data, setData] = useState<FollowGrowthStat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGrowth = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StatsFollowApi.getFollowGrowth(period);
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch follow growth');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrowth();
    }, [period]);

    const refetch = () => {
        fetchGrowth();
    };

    return { data, loading, error, refetch, period };
};

// Hook cho mutual rate
export const useMutualRate = () => {
    const [data, setData] = useState<MutualRateStat | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMutualRate = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StatsFollowApi.getMutualRate();
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch mutual rate');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMutualRate();
    }, []);

    const refetch = () => {
        fetchMutualRate();
    };

    return { data, loading, error, refetch };
};

// Hook cho follow status distribution
export const useFollowStatusDistribution = () => {
    const [data, setData] = useState<FollowStatusDistribution[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatusDistribution = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StatsFollowApi.getFollowStatusDistribution();
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch status distribution');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatusDistribution();
    }, []);

    const refetch = () => {
        fetchStatusDistribution();
    };

    return { data, loading, error, refetch };
};

// Hook cho rejected rate
export const useRejectedRate = () => {
    const [data, setData] = useState<RejectedRateStat | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRejectedRate = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StatsFollowApi.getRejectedRate();
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch rejected rate');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRejectedRate();
    }, []);

    const refetch = () => {
        fetchRejectedRate();
    };

    return { data, loading, error, refetch };
};

// Hook tổng hợp cho tất cả follow statistics
export const useAllFollowStatistics = () => {
    const [data, setData] = useState<{
        topFollowers: TopFollower[];
        topFollowing: TopFollowing[];
        growth: FollowGrowthStat[];
        mutualRate: MutualRateStat | null;
        statusDistribution: FollowStatusDistribution[];
        rejectedRate: RejectedRateStat | null;
    }>({
        topFollowers: [],
        topFollowing: [],
        growth: [],
        mutualRate: null,
        statusDistribution: [],
        rejectedRate: null,
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await StatsFollowApi.getAllFollowStatistics();
            setData(result);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch all follow statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllStatistics();
    }, []);

    const refetch = () => {
        fetchAllStatistics();
    };

    return { data, loading, error, refetch };
};

// Hook có thể tùy chỉnh với options
interface UseFollowStatisticsOptions {
    enabled?: boolean;
    refetchInterval?: number;
}

export const useFollowStatistics = (options?: UseFollowStatisticsOptions) => {
    const { enabled = true, refetchInterval } = options || {};

    const topFollowers = useTopFollowers(10);
    const topFollowing = useTopFollowing(10);
    const growth = useFollowGrowth('week');
    const mutualRate = useMutualRate();
    const statusDistribution = useFollowStatusDistribution();
    const rejectedRate = useRejectedRate();

    const loading = topFollowers.loading || topFollowing.loading || growth.loading ||
        mutualRate.loading || statusDistribution.loading || rejectedRate.loading;

    const error = topFollowers.error || topFollowing.error || growth.error ||
        mutualRate.error || statusDistribution.error || rejectedRate.error;

    const refetch = () => {
        topFollowers.refetch();
        topFollowing.refetch();
        growth.refetch();
        mutualRate.refetch();
        statusDistribution.refetch();
        rejectedRate.refetch();
    };

    // Auto refetch với interval
    useEffect(() => {
        if (!refetchInterval || !enabled) return;

        const interval = setInterval(() => {
            refetch();
        }, refetchInterval);

        return () => clearInterval(interval);
    }, [refetchInterval, enabled]);

    return {
        topFollowers: topFollowers.data,
        topFollowing: topFollowing.data,
        growth: growth.data,
        mutualRate: mutualRate.data,
        statusDistribution: statusDistribution.data,
        rejectedRate: rejectedRate.data,
        loading,
        error,
        refetch,
    };
};