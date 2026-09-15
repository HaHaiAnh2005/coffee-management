import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiCoffee,
  FiShoppingBag,
  FiFileText,
  FiBox,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';
import { useCartStore } from '../stores/useCartStore';

export const Sidebar: React.FC = () => {
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const navItems = [
    { path: '/', label: 'Bán Hàng POS', icon: FiShoppingBag, badge: cartItemsCount > 0 ? cartItemsCount : null },
    { path: '/tables', label: 'Sơ Đồ Bàn', icon: FiGrid },
    { path: '/menu', label: 'Thực Đơn', icon: FiCoffee },
    { path: '/orders', label: 'Hóa Đơn', icon: FiFileText },
    { path: '/inventory', label: 'Kho Hàng', icon: FiBox },
    { path: '/dashboard', label: 'Báo Cáo', icon: FiBarChart2 },
    { path: '/settings', label: 'Cài Đặt', icon: FiSettings },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col h-screen border-r border-stone-800 shrink-0">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-stone-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xl shadow-lg shadow-amber-900/30">
          ☕
        </div>
        <div>
          <h1 className="font-bold text-stone-100 text-base leading-tight tracking-wide">
            88 BỒNG BIÊNG
          </h1>
          <p className="text-xs text-amber-500 font-medium">POS & Management</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? 'bg-amber-600/15 text-amber-400 font-semibold border border-amber-600/30 shadow-sm'
                    : 'hover:bg-stone-800/60 text-stone-400 hover:text-stone-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span className="bg-amber-500 text-stone-950 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-stone-800/80 bg-stone-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 font-semibold text-xs border border-stone-700">
            TN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-200 truncate">Thu Ngân 01</p>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Đang hoạt động
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
