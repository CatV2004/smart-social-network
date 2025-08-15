import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { MediaResponse, UploadMediaPayload } from '@/types/media';

const mediaApi = {
    uploadMedia: (
        { files, postId, type }: UploadMediaPayload
    ): Promise<AxiosResponse<MediaResponse[]>> => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('postId', postId);
        formData.append('type', type);
        return axiosClient.post('/media/upload', formData);
    },

};

export default mediaApi;
