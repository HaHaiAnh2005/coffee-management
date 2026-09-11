export type MembershipTier = 'Tất cả' | 'Bạc' | 'Vàng' | 'Kim Cương';

export interface Coupon {
  id: string;
  code: string;
  title?: string;
  description?: string;
  discountValue: number;
  discountType: 'fixed' | 'percent';
  minOrderValue: number;
  expiryDate: string;
  status: 'active' | 'expired';
  minTier?: MembershipTier;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'CP01',
    code: 'WELCOME10',
    title: 'Voucher Chào Mừng',
    description: 'Giảm ngay 10.000đ cho đơn từ 30.000đ',
    discountValue: 10000,
    discountType: 'fixed',
    minOrderValue: 30000,
    expiryDate: '2026-12-31',
    status: 'active',
    minTier: 'Tất cả',
  },
  {
    id: 'CP02',
    code: 'SILVER15K',
    title: 'Đặc Quyền Hạng Bạc 🥈',
    description: 'Giảm 15.000đ cho thành viên Hạng Bạc trở lên',
    discountValue: 15000,
    discountType: 'fixed',
    minOrderValue: 40000,
    expiryDate: '2026-12-31',
    status: 'active',
    minTier: 'Bạc',
  },
  {
    id: 'CP03',
    code: 'GOLDVIP20',
    title: 'Ưu Đãi Hạng Vàng 🥇',
    description: 'Giảm 20% tổng hóa đơn (Tối đa 30.000đ)',
    discountValue: 20,
    discountType: 'percent',
    minOrderValue: 50000,
    expiryDate: '2026-12-31',
    status: 'active',
    minTier: 'Vàng',
  },
  {
    id: 'CP04',
    code: 'DIAMOND50K',
    title: 'Đỉnh Cao Kim Cương 💎',
    description: 'Giảm thẳng 50.000đ cho thành viên Kim Cương VIP',
    discountValue: 50000,
    discountType: 'fixed',
    minOrderValue: 80000,
    expiryDate: '2026-12-31',
    status: 'active',
    minTier: 'Kim Cương',
  },
  {
    id: 'CP05',
    code: 'COFFEE20',
    title: 'Gu Cà Phê Đậm Đà ☕',
    description: 'Giảm 20% cho tất cả thành viên Hạng Vàng',
    discountValue: 20,
    discountType: 'percent',
    minOrderValue: 45000,
    expiryDate: '2026-12-31',
    status: 'active',
    minTier: 'Vàng',
  },
];

export const couponApi = {
  getAll: async (): Promise<Coupon[]> => INITIAL_COUPONS,
};

