import { Recommendation } from '@/types/recommentdation';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRecommendations, removeRecommendation, syncRecommendations } from './recommentdationThunks';

interface RecommendationState {
    recommendations: Recommendation[];
    loading: boolean;
    syncLoading: boolean;
    error: string | null;
}

const initialState: RecommendationState = {
    recommendations: [],
    loading: false,
    syncLoading: false,
    error: null,
};


const recommendationSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {
        clearRecommendations: (state) => {
            state.recommendations = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch recommendations
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
                state.loading = false;
                state.recommendations = action.payload;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(syncRecommendations.pending, (state) => {
                state.syncLoading = true;
                state.error = null;
            })
            .addCase(syncRecommendations.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
                state.syncLoading = false;
                state.recommendations = action.payload;
            })
            .addCase(syncRecommendations.rejected, (state, action) => {
                state.syncLoading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(removeRecommendation.pending, (state) => {
                state.error = null;
            })
            .addCase(removeRecommendation.fulfilled, (state, action) => {
                const recommendationId = action.meta.arg;
                console.log("recommendationId in slice: ", recommendationId)
                state.recommendations = state.recommendations.filter(
                    (rec) => rec.id !== recommendationId
                );
            })
            .addCase(removeRecommendation.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearRecommendations, clearError } = recommendationSlice.actions;
export default recommendationSlice.reducer;