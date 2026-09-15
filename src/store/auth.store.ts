import { create } from 'zustand';
import type { User } from '../types/auth';

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  loginSuccess: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  loginSuccess: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
