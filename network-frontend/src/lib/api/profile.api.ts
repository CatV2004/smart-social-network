import axiosClient from './axiosClient';
import { Profile, ProfileUpdatePayload } from '../../types/profile';

const profileApi = {
    getMyProfile: () => axiosClient.get<Profile>('/profiles/me'),
    getProfileByUserId: (userId: string) => axiosClient.get<Profile>(`/profiles/${userId}`),
    getProfileByUserName: (userName: string) => axiosClient.get<Profile>(`/profiles/user/${userName}`),
    updateProfile: (data: FormData) =>
        axiosClient.put<Profile>("/profiles/me", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    uploadImage: async (formData: FormData): Promise<Profile> => {
        const res = await axiosClient.put<Profile>('/profiles/upload-image', formData);
        return res.data;
    },
};

export default profileApi;