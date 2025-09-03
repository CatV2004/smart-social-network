import {
    selectRecommendations,
    selectRecommendationsError,
    selectRecommendationsLoading,
    selectRecommendationsSyncLoading,
} from '@/redux/features/recomment/recommendationSelectors';
import {
    clearRecommendations,
    clearError
} from '@/redux/features/recomment/recommendationSlice';
import {
    fetchRecommendations,
    syncRecommendations
} from '@/redux/features/recomment/recommentdationThunks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectMyProfile } from '@/redux/features/profile/profileSelectors';
import { useCallback, useRef } from 'react';

export const useRecommendations = () => {
    const dispatch = useAppDispatch();
    const recommendations = useAppSelector(selectRecommendations);
    const loading = useAppSelector(selectRecommendationsLoading);
    const syncLoading = useAppSelector(selectRecommendationsSyncLoading);
    const error = useAppSelector(selectRecommendationsError);
    const profile = useAppSelector(selectMyProfile);
    const hasSyncedRef = useRef(false);

    const getRecommendations = useCallback(async () => {
        const resultAction = await dispatch(fetchRecommendations());

        if (
            resultAction.meta.requestStatus === "fulfilled" &&
            Array.isArray(resultAction.payload) &&
            resultAction.payload.length === 0 &&
            profile?.user.id &&
            !hasSyncedRef.current
        ) {
            hasSyncedRef.current = true; 
            await dispatch(syncRecommendations({ userId: profile.user.id }));
        }

        return resultAction;
    }, [dispatch, profile]);

    // const syncForUser = useCallback((userId: string) => {
    //     return dispatch(syncRecommendations({ userId }));
    // }, [dispatch]);

    const clear = useCallback(() => {
        dispatch(clearRecommendations());
    }, [dispatch]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        recommendations,
        loading,
        syncLoading,
        error,
        getRecommendations,
        // syncForUser,
        clearRecommendations: clear,
        clearError: dismissError,
    };
};