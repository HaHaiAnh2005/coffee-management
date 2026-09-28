import { ValidatedInput } from '../../components/common/ValidatedInput';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { FiMail, FiPhone, FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');

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
        activationCode: activationCode.trim() || undefined,
        role: 'CUSTOMER',
      });

      if (!response.success) {
        setErrorMessage(response.message || 'Đăng ký không thành công. Vui lòng kiểm tra thông tin.');
        setIsLoading(false);
        return;
      }

      const session = await authApi.login({ email, password });
      if (!session.success || !session.data?.token || !session.data.user) {
        setErrorMessage('Tài khoản đã được tạo. Vui lòng vào trang đăng nhập để tiếp tục.');
        return;
      }
      loginSuccess(session.data.user, session.data.token);

      navigate('/');
    } catch (err: unknown) {
      setErrorMessage(err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Đã xảy ra lỗi khi kết nối server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Họ và tên:</label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <ValidatedInput kind="person"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Email:</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <ValidatedInput kind="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="khachhang@gmail.com"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Số điện thoại:</label>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <ValidatedInput kind="phone"
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
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="activation-code" className="text-xs font-bold text-stone-700">Mã kích hoạt (khách đã có hồ sơ tại quán)</label>
          <input id="activation-code" value={activationCode} onChange={e => setActivationCode(e.target.value)} autoComplete="off" placeholder="Nhập mã quản trị viên cấp" className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-xs" />
          <p className="text-xs text-stone-500">Khách cũ liên hệ quán để xác nhận và nhận mã có hiệu lực 30 phút. Dùng đúng email và số điện thoại trong hồ sơ để giữ điểm và hạng. Khách mới để trống mục này.</p>
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
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản Khách Hàng'}
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
