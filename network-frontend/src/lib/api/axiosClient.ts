// import axios from 'axios';
// import { getCookie } from 'cookies-next';

// const axiosClient = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
// });

// // Request interceptor
// axiosClient.interceptors.request.use((config) => {
//     const accessToken = getCookie('accessToken');
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
// });

// // Response interceptor
// axiosClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const refreshToken = getCookie('refreshToken');
//                 if (!refreshToken) throw new Error('No refresh token');
//                 console.log("refresh token after call refresh token: ", refreshToken);

//                 const { data } = await axiosClient.post('/auth/refresh', {}, {
//                     headers: { Authorization: `Bearer ${refreshToken}` }
//                 });

//                 console.log("data after refresh token: ", data)

//                 // Update tokens in cookies
//                 document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${data.accessTokenExpiresIn}`;
//                 document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${data.refreshTokenExpiresIn}`;


//                 // Retry original request
//                 originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//                 return axiosClient(originalRequest);
//             } catch (refreshError) {
//                 // Clear tokens and redirect to login
//                 document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
//                 document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
//                 window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosClient;
// src/lib/axiosClient.ts
import axios from "axios";
import { getCookie } from "cookies-next";
import refreshClient from "./refreshClient";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Interceptor request – tự động chèn access token
axiosClient.interceptors.request.use((config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor response – tự động refresh khi 401
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Đợi refresh xong
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getCookie("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await refreshClient.post(
                    "/auth/refresh",
                    {},
                    { headers: { Authorization: `Bearer ${refreshToken}` } }
                );

                document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${data.accessTokenExpiresIn}`;
                document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${data.refreshTokenExpiresIn}`;

                processQueue(null, data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);

                // Xóa token & redirect
                document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
