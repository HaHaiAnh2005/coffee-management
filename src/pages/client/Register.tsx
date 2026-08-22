import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { FiUserCheck, FiShield, FiMail, FiPhone, FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authApi.register({
        name,
        email,
        phone,
        password,
        role,
      });

      if (!response.success) {
        setErrorMessage(response.message || 'Đăng ký không thành công. Vui lòng kiểm tra thông tin.');
        setIsLoading(false);
        return;
      }

      const registeredUser = response.data.user;

      loginSuccess(
        {
          id: registeredUser.id || `U-${Date.now()}`,
          name: registeredUser.name || name,
          email: registeredUser.email || email,
          phone: registeredUser.phone || phone,
          role: role,
          avatar:
            role === 'ADMIN'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
        'mock_jwt_token_laura_coffee_2026'
      );

      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã xảy ra lỗi khi kết nối server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Role Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-stone-700 block">Loại tài khoản muốn đăng ký:</label>
        <div className="grid grid-cols-2 p-1.5 bg-stone-100 rounded-2xl border border-amber-900/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'CUSTOMER'
                ? 'bg-white text-amber-900 font-extrabold shadow-sm border border-amber-900/10'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FiUserCheck className="w-4 h-4" /> Khách Hàng
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'ADMIN'
                ? 'bg-amber-800 text-white font-extrabold shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FiShield className="w-4 h-4" /> Quản Lý (Admin)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Họ và tên:</label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'ADMIN' ? 'Nguyễn Văn Quản Lý...' : 'Nguyễn Văn A...'}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Email:</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'ADMIN' ? 'admin@lauracoffee.com' : 'khachhang@gmail.com'}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Số điện thoại:</label>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0988..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Mật khẩu:</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>
            {isLoading
              ? 'Đang xử lý...'
              : role === 'ADMIN'
              ? 'Đăng Ký Tài Khoản Quản Lý'
              : 'Đăng Ký Tài Khoản Khách Hàng'}
          </span>
          {!isLoading && <FiArrowRight />}
        </button>

        <div className="text-center text-xs text-stone-600 pt-3 border-t border-stone-200 font-medium">
          Đã có tài khoản Bồng Biêng?{' '}
          <Link to="/login" className="text-amber-800 font-extrabold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </div>
  );
};
