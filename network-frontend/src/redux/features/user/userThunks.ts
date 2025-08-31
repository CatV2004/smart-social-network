import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '@/lib/api/user.api';
import { UserFilters, UserStatus } from '@/types/user';

// Async thunks
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (filters: UserFilters, { rejectWithValue }) => {
        try {
            const processedFilters = { ...filters };
            if (processedFilters.role === 'all') {
                processedFilters.role = undefined;
            }

            const response = await userApi.getUsers(processedFilters);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'users/updateUserStatus',
    async (
        { id, status }: { id: string; status: UserStatus },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.updateUserStatus(id, status);
            return response.data; // trả về User sau khi update
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update user status'
            );
        }
    }
);

export const banUser = createAsyncThunk(
    "users/banUser",
    async (id: string, { dispatch }) => {
        return dispatch(updateUserStatus({ id, status: UserStatus.BANNED })).unwrap();
    }
);

export const unbanUser = createAsyncThunk(
    "users/unbanUser",
    async (id: string, { dispatch }) => {
        return dispatch(updateUserStatus({ id, status: UserStatus.ACTIVE })).unwrap();
    }
);

// export const updateUser = createAsyncThunk(
//     'users/updateUser',
//     async ({ id, userData }: { id: string; userData: Partial<Profile> }, { rejectWithValue }) => {
//         try {
//             const response = await userApi.updateUser(id, userData);
//             return response;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || 'Failed to update user');
//         }
//     }
// );