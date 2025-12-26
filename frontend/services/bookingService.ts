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

export interface PaymentMethod {
  type: 'CARD';
  cardToken: string;
  last4: string;
}

export interface CreateBookingRequest {
  resortId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  guestFullName: string;
  idNumber: string;
  idType: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
}

export interface BookingCalcRequest {
  resortId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
}

export interface BookingCalcResponse {
  resortId: string;
  resortName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  basePricePerNight: number;
  baseTotal: number; // originalPrice
  discountPercent: number;
  discountAmount: number;
  discountedPrice: number;
  tax: number;
  totalPrice: number; // total
  hasPromo: boolean;
  available: boolean;
  unavailableReason?: string;
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
  status: 'PENDING' | 'PAID_WAITING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'CANCELLATION_PENDING';
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

  async createBooking(booking: CreateBookingRequest): Promise<BookingResponse> {
    const response = await apiClient.post<ApiResponse<BookingResponse>>('/bookings', booking);
    return response.data.data;
  }

  async calculatePrice(request: BookingCalcRequest): Promise<BookingCalcResponse> {
    const response = await apiClient.post<ApiResponse<BookingCalcResponse>>('/bookings/calc', request);
    return response.data.data;
  }

  async cancelBooking(id: string, reason: string): Promise<void> {
    await apiClient.post(`/bookings/${id}/cancel`, { reason });
  }
}

export const bookingService = new BookingService();
