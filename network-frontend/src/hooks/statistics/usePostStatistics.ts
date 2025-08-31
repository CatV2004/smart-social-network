import { useState, useEffect, useCallback } from 'react';
import {
    PostOverview,
    PostByDay,
    TopPost,
    GenderStat,
    AgeGroupStat,
} from '@/types/statistics';
import statsPostApi from '@/lib/api/statistics/statsPost.api';

interface PostStatisticsState {
    overview: PostOverview | null;
    postsByDay: PostByDay[];
    topLiked: TopPost[];
    topCommented: TopPost[];
    mostSaved: TopPost[];
    byGender: GenderStat[];
    byAgeGroup: AgeGroupStat[];
    loading: boolean;
    error: string | null;
}

interface UsePostStatisticsReturn extends PostStatisticsState {
    fetchAllStatistics: () => Promise<void>;
    fetchOverview: () => Promise<void>;
    fetchPostsByDay: () => Promise<void>;
    fetchTopLiked: (limit?: number) => Promise<void>;
    fetchTopCommented: (limit?: number) => Promise<void>;
    fetchMostSaved: (limit?: number) => Promise<void>;
    fetchByGender: () => Promise<void>;
    fetchByAgeGroup: () => Promise<void>;
    refetchAll: () => Promise<void>;
}

export const usePostStatistics = (): UsePostStatisticsReturn => {
    const [state, setState] = useState<PostStatisticsState>({
        overview: null,
        postsByDay: [],
        topLiked: [],
        topCommented: [],
        mostSaved: [],
        byGender: [],
        byAgeGroup: [],
        loading: false,
        error: null,
    });

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error }));
    };

    const fetchOverview = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getPostOverview();
            setState(prev => ({ ...prev, overview: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch post overview');
            console.error('Error fetching post overview:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPostsByDay = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getPostsByDay();
            setState(prev => ({ ...prev, postsByDay: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch posts by day');
            console.error('Error fetching posts by day:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTopLiked = useCallback(async (limit: number = 5): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getTopLikedPosts(limit);
            setState(prev => ({ ...prev, topLiked: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch top liked posts');
            console.error('Error fetching top liked posts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTopCommented = useCallback(async (limit: number = 5): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getTopCommentedPosts(limit);
            setState(prev => ({ ...prev, topCommented: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch top commented posts');
            console.error('Error fetching top commented posts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMostSaved = useCallback(async (limit: number = 5): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getMostSavedPosts(limit);
            setState(prev => ({ ...prev, mostSaved: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch most saved posts');
            console.error('Error fetching most saved posts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByGender = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getPostsByGender();
            setState(prev => ({ ...prev, byGender: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch posts by gender');
            console.error('Error fetching posts by gender:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByAgeGroup = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await statsPostApi.getPostsByAgeGroup();
            setState(prev => ({ ...prev, byAgeGroup: response.data }));
            setError(null);
        } catch (err) {
            setError('Failed to fetch posts by age group');
            console.error('Error fetching posts by age group:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllStatistics = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            await Promise.all([
                fetchOverview(),
                fetchPostsByDay(),
                fetchTopLiked(),
                fetchTopCommented(),
                fetchMostSaved(),
                fetchByGender(),
                fetchByAgeGroup(),
            ]);

        } catch (err) {
            setError('Failed to fetch all post statistics');
            console.error('Error fetching all post statistics:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchOverview, fetchPostsByDay, fetchTopLiked, fetchTopCommented, fetchMostSaved, fetchByGender, fetchByAgeGroup]);

    const refetchAll = useCallback(async (): Promise<void> => {
        await fetchAllStatistics();
    }, [fetchAllStatistics]);

    // Fetch all data on mount
    useEffect(() => {
        fetchAllStatistics();
    }, [fetchAllStatistics]);

    return {
        ...state,
        fetchAllStatistics,
        fetchOverview,
        fetchPostsByDay,
        fetchTopLiked,
        fetchTopCommented,
        fetchMostSaved,
        fetchByGender,
        fetchByAgeGroup,
        refetchAll,
    };
};

// Individual hooks for specific data if needed
export const usePostOverview = () => {
    const [overview, setOverview] = useState<PostOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            const response = await statsPostApi.getPostOverview();
            setOverview(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch post overview');
            console.error('Error fetching post overview:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return { overview, loading, error, refetch: fetchOverview };
};

export const useTopLikedPosts = (limit: number = 5) => {
    const [topLiked, setTopLiked] = useState<TopPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopLiked = useCallback(async () => {
        try {
            setLoading(true);
            const response = await statsPostApi.getTopLikedPosts(limit);
            setTopLiked(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch top liked posts');
            console.error('Error fetching top liked posts:', err);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchTopLiked();
    }, [fetchTopLiked]);

    return { topLiked, loading, error, refetch: fetchTopLiked };
};