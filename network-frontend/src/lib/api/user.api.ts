import axiosClient from './axiosClient';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';

const userApi = {
  getCurrentUser: (): Promise<AxiosResponse<User>> => {
    return axiosClient.get('/users/me');
  },
  updateUserInfo: (data: Partial<User>): Promise<AxiosResponse<User>> => {
    return axiosClient.patch('/users/me', data);
  },
};

export default userApi;