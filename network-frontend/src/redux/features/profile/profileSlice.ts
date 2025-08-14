import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/types/profile';
import { fetchMyProfile, updateMyProfile } from './profileThunks';

interface ProfileState {
  myProfile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  myProfile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.myProfile = action.payload;
    },
    clearProfile: (state) => {
      state.myProfile = null;
    },
    updateProfileInfo: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.myProfile) {
        state.myProfile = { ...state.myProfile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.myProfile) {
          state.myProfile = { ...state.myProfile, ...action.payload };
        }
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setProfile, clearProfile, updateProfileInfo } = profileSlice.actions;
export default profileSlice.reducer;