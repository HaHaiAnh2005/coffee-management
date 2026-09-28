import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { FiLock, FiMail, FiPhone, FiArrowRight, FiUser, FiShield } from 'react-icons/fi';
import type { Role, User } from '../../types/auth';

const DEMO_STAFF = [
  { id: 'EMP01', name: 'Nguyễn Văn Chủ Quán', role: 'ADMIN' as Role, roleLabel: 'Chủ Quán (Admin)', pin: '9999', phone: '0988888888', email: 'admin@lauracoffee.vn', path: '/admin/dashboard' },
  { id: 'EMP02', name: 'Trần Thị Quản Lý', role: 'MANAGER' as Role, roleLabel: 'Quản Lý Cửa Hàng', pin: '1234', phone: '0989999999', email: 'manager@lauracoffee.vn', path: '/admin/dashboard' },
  { id: 'EMP03', name: 'Nguyễn Văn Thu Ngân', role: 'CASHIER' as Role, roleLabel: 'Thu Ngân & Đơn Hàng', pin: 'N/A', phone: '0978888888', email: 'cashier@lauracoffee.vn', path: '/admin/orders' },
  { id: 'EMP04', name: 'Lê Thị Pha Chế', role: 'BARISTA' as Role, roleLabel: 'Pha Chế / Bếp', pin: 'N/A', phone: '0977777777', email: 'barista@lauracoffee.vn', path: '/admin/orders' },
  { id: 'EMP05', name: 'Trần Văn Phục Vụ', role: 'WAITER' as Role, roleLabel: 'Nhân Viên Hỗ Trợ', pin: 'N/A', phone: '0966666666', email: 'waiter@lauracoffee.vn', path: '/admin/orders' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [accountInput, setAccountInput] = useState('0977888999');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto redirect helper based on role
  const redirectByRole = (user: User) => {
    const role = (user.role || 'CUSTOMER').toUpperCase();
    if (role === 'ADMIN' || role === 'MANAGER') {
      navigate('/admin/dashboard');
    } else if (role === 'CASHIER' || role === 'WAITER' || role === 'BARISTA') {
      navigate('/admin/orders');
    } else {
      navigate('/');
    }
  };

  // Smart Form Login: Automatically detects if user is Staff or Customer
  const handleSmartLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanInput = accountInput.trim();

    try {
      const res = await authApi.login({ identifier: cleanInput, email: cleanInput, accountInput: cleanInput, password });
      if (!res?.success || !res.data?.user || !res.data.token) {
        throw new Error('Không thể đăng nhập. Vui lòng kiểm tra tài khoản và mật khẩu.');
      }
      loginSuccess(res.data.user, res.data.token);
      redirectByRole(res.data.user);
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Không thể đăng nhập. Vui lòng thử lại.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Detection indicators
  const cleanInput = accountInput.trim();
  const isInputDigits = /^[0-9+ ]+$/.test(cleanInput);
  const isDetectedStaff =
    DEMO_STAFF.some(
      (s) =>
        s.phone === cleanInput ||
        s.email?.toLowerCase() === cleanInput.toLowerCase() ||
        s.id.toLowerCase() === cleanInput.toLowerCase()
    ) ||
    cleanInput.toLowerCase().includes('admin') ||
    cleanInput.toLowerCase().includes('manager') ||
    cleanInput.toLowerCase().includes('@lauracoffee') ||
    cleanInput.toUpperCase().startsWith('EMP');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-lg font-bold shadow-xs">
            ☕
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-900 text-white border border-sky-700 flex items-center justify-center text-lg font-bold shadow-md shadow-sky-900/20">
            <FiShield />
          </div>
        </div>
        <h2 className="text-xl font-bold font-serif-title text-stone-900">Đăng Nhập</h2>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSmartLogin} className="space-y-4">
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700 block">
              Tài khoản:
            </label>
            {cleanInput && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isDetectedStaff
                    ? 'bg-sky-100 text-sky-900 border border-sky-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {isDetectedStaff ? (
                  <>
                    <FiShield className="w-2.5 h-2.5 text-sky-700" /> Quản lý / Nhân viên
                  </>
                ) : (
                  <>
                    <FiUser className="w-2.5 h-2.5 text-amber-800" /> Khách hàng
                  </>
                )}
              </span>
            )}
          </div>

          <div className="relative">
            {isInputDigits ? (
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            ) : accountInput.includes('@') ? (
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            ) : (
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            )}
            <input
              type="text"
              required
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              placeholder="Nhập SĐT (09...), Email hoặc Mã NV (EMP01)..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white shadow-2xs transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700">Mật khẩu:</label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Vui lòng liên hệ Hotline Bồng Biêng 0988-888-888 hoặc Quản lý để được hỗ trợ cấp lại mật khẩu!');
              }}
              className="text-[11px] text-amber-800 hover:underline font-semibold"
            >
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white shadow-2xs transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
            isDetectedStaff
              ? 'bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950'
              : 'bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950'
          }`}
        >
          <span>
            {loading
              ? 'Đang xác thực...'
              : isDetectedStaff
              ? 'Đăng Nhập Quản Trị / POS'
              : 'Đăng Nhập Thành Viên'}
          </span>
          <FiArrowRight />
        </button>
      </form>

      <div className="text-center text-xs text-stone-600 pt-1 font-medium">
        Chưa có tài khoản Bồng Biêng?{' '}
        <Link to="/register" className="text-amber-800 font-extrabold hover:underline">
          Đăng ký thành viên ngay
        </Link>
      </div>
    </div>
  );
};
