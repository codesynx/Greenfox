import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTokens, saveTokens, clearTokens } from '../utils/secureStorage';
import { authService, VerifyOtpResponse } from '../services/authService';
import { userService, UserProfile } from '../services/userService';

export interface User {
  userId: string;
  phoneNumber: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authResponse: VerifyOtpResponse) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
  optimisticAvatar: string | null;
  setOptimisticAvatar: (uri: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [optimisticAvatar, setOptimisticAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const tokens = await getTokens();
      if (tokens) {
        // Fetch full user profile from API
        try {
          const profile = await userService.getProfile();
          setUser({
            userId: profile.id,
            phoneNumber: profile.phoneNumber,
            name: profile.name,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
            role: profile.role,
          });
        } catch (error) {
          // If profile fetch fails, still set basic user info from tokens
          console.error('Error fetching profile:', error);
          setUser({
            userId: tokens.userId,
            phoneNumber: '',
            name: '',
            email: null,
            avatarUrl: null,
            role: 'USER',
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (authResponse: VerifyOtpResponse) => {
    try {
      await saveTokens({
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        userId: authResponse.userId,
      });

      setUser({
        userId: authResponse.userId,
        phoneNumber: authResponse.phoneNumber,
        name: authResponse.name,
        email: null,
        avatarUrl: null,
        role: authResponse.role,
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearTokens();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData };
    });
  };

  const refreshProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUser({
        userId: profile.id,
        phoneNumber: profile.phoneNumber,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        role: profile.role,
      });
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    updateUser,
    refreshProfile,
    optimisticAvatar,
    setOptimisticAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
