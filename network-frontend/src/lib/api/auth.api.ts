import axiosClient from './axiosClient';
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  UserResponse,
} from '@/types/auth.d';
import { AxiosResponse } from 'axios';

export const authApi = {
  login: (payload: LoginPayload): Promise<AxiosResponse<AuthResponse>> => {
    return axiosClient.post('/auth/sign-in', payload);
  },

  register: (payload: RegisterPayload): Promise<AxiosResponse<UserResponse>> => {
    return axiosClient.post('/users/sign-up', payload);
  },

  refreshToken: (refreshToken: string): Promise<AxiosResponse<AuthResponse>> => {
    return axiosClient.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
  },

  logout: (): Promise<void> => {
    return axiosClient.post('/auth/sign-out');
  },

  verifyEmail: (token: string): Promise<{ message: string }> => {
    return axiosClient.get(`/users/verify-email?token=${token}`);
  },

  resendVerification: (email: string): Promise<{ message: string }> => {
    return axiosClient.post('/users/resend-verification', { email });
  },
};