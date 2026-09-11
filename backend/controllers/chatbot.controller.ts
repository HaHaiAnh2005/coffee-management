import { Request, Response } from 'express';
import chatbotService from '../services/chatbot.service';

export class ChatbotController {
  async chat(req: Request, res: Response) {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp tin nhắn cần tư vấn.',
        });
      }

      const result = await chatbotService.processMessage(message, Array.isArray(history) ? history : []);
      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[ChatbotController] Error handling chat:', error);
      return res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý phản hồi từ Barista AI.',
        error: error.message,
      });
    }
  }

  async getQuickPrompts(_req: Request, res: Response) {
    try {
      const prompts = chatbotService.getQuickPrompts();
      return res.json({
        success: true,
        data: prompts,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ChatbotController();
