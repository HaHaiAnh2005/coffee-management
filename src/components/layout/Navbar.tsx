import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const cartItemsCount = useCartStore((state) => state.items.reduce((s, i) => s + i.quantity, 0));
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    const isStaff = user?.role && user.role !== 'CUSTOMER';
    logout();
    navigate(isStaff ? '/admin/login' : '/login');
  };

  const navItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/chuyen-bong-bieng', label: 'Chuyện Bông Biêng' },
    { path: '/menu', label: 'Menu' },
    { path: '/order-history', label: 'Lịch sử đơn hàng' },
    { path: '/chinh-sach-thanh-vien', label: 'Chính sách thành viên' },
    { path: '/tin-tuc', label: 'Tin tức' },
    { path: '/lien-he', label: 'Liên hệ' },
  ];

  return (
    <header className="bg-[#a3c7e4] text-stone-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Logo (Exact Bông Biêng Style) */}
        <Link to="/" className="flex items-center gap-2 text-stone-900 font-sans tracking-tight">
          <span className="text-2xl font-light leading-none">88</span>
          <span className="font-light text-2xl tracking-[0.15em] uppercase font-sans">
            BỒNG BIÊNG
          </span>
        </Link>

        {/* Center / Right Nav Items */}
        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-stone-900">
          {navItems.map((item, idx) => (
            <NavLink
              key={`${item.path}-${idx}`}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `py-1 transition-all relative whitespace-nowrap hover:font-semibold ${
                  isActive ? 'font-semibold' : 'text-stone-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-stone-900 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Cart & Auth Quick Actions */}
        <div className="flex items-center gap-3 border-l border-stone-800/15 pl-4">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-stone-900 hover:opacity-80 transition-opacity"
            title="Giỏ hàng"
          >
            <FiShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-100 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.role !== 'CUSTOMER' && (
                <Link
                  to="/admin/dashboard"
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-400 transition-colors shadow-sm"
                  title="Vào giao diện Quản Lý / POS"
                >
                  <FiShield /> {user.role} Portal
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:opacity-80 bg-white/40 px-2.5 py-1.5 rounded-lg border border-stone-900/10"
              >
                <FiUser className="w-4 h-4" />
                <span className="max-w-[80px] truncate">{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-stone-900 text-white hover:bg-rose-600 transition-colors text-xs cursor-pointer"
                title="Đăng xuất"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-lg bg-white/70 text-stone-900 text-xs font-bold hover:bg-white transition-colors border border-stone-800/15"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
