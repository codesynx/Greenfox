import apiClient from './api';
import { ApiResponse } from './authService';

export interface UserProfile {
  id: string;
  phoneNumber: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>('/users/profile');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Failed to get profile');
      }
      throw new Error('Failed to get profile. Please check your connection.');
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    try {
      const response = await apiClient.patch<ApiResponse<UserProfile>>(
        '/users/profile',
        data
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Failed to update profile');
      }
      throw new Error('Failed to update profile. Please try again.');
    }
  },

  uploadAvatar: async (fileUri: string, fileName: string, fileType: string): Promise<UserProfile> => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      } as any);

      const response = await apiClient.post<ApiResponse<UserProfile>>(
        '/users/profile/avatar/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Failed to upload avatar');
      }
      throw new Error('Failed to upload avatar. Please try again.');
    }
  },
};
