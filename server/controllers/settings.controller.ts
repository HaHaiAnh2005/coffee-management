import { Request, Response } from 'express';
import settingsService from '../services/settings.service';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await settingsService.getSettings();
      return res.json({ success: true, data: settings });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const settings = await settingsService.updateSettings(req.body);
      return res.json({ success: true, data: settings });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new SettingsController();
