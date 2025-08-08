import { getCookie } from 'cookies-next';
import { authApi } from '../lib/api/auth.api';

class AuthService {
  async checkAuth() {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (!accessToken && !refreshToken) {
      return false;
    }

    try {
      // You might want to verify token validity or fetch user details here
      return true;
    } catch (error) {
      return false;
    }
  }

  async handleRefreshToken() {
    const refreshToken = getCookie('refreshToken')?.toString();
    if (!refreshToken) throw new Error('No refresh token');

    try {
      const data = await authApi.refreshToken(refreshToken);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();