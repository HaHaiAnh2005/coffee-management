import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiBarChart2,
  FiShoppingBag,
  FiCoffee,
  FiUsers,
  FiFileText,
  FiGift,
  FiSettings,
  FiTrendingUp,
  FiShield,
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { hasPermission, PERMISSIONS, type PermissionCode } from '../../constants/permissions';
import { ROLE_LABELS } from '../../constants/roles';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number | null;
  permission?: PermissionCode;
}

export const Sidebar: React.FC = () => {
  const cartCount = useCartStore((state) => state.items.reduce((s, i) => s + i.quantity, 0));
  const user = useAuthStore((state) => state.user);

  const allNavItems: NavItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard Quản Trị', icon: FiBarChart2, permission: PERMISSIONS.REPORT_VIEW },
    { path: '/admin/pos', label: 'Quầy Bán Hàng POS', icon: FiShoppingBag, badge: cartCount > 0 ? cartCount : null, permission: PERMISSIONS.ORDER_CREATE },
    { path: '/admin/products', label: 'Quản Lý Sản Phẩm', icon: FiCoffee, permission: PERMISSIONS.MENU_MANAGE },
    { path: '/admin/orders', label: 'Quản Lý Hóa Đơn', icon: FiFileText, permission: PERMISSIONS.BILL_PAY },
    { path: '/admin/employees', label: 'Quản Lý Nhân Viên', icon: FiUsers, permission: PERMISSIONS.EMPLOYEE_MANAGE },
    { path: '/admin/customers', label: 'Khách Hàng & Điểm', icon: FiUsers, permission: PERMISSIONS.ORDER_CREATE },
    { path: '/admin/coupons', label: 'Mã Giảm Giá', icon: FiGift, permission: PERMISSIONS.BILL_DISCOUNT_UNLIMITED },
    { path: '/admin/reports', label: 'Báo Cáo Doanh Thu', icon: FiTrendingUp, permission: PERMISSIONS.REPORT_PROFIT },
    { path: '/admin/audit-logs', label: 'Nhật Ký Anti-Fraud', icon: FiShield, permission: PERMISSIONS.AUDIT_VIEW },
    { path: '/admin/settings', label: 'Cài Đặt Cửa Hàng', icon: FiSettings, permission: PERMISSIONS.MENU_MANAGE },
  ];

  // Filter links according to RBAC user role permissions
  const visibleNav = allNavItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(user?.role, item.permission);
  });

  return (
    <aside className="w-68 bg-white/95 border-r border-sky-100 text-stone-700 flex flex-col h-screen shrink-0 shadow-lg backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3.5 border-b border-sky-100 bg-[#a3c7e4]/20">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5b95c6] via-[#3b7bb5] to-[#2563eb] flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-sky-900/20">
          🌸
        </div>
        <div>
          <h1 className="font-serif-title font-bold text-stone-900 text-base leading-tight">88 BỒNG BIÊNG</h1>
          <p className="text-[10px] text-sky-700 font-extrabold uppercase tracking-widest flex items-center gap-1">
            ✨ Bồng Biêng RBAC
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-900/20'
                    : 'hover:bg-sky-50 text-stone-700 hover:text-sky-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${
                      isActive ? 'bg-white text-sky-900' : 'bg-sky-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Badge */}
      <div className="p-4 border-t border-sky-100 bg-sky-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-900 font-bold text-xs shadow-xs">
            👑
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate">{user?.name || 'Nguyễn Văn Chủ Quán'}</p>
            <p className="text-[10px] text-sky-700 font-bold truncate">
              {ROLE_LABELS[user?.role || 'ADMIN']}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
