import { createAsyncThunk } from '@reduxjs/toolkit';
import { Profile, ProfileUpdatePayload } from '@/types/profile';
import profileApi from '@/lib/api/profile.api';

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getMyProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  'profile/updateMyProfile',
  async (data: ProfileUpdatePayload, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);