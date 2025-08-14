import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import { fetchCurrentUser } from './userThunks';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  initialized: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.initialized = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.initialized = true;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setInitialized(state) {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true;
      });
  }
});

export const { setUser, clearUser, updateUserInfo, setInitialized } = userSlice.actions;
export default userSlice.reducer;