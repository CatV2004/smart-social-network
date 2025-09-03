import { RootState } from '@/redux/store';

export const selectRecommendationsState = (state: RootState) => state.recommendations;

export const selectRecommendations = (state: RootState) =>
    selectRecommendationsState(state).recommendations;

export const selectRecommendationsLoading = (state: RootState) =>
    selectRecommendationsState(state).loading;

export const selectRecommendationsError = (state: RootState) =>
    selectRecommendationsState(state).error;

export const selectRecommendationsSyncLoading = (state: RootState) =>
  selectRecommendationsState(state).syncLoading;