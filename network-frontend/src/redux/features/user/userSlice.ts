import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "@/types/profile";
import { UserFilters } from "@/types/user";
import { PaginationMeta } from "@/types/pagination-meta";
import { fetchUsers, updateUserStatus } from "./userThunks";
import { stat } from "fs";

interface UserState {
  users: Profile[];
  filters: UserFilters;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: UserState = {
  users: [],
  filters: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  },
  loading: false,
  error: null,
  pagination: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUsers: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data || [];
        const meta = action.payload?.meta || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        };

        if (meta.page === 1) {
          state.users = data;
        } else {
          state.users.push(...data);
        }

        state.pagination = meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";

        state.pagination = state.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        };
      });
    builder
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...updatedUser };
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, clearError, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
