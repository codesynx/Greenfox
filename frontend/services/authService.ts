import axios from 'axios';

const BASE_URL = 'https://octopus-app-6egtt.ondigitalocean.app/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: {
    code: string;
    message: string;
    details: any;
  };
}

export interface SendOtpResponse {
  phoneNumber: string;
  expiresInSeconds: number;
  retryAfterSeconds: number;
  message: string;
}

export interface VerifyOtpResponse {
  userId: string;
  phoneNumber: string;
  name: string;
  role: 'ADMIN' | 'USER';
  newUser: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  userId: string;
  phoneNumber: string;
  name: string;
  role: 'ADMIN' | 'USER';
  newUser: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const PHONE_NUMBER_PATTERN = /^\+?[1-9]\d{10,14}$/;

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters except leading +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  return PHONE_NUMBER_PATTERN.test(cleaned);
};

export const authService = {
  sendOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    try {
      const response = await axios.post<ApiResponse<SendOtpResponse>>(
        `${BASE_URL}/auth/send-otp`,
        { phoneNumber }
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Failed to send OTP');
      }
      throw new Error('Failed to send OTP. Please check your connection.');
    }
  },

  resendOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    try {
      const response = await axios.post<ApiResponse<SendOtpResponse>>(
        `${BASE_URL}/auth/resend-otp`,
        { phoneNumber }
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Failed to resend OTP');
      }
      throw new Error('Failed to resend OTP. Please try again later.');
    }
  },

  verifyOtp: async (phoneNumber: string, code: string): Promise<VerifyOtpResponse> => {
    try {
      const response = await axios.post<ApiResponse<VerifyOtpResponse>>(
        `${BASE_URL}/auth/verify-otp`,
        { phoneNumber, code }
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Invalid OTP code');
      }
      throw new Error('Failed to verify OTP. Please try again.');
    }
  },

  refresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken }
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Session expired');
      }
      throw new Error('Failed to refresh session. Please login again.');
    }
  },
};
