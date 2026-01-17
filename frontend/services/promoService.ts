import axios from 'axios';
import { ApiResponse } from './resortService';

const BASE_URL = 'http://localhost:8080/api/v1';

export interface PromoResponse {
  id: string;
  resortId: string;
  resortName: string;
  resortCity: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  bannerImageUrl: string;
  title: string;
  description: string;
  originalPrice: number;
  promoPrice: number;
  active: boolean;
}

class PromoService {
  async getActivePromos(): Promise<PromoResponse[]> {
    // Use axios directly to avoid Auth headers on this public endpoint
    const response = await axios.get<ApiResponse<PromoResponse[]>>(`${BASE_URL}/promos`);
    return response.data.data;
  }
}

export const promoService = new PromoService();
