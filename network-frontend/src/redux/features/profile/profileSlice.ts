import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/types/profile';
import { fetchMyProfile, fetchOtherProfile, followUser, unfollowUser, updateMyProfile } from './profileThunks';
import { acceptFollowRequest, rejectFollowRequest } from '../follow-request/followRequestThunks';

interface ProfileState {
  myProfile: Profile | null;
  otherProfile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: ProfileState = {
  myProfile: null,
  otherProfile: null,
  loading: false,
  error: null,
  initialized: false
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.myProfile = action.payload;
      state.initialized = true;
    },
    incrementFollowersCount: (state) => {
      if (state.myProfile) {
        state.myProfile.followersCount += 1;
      }
    },
    decrementFollowersCount: (state) => {
      if (state.myProfile) {
        state.myProfile.followersCount = Math.max(0, state.myProfile.followersCount - 1);
      }
    },
    clearProfile: (state) => {
      state.myProfile = null;
      state.initialized = false;
    },
    updateProfileInfo: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.myProfile) {
        state.myProfile = { ...state.myProfile, ...action.payload };
      }
    },
    setInitialized(state) {
      state.initialized = true;
    },
    setOtherProfile: (state, action: PayloadAction<Profile>) => {
      state.otherProfile = action.payload;
    },
    updateFollowStatus: (
      state,
      action: PayloadAction<{
        isFollowed: boolean;
        followersCount: number;
        followStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
      }>
    ) => {
      if (state.otherProfile) {
        state.otherProfile.isFollowed = action.payload.isFollowed;
        state.otherProfile.followersCount = action.payload.followersCount;
        if (action.payload.followStatus !== undefined) {
          state.otherProfile.followStatus = action.payload.followStatus;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOtherProfile: (state) => {
      state.otherProfile = null;
    }
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
        state.initialized = true;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true;
      })
      .addCase(fetchOtherProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.otherProfile = action.payload;
      })
      .addCase(fetchOtherProfile.rejected, (state, action) => {
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
      })
      .addCase(followUser.pending, (state) => {
        state.error = null;
        if (state.otherProfile) {
          state.otherProfile.followStatus = 'PENDING';
          state.otherProfile.isFollowed = true;
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.otherProfile && state.otherProfile.user.id === action.meta.arg) {
          state.otherProfile.followStatus = action.payload.status;
          state.otherProfile.isFollowed = true;
          state.otherProfile.followersCount += 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.payload as string;
        if (state.otherProfile && state.otherProfile.user.id === action.meta.arg) {
          state.otherProfile.isFollowed = false;
          state.otherProfile.followStatus = 'REJECTED';
          state.otherProfile.followersCount = Math.max(0, state.otherProfile.followersCount - 1);
        }
      })
      .addCase(unfollowUser.pending, (state) => {
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.otherProfile && state.otherProfile.user.id === action.meta.arg) {
          state.otherProfile.isFollowed = false;
          state.otherProfile.followStatus = 'REJECTED';
          state.otherProfile.followersCount = Math.max(0, state.otherProfile.followersCount - 1);
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.payload as string;
        if (state.otherProfile && state.otherProfile.user.id === action.meta.arg) {
          state.otherProfile.isFollowed = true;
          state.otherProfile.followersCount += 1;
        }
      })
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        if (state.myProfile) {
          state.myProfile.followersCount += 1;
        }
        if (
          state.otherProfile &&
          state.otherProfile.id === action.payload.following.id
        ) {
          state.otherProfile.isFollowed = true;
          state.otherProfile.followStatus = "ACCEPTED";
          state.otherProfile.followersCount += 1;
        }
      })
      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        if (
          state.otherProfile &&
          state.otherProfile.user.id === action.payload
        ) {
          state.otherProfile.isFollowed = false;
          state.otherProfile.followStatus = "REJECTED";
        }
      });
  }
});

export const {
  setProfile,
  clearProfile,
  updateProfileInfo,
  incrementFollowersCount,
  decrementFollowersCount,
  setInitialized,
  setOtherProfile,
  updateFollowStatus,
  clearError,
  resetOtherProfile
} = profileSlice.actions;
export default profileSlice.reducer;