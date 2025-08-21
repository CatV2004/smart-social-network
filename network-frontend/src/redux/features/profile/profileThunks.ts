import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProfileUpdatePayload } from '@/types/profile';
import profileApi from '@/lib/api/profile.api';
import { profileService } from '@/services/profile.service';

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
  async (data: ProfileUpdatePayload & { avatar?: File; coverImage?: File }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
