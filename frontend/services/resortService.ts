import axios from 'axios';
import apiClient from './api';

const BASE_URL = 'http://localhost:8080/api/v1';

export interface ResortPhoto {
  url: string;
  description: string | null;
  order: number;
}

export type ResortType = 'VILLA' | 'RESORT' | 'HOTEL' | 'APARTMENT';

export interface ResortListItem {
  id: string;
  name: string;
  type: ResortType;
  city: string;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  mainPhotoUrl: string | null;
  promo: boolean;
  promoPrice: number | null;
  maxGuests: number;
  distanceKm: number | null;
}

export interface ResortDetails {
  id: string;
  name: string;
  type: ResortType;
  city: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  photos: ResortPhoto[];
  maxGuests: number;
  promo: boolean;
  promoDiscountPercent: number | null;
  promoPrice: number | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface GetResortsParams {
  type?: ResortType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  query?: string;
  lat?: number;
  lng?: number;
  page?: number;
  size?: number;
}

class ResortService {
  private cache: Map<string, ResortDetails> = new Map();

  async getResorts(params: GetResortsParams = {}): Promise<PageResponse<ResortListItem>> {
    const { page = 0, size = 20, ...otherParams } = params;

    // Use axios directly to avoid Auth headers which might be causing 500 error on this public endpoint
    const response = await axios.get<ApiResponse<PageResponse<ResortListItem>>>(`${BASE_URL}/resorts`, {
      params: {
        ...otherParams,
        page,
        size,
        sort: 'id,desc',
      },
    });

    return response.data.data;
  }

  async getResortById(id: string): Promise<ResortDetails> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const response = await apiClient.get<ApiResponse<ResortDetails>>(`/resorts/${id}`);
    const data = response.data.data;
    this.cache.set(id, data);
    return data;
  }

  async getCities(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/resorts/cities');
    return response.data.data;
  }
}

export const resortService = new ResortService();
