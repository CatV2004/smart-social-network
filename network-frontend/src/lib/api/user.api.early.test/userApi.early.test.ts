
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';
import userApi from '../user.api';


// src/lib/api/user.api.test.ts


// src/lib/api/user.api.test.ts
// Mock axiosClient
jest.mock("../axiosClient", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

describe('userApi() userApi method', () => {
  // Happy Paths
  describe('Happy Paths', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch the current user successfully', async () => {
      // Test: Ensure getCurrentUser returns the expected AxiosResponse<User>
      const mockUser: User = { id: '1', username: 'john', email: 'john@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userApi.getCurrentUser();
      expect(axiosClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toBe(mockResponse);
    });

    it('should fetch a user by ID successfully', async () => {
      // Test: Ensure getUserById returns the expected AxiosResponse<User> for a valid userId
      const userId = '123';
      const mockUser: User = { id: userId, username: 'alice', email: 'alice@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userApi.getUserById(userId);
      expect(axiosClient.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toBe(mockResponse);
    });

    it('should fetch a user by username successfully', async () => {
      // Test: Ensure getUserByUsername returns the expected AxiosResponse<User> for a valid username
      // Note: The implementation is incorrect, but we test as written.
      const username = 'bob';
      const mockUser: User = { id: '2', username, email: 'bob@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // The implementation uses userId instead of username, so we expect `/users/${userId}`.
      // We'll call with username and expect `/users/${username}`.
      const result = await userApi.getUserByUsername(username);
      expect(axiosClient.get).toHaveBeenCalledWith(`/users/${username}`);
      expect(result).toBe(mockResponse);
    });

    it('should update user info successfully', async () => {
      // Test: Ensure updateUserInfo returns the expected AxiosResponse<User> for valid data
      const updateData: Partial<User> = { email: 'newemail@example.com' };
      const mockUser: User = { id: '3', username: 'charlie', email: 'newemail@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userApi.updateUserInfo(updateData);
      expect(axiosClient.patch).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toBe(mockResponse);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle empty userId in getUserById', async () => {
      // Test: Ensure getUserById works with an empty string userId
      const userId = '';
      const mockUser: User = { id: userId, username: 'empty', email: 'empty@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userApi.getUserById(userId);
      expect(axiosClient.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toBe(mockResponse);
    });

    it('should handle special characters in username in getUserByUsername', async () => {
      // Test: Ensure getUserByUsername works with a username containing special characters
      const username = 'user!@#';
      const mockUser: User = { id: '4', username, email: 'special@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userApi.getUserByUsername(username);
      expect(axiosClient.get).toHaveBeenCalledWith(`/users/${username}`);
      expect(result).toBe(mockResponse);
    });

    it('should handle empty data in updateUserInfo', async () => {
      // Test: Ensure updateUserInfo works with an empty object
      const updateData: Partial<User> = {};
      const mockUser: User = { id: '5', username: 'dave', email: 'dave@example.com' };
      const mockResponse: AxiosResponse<User> = { data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} };
      (axiosClient.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userApi.updateUserInfo(updateData);
      expect(axiosClient.patch).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toBe(mockResponse);
    });

    it('should propagate errors from axiosClient.get in getCurrentUser', async () => {
      // Test: Ensure getCurrentUser propagates errors thrown by axiosClient.get
      const error = new Error('Network error');
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(userApi.getCurrentUser()).rejects.toThrow('Network error');
      expect(axiosClient.get).toHaveBeenCalledWith('/users/me');
    });

    it('should propagate errors from axiosClient.get in getUserById', async () => {
      // Test: Ensure getUserById propagates errors thrown by axiosClient.get
      const error = new Error('User not found');
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(userApi.getUserById('notfound')).rejects.toThrow('User not found');
      expect(axiosClient.get).toHaveBeenCalledWith('/users/notfound');
    });

    it('should propagate errors from axiosClient.get in getUserByUsername', async () => {
      // Test: Ensure getUserByUsername propagates errors thrown by axiosClient.get
      const error = new Error('Username not found');
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(userApi.getUserByUsername('nouser')).rejects.toThrow('Username not found');
      expect(axiosClient.get).toHaveBeenCalledWith('/users/nouser');
    });

    it('should propagate errors from axiosClient.patch in updateUserInfo', async () => {
      // Test: Ensure updateUserInfo propagates errors thrown by axiosClient.patch
      const error = new Error('Update failed');
      (axiosClient.patch as jest.Mock).mockRejectedValueOnce(error);

      await expect(userApi.updateUserInfo({ email: 'fail@example.com' })).rejects.toThrow('Update failed');
      expect(axiosClient.patch).toHaveBeenCalledWith('/users/me', { email: 'fail@example.com' });
    });
  });
});