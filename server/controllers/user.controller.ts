import { Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAll();
      return res.json({ success: true, data: users });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await userService.update(req.params.id, req.body);
      return res.json({ success: true, data: user });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await userService.delete(req.params.id);
      return res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new UserController();
