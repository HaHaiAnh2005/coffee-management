import type { Role } from '../types/auth';
import { useAuthStore } from '../store/auth.store';

export const PERMISSIONS = {
  ORDER_CREATE: 'order.create',
  BILL_PAY: 'bill.pay',
  ITEM_CANCEL: 'order.cancel_item',
  BILL_CANCEL: 'bill.cancel',
  BILL_DISCOUNT_LIMIT: 'bill.discount.limit',
  BILL_DISCOUNT_UNLIMITED: 'bill.discount.unlimited',
  REPORT_VIEW: 'report.view',
  REPORT_PROFIT: 'report.view_profit',
  INVENTORY_MANAGE: 'inventory.manage',
  MENU_MANAGE: 'menu.manage',
  EMPLOYEE_MANAGE: 'employee.manage',
  SHIFT_MANAGE: 'shift.manage',
  AUDIT_VIEW: 'audit.view',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * RBAC Permission Matrix for 88 BỒNG BIÊNG Coffee Management System
 */
export const ROLE_PERMISSIONS: Record<Role, PermissionCode[]> = {
  ADMIN: [
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.BILL_PAY,
    PERMISSIONS.ITEM_CANCEL,
    PERMISSIONS.BILL_CANCEL,
    PERMISSIONS.BILL_DISCOUNT_LIMIT,
    PERMISSIONS.BILL_DISCOUNT_UNLIMITED,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_PROFIT,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.MENU_MANAGE,
    PERMISSIONS.EMPLOYEE_MANAGE,
    PERMISSIONS.SHIFT_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],
  MANAGER: [
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.BILL_PAY,
    PERMISSIONS.ITEM_CANCEL,
    PERMISSIONS.BILL_CANCEL,
    PERMISSIONS.BILL_DISCOUNT_LIMIT,
    PERMISSIONS.BILL_DISCOUNT_UNLIMITED,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_PROFIT,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.MENU_MANAGE,
    PERMISSIONS.SHIFT_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],
  CASHIER: [
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.BILL_PAY,
    PERMISSIONS.BILL_DISCOUNT_LIMIT,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.SHIFT_MANAGE,
  ],
  WAITER: [
    PERMISSIONS.ORDER_CREATE,
  ],
  BARISTA: [
    PERMISSIONS.ORDER_CREATE,
  ],
  CUSTOMER: [
    PERMISSIONS.ORDER_CREATE,
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: Role | undefined | null, permission: PermissionCode): boolean => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Custom React Hook to check current logged-in user permission
 */
export const usePermission = (permission: PermissionCode): boolean => {
  const user = useAuthStore((state) => state.user);
  return hasPermission(user?.role, permission);
};
