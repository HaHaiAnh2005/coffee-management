import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { FiShield, FiLock, FiMail, FiPhone, FiArrowRight, FiUser, FiKey, FiArrowLeft } from 'react-icons/fi';
import type { Role } from '../../types/auth';

const DEMO_STAFF = [
  { id: 'EMP01', name: 'Nguyễn Văn Chủ Quán', role: 'ADMIN' as Role, roleLabel: 'Chủ Quán (Admin)', pin: '9999', phone: '0988888888', path: '/admin/dashboard' },
  { id: 'EMP02', name: 'Trần Thị Quản Lý', role: 'MANAGER' as Role, roleLabel: 'Quản Lý Cửa Hàng', pin: '1234', phone: '0989999999', path: '/admin/dashboard' },
  { id: 'EMP03', name: 'Nguyễn Văn Thu Ngân', role: 'CASHIER' as Role, roleLabel: 'Thu Ngân POS', pin: 'N/A', phone: '0978888888', path: '/admin/pos' },
  { id: 'EMP04', name: 'Lê Thị Pha Chế', role: 'BARISTA' as Role, roleLabel: 'Pha Chế / Bếp', pin: 'N/A', phone: '0977777777', path: '/admin/orders' },
  { id: 'EMP05', name: 'Trần Văn Phục Vụ', role: 'WAITER' as Role, roleLabel: 'Phục Vụ Bàn', pin: 'N/A', phone: '0966666666', path: '/admin/pos' },
];

export const StaffLogin: React.FC = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [accountInput, setAccountInput] = useState('admin@lauracoffee.vn');
  const [password, setPassword] = useState('123');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanInput = accountInput.trim();

    // Match demo staff if any
    const matched = DEMO_STAFF.find(
      (s) => s.phone === cleanInput || `${s.role.toLowerCase()}@lauracoffee.vn` === cleanInput.toLowerCase() || s.id.toLowerCase() === cleanInput.toLowerCase()
    );

    const staffObj = matched
      ? {
          id: matched.id,
          name: matched.name,
          email: `${matched.role.toLowerCase()}@lauracoffee.vn`,
          phone: matched.phone,
          role: matched.role,
          pin: matched.pin,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        }
      : {
          id: 'EMP01',
          name: 'Nguyễn Văn Chủ Quán',
          email: cleanInput.includes('@') ? cleanInput : 'admin@lauracoffee.vn',
          phone: cleanInput.includes('@') ? '0988888888' : cleanInput,
          role: 'ADMIN' as Role,
          pin: '9999',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        };

    loginSuccess(staffObj, `mock_jwt_token_${staffObj.role.toLowerCase()}`);
    navigate(matched ? matched.path : '/admin/dashboard');
  };

  const handleQuickLogin = (staff: typeof DEMO_STAFF[0]) => {
    loginSuccess(
      {
        id: staff.id,
        name: staff.name,
        email: `${staff.role.toLowerCase()}@lauracoffee.vn`,
        phone: staff.phone,
        role: staff.role,
        pin: staff.pin,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      `mock_jwt_token_${staff.role.toLowerCase()}`
    );
    navigate(staff.path);
  };

  const isInputDigits = /^[0-9+ ]+$/.test(accountInput.trim());

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-sky-900 text-white border border-sky-700 mx-auto flex items-center justify-center text-xl font-bold shadow-md shadow-sky-900/20">
          <FiShield />
        </div>
        <h2 className="text-xl font-bold font-serif-title text-stone-900">Cổng Đăng Nhập Quán (RBAC)</h2>
        <p className="text-xs text-stone-500">Dành riêng cho Nhân viên, Phục vụ, Pha chế, Thu ngân & Quản lý</p>
      </div>

      {/* Staff Login Form */}
      <form onSubmit={handleStaffLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 block">
            Tài khoản / SĐT Nhân viên:
          </label>
          <div className="relative">
            {isInputDigits ? (
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-800 w-4 h-4" />
            ) : accountInput.includes('@') ? (
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-800 w-4 h-4" />
            ) : (
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            )}
            <input
              type="text"
              required
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              placeholder="Nhập SĐT hoặc Email nhân viên..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-800 focus:bg-white shadow-2xs transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 block">Mật khẩu:</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-sky-800 focus:bg-white shadow-2xs transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-700 to-sky-800 hover:from-sky-800 hover:to-sky-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Đăng Nhập Vào Hệ Thống Quản Lý</span>
          <FiArrowRight />
        </button>
      </form>

      {/* 5 Staff Quick Logins */}
      <div className="pt-4 border-t border-stone-200 space-y-2.5">
        <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider">
          ⚡ Thử nghiệm 5 Vai trò Nhân viên (1-Click Login):
        </p>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {DEMO_STAFF.map((staff) => (
            <button
              key={staff.id}
              type="button"
              onClick={() => handleQuickLogin(staff)}
              className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-sky-50 border border-stone-200 hover:border-sky-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <div>
                <p className="text-xs font-bold text-stone-900">{staff.name}</p>
                <p className="text-[10px] text-stone-500">{staff.roleLabel} • {staff.phone}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {staff.pin !== 'N/A' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-0.5">
                    <FiKey className="w-2.5 h-2.5" /> PIN: {staff.pin}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                  {staff.role}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Back to Customer Link */}
      <div className="pt-2 border-t border-stone-100 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-all border border-amber-200"
        >
          <FiArrowLeft /> ← Trở về Cổng Đăng Nhập Khách Hàng
        </Link>
      </div>
    </div>
  );
};
