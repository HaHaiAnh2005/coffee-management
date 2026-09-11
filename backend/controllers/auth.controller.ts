import { Request, Response } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, identifier, phone, accountInput, password } = req.body;
      const loginId = (email || identifier || phone || accountInput || '').trim();
      const result = await authService.login(loginId, password);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userPayload = (req as any).user;
      if (!userPayload) {
        return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
      }
      const user = await authService.getMe(userPayload._id || userPayload.id);
      return res.json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AuthController();

