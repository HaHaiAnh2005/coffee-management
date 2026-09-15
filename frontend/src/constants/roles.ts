export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  WAITER: 'WAITER',
  BARISTA: 'BARISTA',
  CUSTOMER: 'CUSTOMER',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản lý',
  MANAGER: 'Quản lý',
  CASHIER: 'Nhân viên',
  WAITER: 'Nhân viên',
  BARISTA: 'Nhân viên',
  CUSTOMER: 'Khách hàng',
};
