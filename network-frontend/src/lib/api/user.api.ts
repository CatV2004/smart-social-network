import { ListResponse } from '@/types/pagination-meta';
import axiosClient from './axiosClient';
import { User, UserFilters, UserStatus } from '@/types/user';
import { AxiosResponse } from 'axios';
import { Profile } from '@/types/profile';

const userApi = {
  getCurrentUser: (): Promise<AxiosResponse<User>> => {
    return axiosClient.get('/users/me');
  },
  getUserById: (userId: string): Promise<AxiosResponse<User>> => {
    return axiosClient.get(`/users/${userId}`);
  },
  getUserByUsername: (username: string): Promise<AxiosResponse<User>> => {
    return axiosClient.get(`/users/username/${username}`);
  },
  updateUserInfo: (data: Partial<User>): Promise<AxiosResponse<User>> => {
    return axiosClient.patch('/users/me', data);
  },
  updateUserStatus: (
    id: string,
    status: UserStatus
  ): Promise<AxiosResponse<User>> => {
    return axiosClient.patch(`/users/${id}/status`, { status });
  },
  getUsers: (filters: UserFilters): Promise<ListResponse<Profile>> => {
    return axiosClient.get('/profiles', { params: filters }).then((res) => res.data);
  },

};

export default userApi;