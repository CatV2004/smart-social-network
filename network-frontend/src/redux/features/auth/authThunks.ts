import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../../lib/api/auth.api';
import { setCookie, deleteCookie } from 'cookies-next';
import { LoginPayload, RegisterPayload } from '../../../types/auth.d';
import { setAuthError, clearAuth, setAuthLoading } from './authSlice';
import { fetchCurrentUser } from '../user/userThunks';
import { fetchMyProfile } from '../profile/profileThunks';

export const login = createAsyncThunk(
    'auth/login',
    async (payload: LoginPayload, { dispatch }) => {
        try {
            dispatch(setAuthLoading(true));
            const { data } = await authApi.login(payload);

            setCookie('accessToken', data.accessToken, { maxAge: 3600 }); // 1 hour
            setCookie('refreshToken', data.refreshToken, { maxAge: 86400 }); // 1 day
            await dispatch(fetchCurrentUser());
            await dispatch(fetchMyProfile());


            return data;
        } catch (error: any) {
            let errorMessage = 'Login failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            dispatch(setAuthError(errorMessage));
            throw error;
        } finally {
            dispatch(setAuthLoading(false));
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (payload: RegisterPayload, { dispatch }) => {
        try {
            dispatch(setAuthLoading(true));
            const data = await authApi.register(payload);
            return data;
        } catch (error: any) {
            let errorMessage = 'Registration failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            dispatch(setAuthError(errorMessage));
            throw new Error(errorMessage);
        } finally {
            dispatch(setAuthLoading(false));
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            await authApi.logout();
        } finally {
            // Clear cookies and auth state
            deleteCookie('accessToken');
            deleteCookie('refreshToken');
            dispatch(clearAuth());
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token: string, { dispatch }) => {
        try {
            dispatch(setAuthLoading(true));
            const data = await authApi.verifyEmail(token);
            return data;
        } catch (error: any) {
            let errorMessage = 'Email verification failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            dispatch(setAuthError(errorMessage));
            throw new Error(errorMessage);
        } finally {
            dispatch(setAuthLoading(false));
        }
    }
);

export const resendVerification = createAsyncThunk(
    'auth/resendVerification',
    async (email: string, { dispatch }) => {
        try {
            dispatch(setAuthLoading(true));
            const data = await authApi.resendVerification(email);
            return data;
        } catch (error: any) {
            let errorMessage = 'Failed to resend verification';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            dispatch(setAuthError(errorMessage));
            throw error;
        } finally {
            dispatch(setAuthLoading(false));
        }
    }
);