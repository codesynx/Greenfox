import apiClient from './api';
import { ApiResponse, PageResponse } from './resortService';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceId: string | null;
  referenceType: string | null;
  read: boolean;
  createdAt: string;
  metadata: {
    resortName?: string;
    [key: string]: any;
  } | null;
}

class NotificationService {
  async getNotifications(page: number = 0, size: number = 20): Promise<PageResponse<Notification>> {
    const response = await apiClient.get<ApiResponse<PageResponse<Notification>>>(
      '/notifications',
      { params: { page, size } }
    );
    return response.data.data;
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/mark-all-read');
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return response.data.data;
  }
}

export const notificationService = new NotificationService();
