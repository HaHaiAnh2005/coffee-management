import { axiosClient } from '../config/axios';
import type { Product } from '../types';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface ChatbotResponseData {
  text: string;
  products: Product[];
  suggestedQuestions?: string[];
  isAiPowered?: boolean;
}

export const chatbotApi = {
  sendMessage: async (message: string, history: ChatHistoryItem[] = []): Promise<ChatbotResponseData> => {
    const response: any = await axiosClient.post('/chatbot/chat', {
      message,
      history,
    });
    return response.data;
  },

  getQuickPrompts: async (): Promise<string[]> => {
    const response: any = await axiosClient.get('/chatbot/quick-prompts');
    return response.data || [];
  },
};
