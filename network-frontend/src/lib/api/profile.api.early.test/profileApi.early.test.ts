
import { Profile, ProfileUpdatePayload } from '../../../types/profile';
import axiosClient from '../axiosClient';
import profileApi from '../profile.api';


// src/lib/api/profile.api.test.ts
jest.mock("../axiosClient");

describe('profileApi() profileApi method', () => {
  // Happy Paths
  describe('Happy paths', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch the current user profile successfully', async () => {
      // This test ensures getMyProfile returns the expected profile data from axiosClient
      const mockProfile: Profile = { id: '1', name: 'John Doe', avatar: 'avatar.png', cover: 'cover.png' };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockProfile);

      const result = await profileApi.getMyProfile();

      expect(axiosClient.get).toHaveBeenCalledWith('/profiles/me');
      expect(result).toBe(mockProfile);
    });

    it('should fetch a profile by userId successfully', async () => {
      // This test ensures getProfileByUserId returns the correct profile for a given userId
      const userId = 'user-123';
      const mockProfile: Profile = { id: userId, name: 'Jane Smith', avatar: 'avatar2.png', cover: 'cover2.png' };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockProfile);

      const result = await profileApi.getProfileByUserId(userId);

      expect(axiosClient.get).toHaveBeenCalledWith(`/profiles/user/${userId}`);
      expect(result).toBe(mockProfile);
    });

    it('should update the profile successfully', async () => {
      // This test ensures updateProfile sends the correct payload and returns the updated profile
      const payload: ProfileUpdatePayload = { name: 'Updated Name', bio: 'New bio' };
      const updatedProfile: Profile = { id: '1', name: 'Updated Name', avatar: 'avatar.png', cover: 'cover.png', bio: 'New bio' };
      (axiosClient.patch as jest.Mock).mockResolvedValueOnce(updatedProfile);

      const result = await profileApi.updateProfile(payload);

      expect(axiosClient.patch).toHaveBeenCalledWith('/profiles/me', payload);
      expect(result).toBe(updatedProfile);
    });

    it('should upload avatar successfully', async () => {
      // This test ensures uploadAvatar sends the FormData and returns the response
      const formData = new FormData();
      formData.append('avatar', new Blob(['avatar-content']), 'avatar.png');
      const response = { success: true, url: 'avatar-url' };
      (axiosClient.post as jest.Mock).mockResolvedValueOnce(response);

      const result = await profileApi.uploadAvatar(formData);

      expect(axiosClient.post).toHaveBeenCalledWith('/profiles/me/avatar', formData);
      expect(result).toBe(response);
    });

    it('should upload cover successfully', async () => {
      // This test ensures uploadCover sends the FormData and returns the response
      const formData = new FormData();
      formData.append('cover', new Blob(['cover-content']), 'cover.png');
      const response = { success: true, url: 'cover-url' };
      (axiosClient.post as jest.Mock).mockResolvedValueOnce(response);

      const result = await profileApi.uploadCover(formData);

      expect(axiosClient.post).toHaveBeenCalledWith('/profiles/me/cover', formData);
      expect(result).toBe(response);
    });
  });

  // Edge Cases
  describe('Edge cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle empty userId in getProfileByUserId', async () => {
      // This test checks that getProfileByUserId works with an empty string as userId
      const userId = '';
      const mockProfile: Profile = { id: '', name: 'No Name', avatar: '', cover: '' };
      (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockProfile);

      const result = await profileApi.getProfileByUserId(userId);

      expect(axiosClient.get).toHaveBeenCalledWith('/profiles/user/');
      expect(result).toBe(mockProfile);
    });

    it('should handle empty payload in updateProfile', async () => {
      // This test checks that updateProfile works with an empty object as payload
      const payload: ProfileUpdatePayload = {};
      const updatedProfile: Profile = { id: '1', name: 'Default', avatar: '', cover: '' };
      (axiosClient.patch as jest.Mock).mockResolvedValueOnce(updatedProfile);

      const result = await profileApi.updateProfile(payload);

      expect(axiosClient.patch).toHaveBeenCalledWith('/profiles/me', payload);
      expect(result).toBe(updatedProfile);
    });

    it('should handle empty FormData in uploadAvatar', async () => {
      // This test checks that uploadAvatar works with an empty FormData
      const formData = new FormData();
      const response = { success: true, url: '' };
      (axiosClient.post as jest.Mock).mockResolvedValueOnce(response);

      const result = await profileApi.uploadAvatar(formData);

      expect(axiosClient.post).toHaveBeenCalledWith('/profiles/me/avatar', formData);
      expect(result).toBe(response);
    });

    it('should handle empty FormData in uploadCover', async () => {
      // This test checks that uploadCover works with an empty FormData
      const formData = new FormData();
      const response = { success: true, url: '' };
      (axiosClient.post as jest.Mock).mockResolvedValueOnce(response);

      const result = await profileApi.uploadCover(formData);

      expect(axiosClient.post).toHaveBeenCalledWith('/profiles/me/cover', formData);
      expect(result).toBe(response);
    });

    it('should propagate errors from axiosClient.get in getMyProfile', async () => {
      // This test ensures errors from axiosClient.get are thrown by getMyProfile
      const error = new Error('Network error');
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(profileApi.getMyProfile()).rejects.toThrow('Network error');
      expect(axiosClient.get).toHaveBeenCalledWith('/profiles/me');
    });

    it('should propagate errors from axiosClient.get in getProfileByUserId', async () => {
      // This test ensures errors from axiosClient.get are thrown by getProfileByUserId
      const error = new Error('User not found');
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(profileApi.getProfileByUserId('not-exist')).rejects.toThrow('User not found');
      expect(axiosClient.get).toHaveBeenCalledWith('/profiles/user/not-exist');
    });

    it('should propagate errors from axiosClient.patch in updateProfile', async () => {
      // This test ensures errors from axiosClient.patch are thrown by updateProfile
      const error = new Error('Update failed');
      (axiosClient.patch as jest.Mock).mockRejectedValueOnce(error);

      await expect(profileApi.updateProfile({ name: 'fail' })).rejects.toThrow('Update failed');
      expect(axiosClient.patch).toHaveBeenCalledWith('/profiles/me', { name: 'fail' });
    });

    it('should propagate errors from axiosClient.post in uploadAvatar', async () => {
      // This test ensures errors from axiosClient.post are thrown by uploadAvatar
      const error = new Error('Upload failed');
      const formData = new FormData();
      (axiosClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(profileApi.uploadAvatar(formData)).rejects.toThrow('Upload failed');
      expect(axiosClient.post).toHaveBeenCalledWith('/profiles/me/avatar', formData);
    });

    it('should propagate errors from axiosClient.post in uploadCover', async () => {
      // This test ensures errors from axiosClient.post are thrown by uploadCover
      const error = new Error('Upload failed');
      const formData = new FormData();
      (axiosClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(profileApi.uploadCover(formData)).rejects.toThrow('Upload failed');
      expect(axiosClient.post).toHaveBeenCalledWith('/profiles/me/cover', formData);
    });
  });
});