import apiClient from './api';
import { ApiResponse, PageResponse, ResortListItem } from './resortService';

export interface FavoriteResponse {
  id: string;
  resort: ResortListItem;
  favoritedAt: string;
}

class FavoriteService {
  private cache: PageResponse<FavoriteResponse> | null = null;
  private lastFetchTime: number = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getFavorites(page: number = 0, size: number = 20): Promise<PageResponse<FavoriteResponse>> {
    const now = Date.now();
    // Only cache first page
    if (page === 0 && this.cache && (now - this.lastFetchTime < this.CACHE_DURATION)) {
      return this.cache;
    }

    const response = await apiClient.get<ApiResponse<PageResponse<FavoriteResponse>>>(
      '/resorts/favorites',
      {
        params: { page, size },
      }
    );

    if (page === 0) {
      this.cache = response.data.data;
      this.lastFetchTime = now;
    }

    return response.data.data;
  }

  async addFavorite(resortId: string): Promise<FavoriteResponse> {
    this.cache = null; // Invalidate cache
    const response = await apiClient.post<ApiResponse<FavoriteResponse>>(
      `/resorts/${resortId}/favorite`
    );
    return response.data.data;
  }

  async removeFavorite(resortId: string): Promise<void> {
    this.cache = null; // Invalidate cache
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
