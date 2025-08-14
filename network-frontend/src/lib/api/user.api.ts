import axiosClient from './axiosClient';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';

const userApi = {
  getCurrentUser: (): Promise<AxiosResponse<User>> => {
    return axiosClient.get('/users/me');
  },
  getUserById: (userId: string): Promise<AxiosResponse<User>> => {
    return axiosClient.get(`/users/${userId}`);
  },
  updateUserInfo: (data: Partial<User>): Promise<AxiosResponse<User>> => {
    return axiosClient.patch('/users/me', data);
  },
};

export default userApi;