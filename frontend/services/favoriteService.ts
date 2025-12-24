import apiClient from './api';
import { ApiResponse, PageResponse, ResortListItem } from './resortService';

export interface FavoriteResponse {
  id: string;
  resort: ResortListItem;
  favoritedAt: string;
}

class FavoriteService {
  async getFavorites(page: number = 0, size: number = 20): Promise<PageResponse<FavoriteResponse>> {
    const response = await apiClient.get<ApiResponse<PageResponse<FavoriteResponse>>>(
      '/resorts/favorites',
      {
        params: { page, size },
      }
    );
    return response.data.data;
  }

  async addFavorite(resortId: string): Promise<FavoriteResponse> {
    const response = await apiClient.post<ApiResponse<FavoriteResponse>>(
      `/resorts/${resortId}/favorite`
    );
    return response.data.data;
  }

  async removeFavorite(resortId: string): Promise<void> {
    await apiClient.delete(`/resorts/${resortId}/favorite`);
  }

  async isFavorited(resortId: string): Promise<boolean> {
    const response = await apiClient.get<ApiResponse<boolean>>(
      `/resorts/${resortId}/favorite/status`
    );
    return response.data.data;
  }
}

export const favoriteService = new FavoriteService();
