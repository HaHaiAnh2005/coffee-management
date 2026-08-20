import { create } from 'zustand';

interface ThemeStoreState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
}));
