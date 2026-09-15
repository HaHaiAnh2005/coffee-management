import type { Role } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  rewardPoints: number;
  addresses: string[];
}
