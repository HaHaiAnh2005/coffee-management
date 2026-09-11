export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  WAITER: 'WAITER',
  BARISTA: 'BARISTA',
  CUSTOMER: 'CUSTOMER',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Chủ quán (Admin)',
  MANAGER: 'Quản lý cửa hàng',
  CASHIER: 'Thu ngân',
  WAITER: 'Phục vụ bàn',
  BARISTA: 'Pha chế / Bếp',
  CUSTOMER: 'Khách hàng',
};
