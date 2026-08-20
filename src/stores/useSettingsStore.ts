import { create } from 'zustand';
import type { StoreSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/mockData';

interface SettingsState {
  settings: StoreSettings;

  // Actions
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: INITIAL_SETTINGS,

  updateSettings: (newSettings) =>
    set({
      settings: {
        ...get().settings,
        ...newSettings,
      },
    }),
}));
