import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '@/lib/api/user.api';
import { User } from '@/types/user';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCurrentUser = createAsyncThunk(
  'user/updateCurrentUser',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserInfo(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);