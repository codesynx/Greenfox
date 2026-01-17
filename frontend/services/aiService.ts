import apiClient from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ResortRecommendation {
  id: string;
  name: string;
  city: string;
  description: string;
  basePrice: number;
  rating: number;
  mainPhotoUrl: string;
  amenities: string[];
  maxGuests: number;
}

export interface ChatResponse {
  replyText: string;
  recommendations: ResortRecommendation[];
  searchPerformed: boolean;
  sessionId?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  history: ChatMessage[];
}

export const aiService = {
  chat: async (message: string, history: ChatMessage[] = [], sessionId?: string): Promise<ChatResponse> => {
    const response = await apiClient.post<{ data: ChatResponse }>('/ai/chat', {
      message,
      history,
      sessionId,
    }, {
      timeout: 120000
    });
    return response.data.data;
  },
};
