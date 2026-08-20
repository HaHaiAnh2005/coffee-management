import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import { INITIAL_CUSTOMERS } from '../../api/customer.api';
import type { Customer } from '../../types/customer';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiUser, FiStar, FiPhone, FiMail, FiAward, FiDollarSign, FiLogOut, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'coffee_admin_customers_data';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-stone-200 rounded-3xl p-8 text-center space-y-4 shadow-md">
        <FiUser className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Chưa Đăng Nhập</h2>
        <p className="text-xs text-stone-500">Vui lòng đăng nhập để xem thông tin hồ sơ và điểm thưởng của bạn.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Đăng Nhập Ngay
        </button>
      </div>
    );
  }

  // Load customer details from LocalStorage or INITIAL_CUSTOMERS matching logged in user
  let customersData: Customer[] = INITIAL_CUSTOMERS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) customersData = JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse customers data', e);
  }

  const matchedCustomer = customersData.find(
    (c) => c.phone === user.phone || c.email.toLowerCase() === user.email.toLowerCase() || c.id === user.id
  );

  const rewardPoints = matchedCustomer ? matchedCustomer.rewardPoints : 240;
  const totalSpent = matchedCustomer ? matchedCustomer.totalSpent : 2400000;
  const tier = matchedCustomer ? matchedCustomer.tier : 'Vàng';

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-stone-900 py-4">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiUser className="text-amber-800" /> Hồ Sơ Cá Nhân
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Thông tin tài khoản và điểm thưởng thành viên Bồng Biêng</p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
        >
          <FiLogOut /> Đăng xuất
        </button>
      </div>

      <div className="bg-white border border-amber-900/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left border-b border-stone-100 pb-6">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-100 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-800 text-white font-black text-2xl flex items-center justify-center border-4 border-amber-100 shadow-md">
                {initials}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border ${
                tier === 'Kim Cương'
                  ? 'bg-cyan-500 text-white border-cyan-400'
                  : tier === 'Vàng'
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-slate-500 text-white border-slate-400'
              }`}
            >
              {tier}
            </span>
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-extrabold text-stone-950 text-xl font-product tracking-wide">{user.name}</h2>
              {user.role === 'ADMIN' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-800 text-white text-[10px] font-bold flex items-center gap-1">
                  <FiShield /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {user.role === 'ADMIN' ? 'Tài Khoản Quản Lý Hệ Thống' : 'Khách Hàng Thành Viên 88 Bồng Biêng'}
            </p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 flex-wrap">
              <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                <FiStar className="fill-amber-500 text-amber-500 stroke-[2]" />
                <span>{rewardPoints} điểm tích lũy</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                <FiDollarSign className="text-emerald-700 stroke-[2.5]" />
                <span>Tổng chi: {formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Account Information */}
        <div className="space-y-3.5 text-xs text-stone-700">
          <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Thông Tin Liên Hệ</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-sm">
                <FiMail />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">Địa chỉ Email</p>
                <p className="font-bold text-stone-900">{user.email}</p>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-sm">
                <FiPhone />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">Số điện thoại</p>
                <p className="font-bold text-stone-900">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => navigate('/order-history')}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
          >
            📜 Xem Lịch Sử Đơn Hàng
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            ☕ Thưởng Thức Thực Đơn Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
