import apiClient from './api';
import { ApiResponse, PageResponse } from './resortService';

export interface GuestInfo {
  fullName: string;
  idNumber: string;
  idType: string;
  phoneNumber: string | null;
  email: string | null;
  specialRequests: string | null;
}

export interface BookingResponse {
  id: string;
  resortId: string;
  resortName: string;
  resortCity: string;
  resortPhotoUrl: string | null;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  guestInfo: GuestInfo;
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  status: 'PENDING' | 'PAID_WAITING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  kaspiDeepLink: string | null;
  paymentRequired: boolean;
  createdAt: string;
  paymentConfirmedAt: string | null;
}

class BookingService {
  async getMyBookings(page: number = 0, size: number = 20): Promise<PageResponse<BookingResponse>> {
    const response = await apiClient.get<ApiResponse<PageResponse<BookingResponse>>>(
      '/bookings/my',
      {
        params: { page, size },
      }
    );
    return response.data.data;
  }

  async getBookingById(id: string): Promise<BookingResponse> {
    const response = await apiClient.get<ApiResponse<BookingResponse>>(`/bookings/${id}`);
    return response.data.data;
  }
}

export const bookingService = new BookingService();
