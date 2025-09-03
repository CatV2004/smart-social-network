import { recommendationApi } from "@/lib/api/AI/recommentdation.api";
import { Recommendation } from "@/types/recommentdation";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recommendationApi.getRecommendations();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const syncRecommendations = createAsyncThunk<
  Recommendation[],
  { userId: string; algorithm?: string; topN?: number },
  { rejectValue: string }
>(
  'recommendations/syncRecommendations',
  async ({ userId, algorithm = "common_neighbors", topN = 5 }, { rejectWithValue }) => {
    console.log("userID in thunkkssss: ", userId)
    try {
      const response = await recommendationApi.syncRecommendations(userId, algorithm, topN);
      console.log("response recommendation in thunkssss: ", response)
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync recommendations');
    }
  }
)

export const removeRecommendation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'recommendations/removeRecommendation',
  async (recommendationId, { rejectWithValue }) => {
    try {
      const response = await recommendationApi.removeById(recommendationId);
      console.log("response: ", response)
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove recommendation');
    }
  }
);