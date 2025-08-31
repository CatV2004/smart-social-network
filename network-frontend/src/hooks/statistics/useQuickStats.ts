// src/hooks/statistics/useQuickStats.ts
import { useState, useEffect } from 'react';
import { StatsFollowApi } from '@/lib/api/statistics/statsFollow.api';

export interface QuickStats {
    totalFollowers: number;
    totalFollowing: number;
    mutualRate: number;
    rejectedRate: number;
    loading: boolean;
    error: string | null;
}

export const useQuickStats = () => {
    const [stats, setStats] = useState<QuickStats>({
        totalFollowers: 0,
        totalFollowing: 0,
        mutualRate: 0,
        rejectedRate: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchQuickStats = async () => {
            try {
                const [followersRes, followingRes, mutualRes, rejectedRes] = await Promise.all([
                    StatsFollowApi.getTopFollowers(5),
                    StatsFollowApi.getTopFollowing(5),
                    StatsFollowApi.getMutualRate(),
                    StatsFollowApi.getRejectedRate(),
                ]);

                const totalFollowers = followersRes.data.reduce((sum, f) => sum + parseInt(f.followers_count), 0);
                const totalFollowing = followingRes.data.reduce((sum, f) => sum + parseInt(f.following_count), 0);

                setStats({
                    totalFollowers,
                    totalFollowing,
                    mutualRate: mutualRes.data?.rate || 0,
                    rejectedRate: rejectedRes.data?.rate || 0,
                    loading: false,
                    error: null,
                });
            } catch (err: any) {
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: err.response?.data?.message || 'Failed to fetch quick stats',
                }));
            }
        };

        fetchQuickStats();
    }, []);

    return stats;
};