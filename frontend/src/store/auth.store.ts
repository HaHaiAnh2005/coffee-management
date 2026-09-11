import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  loginSuccess: (user: User, token: string) => void;
  updateUser: (updatedData: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      loginSuccess: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'coffee_auth_user_store',
    }
  )
);

