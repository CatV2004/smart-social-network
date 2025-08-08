import axios from 'axios';
import { getCookie } from 'cookies-next';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getCookie('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axiosClient.post('/auth/refresh', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });

                // Update tokens in cookies
                document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${data.accessTokenExpiresIn}`;
                document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${data.refreshTokenExpiresIn}`;


                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login
                document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;