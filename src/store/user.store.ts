import { create } from 'zustand';
import type { UserProfile } from '../types/user';

interface UserStoreState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  profile: {
    id: 'U01',
    name: 'Nguyễn Văn Thu Ngân',
    email: 'cashier@lauracoffee.vn',
    phone: '0988888888',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'ADMIN',
    rewardPoints: 1200,
    addresses: ['128 Nguyễn Huệ, Q.1, TP.HCM'],
  },
  setProfile: (profile) => set({ profile }),
}));
