import axiosClient from './axiosClient';
import { Profile, ProfileUpdatePayload } from '../../types/profile';

const profileApi = {
    getMyProfile: () => axiosClient.get<Profile>('/profiles/me'),
    getProfileByUserId: (userId: string) => axiosClient.get<Profile>(`/profiles/user/${userId}`),
    getProfileByUserName: (userName: string) => axiosClient.get<Profile>(`/profiles/user/${userName}`),
    updateProfile: (data: ProfileUpdatePayload) => axiosClient.patch<Profile>('/profiles/me', data),
    uploadAvatar: (file: FormData) => axiosClient.post('/profiles/me/avatar', file),
    uploadCover: (file: FormData) => axiosClient.post('/profiles/me/cover', file),
};

export default profileApi;