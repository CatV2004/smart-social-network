import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProfileUpdatePayload } from '@/types/profile';
import profileApi from '@/lib/api/profile.api';
import { profileService } from '@/services/profile.service';
import { followService } from '@/services/follow.service';

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

export const fetchOtherProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfileByUserName(username);
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

export const followUser = createAsyncThunk(
  'profile/followUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await followService.follow(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await followService.unfollow(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

