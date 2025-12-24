import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export const saveTokens = async (tokens: StoredTokens): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
      SecureStore.setItemAsync(USER_ID_KEY, tokens.userId),
    ]);
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw error;
  }
};

export const getTokens = async (): Promise<StoredTokens | null> => {
  try {
    const [accessToken, refreshToken, userId] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(USER_ID_KEY),
    ]);

    if (!accessToken || !refreshToken || !userId) {
      return null;
    }

    return { accessToken, refreshToken, userId };
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_ID_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};
