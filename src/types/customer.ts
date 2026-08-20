export type CustomerTier = 'Bạc' | 'Vàng' | 'Kim Cương';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  rewardPoints: number;
  totalSpent: number;
  tier: CustomerTier;
  createdAt?: string;
  notes?: string;
}
