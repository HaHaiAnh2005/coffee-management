import Settings, { ISettings } from '../models/settings.model';

export class SettingsService {
  async getSettings(): Promise<ISettings> {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create({});
      settings = created.toObject();
    }
    return settings as ISettings;
  }

  async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(data);
    } else {
      Object.assign(settings, data);
    }
    return (await settings.save()) as ISettings;
  }
}

export default new SettingsService();
