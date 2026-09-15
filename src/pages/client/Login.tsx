import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { FiLock, FiMail, FiPhone, FiArrowRight, FiUser } from 'react-icons/fi';

const DEMO_CUSTOMERS = [
  { id: 'CUS-005', name: 'Lê Thị Khánh Huyền', phone: '0977888999', email: 'khanhhuyen.le@gmail.com', tier: 'Kim Cương 💎' },
  { id: 'CUS-002', name: 'Hoàng Quốc Việt', phone: '0987654321', email: 'quocviet@gmail.com', tier: 'Kim Cương 💎' },
  { id: 'CUS-004', name: 'Nguyễn Văn Hải', phone: '0933444555', email: 'vanhai.nguyen@gmail.com', tier: 'Vàng 🌟' },
  { id: 'CUS-001', name: 'Phạm Minh Anh', phone: '0912345678', email: 'minhanh@gmail.com', tier: 'Vàng 🌟' },
  { id: 'CUS-003', name: 'Đỗ Thùy Trang', phone: '0905111222', email: 'thuytrang@gmail.com', tier: 'Bạc 🥈' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [accountInput, setAccountInput] = useState('0977888999');
  const [password, setPassword] = useState('123');

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanInput = accountInput.trim();

    const matched = DEMO_CUSTOMERS.find(
      (c) => c.phone === cleanInput || c.email.toLowerCase() === cleanInput.toLowerCase() || c.id.toLowerCase() === cleanInput.toLowerCase()
    );

    const customerObj = matched
      ? {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          phone: matched.phone,
          role: 'CUSTOMER' as const,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        }
      : {
          id: `CUS-${Date.now().toString().slice(-4)}`,
          name: 'Khách Hàng Bồng Biêng',
          email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@gmail.com`,
          phone: cleanInput.includes('@') ? '0988888888' : cleanInput,
          role: 'CUSTOMER' as const,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        };

    loginSuccess(customerObj, 'mock_jwt_token_customer');
    navigate('/');
  };

  const handleQuickCustomerLogin = (cus: typeof DEMO_CUSTOMERS[0]) => {
    loginSuccess(
      {
        id: cus.id,
        name: cus.name,
        email: cus.email,
        phone: cus.phone,
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      },
      'mock_jwt_token_customer'
    );
    navigate('/');
  };

  const isInputDigits = /^[0-9+ ]+$/.test(accountInput.trim());

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 mx-auto flex items-center justify-center text-xl font-bold shadow-xs">
          ☕
        </div>
        <h2 className="text-xl font-bold font-serif-title text-stone-900">Đăng Nhập Khách Hàng</h2>
        <p className="text-xs text-stone-500">Tích điểm đổi quà & trải nghiệm dịch vụ Bồng Biêng Coffee</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleCustomerLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 block">
            Email hoặc Số điện thoại:
          </label>
          <div className="relative">
            {isInputDigits ? (
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800 w-4 h-4" />
            ) : accountInput.includes('@') ? (
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800 w-4 h-4" />
            ) : (
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            )}
            <input
              type="text"
              required
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              placeholder="Nhập SĐT (0977...) hoặc Email..."
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
                alert('Vui lòng liên hệ Hotline Bồng Biêng 0988-888-888 để được hỗ trợ cấp lại mật khẩu!');
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
          className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Đăng Nhập Thành Viên</span>
          <FiArrowRight />
        </button>
      </form>

      {/* 5 Customer Accounts Quick Login Shortcuts */}
      <div className="pt-4 border-t border-stone-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider">
            ⚡ Đăng nhập nhanh Khách Hàng (1-Click):
          </p>
          <span className="text-[10px] text-amber-800 font-bold">Demo Accounts</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {DEMO_CUSTOMERS.map((cus) => (
            <button
              key={cus.id}
              type="button"
              onClick={() => handleQuickCustomerLogin(cus)}
              className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 flex items-center justify-between transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-800 text-white text-[11px] font-bold flex items-center justify-center">
                  {cus.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {cus.name}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">{cus.phone} • {cus.email}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                {cus.tier}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-stone-600 pt-1 font-medium">
        Chưa có tài khoản Bồng Biêng?{' '}
        <Link to="/register" className="text-amber-800 font-extrabold hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};
