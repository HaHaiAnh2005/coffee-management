import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { FiLock, FiMail, FiPhone, FiArrowRight, FiUser, FiShield, FiKey } from 'react-icons/fi';
import type { Role, User } from '../../types/auth';

const DEMO_CUSTOMERS = [
  { id: 'CUS-005', name: 'Lê Thị Khánh Huyền', phone: '0977888999', email: 'khanhhuyen.le@gmail.com', tier: 'Kim Cương 💎' },
  { id: 'CUS-002', name: 'Hoàng Quốc Việt', phone: '0987654321', email: 'quocviet@gmail.com', tier: 'Kim Cương 💎' },
  { id: 'CUS-004', name: 'Nguyễn Văn Hải', phone: '0933444555', email: 'vanhai.nguyen@gmail.com', tier: 'Vàng 🌟' },
  { id: 'CUS-001', name: 'Phạm Minh Anh', phone: '0912345678', email: 'minhanh@gmail.com', tier: 'Vàng 🌟' },
  { id: 'CUS-003', name: 'Đỗ Thùy Trang', phone: '0905111222', email: 'thuytrang@gmail.com', tier: 'Bạc 🥈' },
];

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
  const [activeTab, setActiveTab] = useState<'customer' | 'staff'>('customer');
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
      // 1. Try real API Login
      const res = await authApi.login({
        identifier: cleanInput,
        email: cleanInput,
        accountInput: cleanInput,
        password,
      });

      if (res?.success && res.data?.user) {
        const user = res.data.user;
        loginSuccess(user, res.data.token || 'jwt_token_auth');
        redirectByRole(user);
        return;
      }
    } catch (err: any) {
      console.warn('API login error, checking fallback demo data:', err);
    } finally {
      setLoading(false);
    }

    // 2. Check DEMO_STAFF matching
    const matchedStaff = DEMO_STAFF.find(
      (s) =>
        s.phone === cleanInput ||
        s.email?.toLowerCase() === cleanInput.toLowerCase() ||
        s.id.toLowerCase() === cleanInput.toLowerCase() ||
        `${s.role.toLowerCase()}@lauracoffee.vn` === cleanInput.toLowerCase()
    );

    if (matchedStaff) {
      handleQuickLoginStaff(matchedStaff);
      return;
    }

    // 3. Check DEMO_CUSTOMERS matching
    const matchedCus = DEMO_CUSTOMERS.find(
      (c) =>
        c.phone === cleanInput ||
        c.email.toLowerCase() === cleanInput.toLowerCase() ||
        c.id.toLowerCase() === cleanInput.toLowerCase()
    );

    if (matchedCus) {
      handleQuickCustomerLogin(matchedCus);
      return;
    }

    // 4. Heuristic role detection for new/unmatched inputs
    const isLikelyStaff =
      cleanInput.toLowerCase().includes('admin') ||
      cleanInput.toLowerCase().includes('manager') ||
      cleanInput.toLowerCase().includes('staff') ||
      cleanInput.toLowerCase().includes('@lauracoffee') ||
      cleanInput.toUpperCase().startsWith('EMP');

    if (isLikelyStaff) {
      const staffUser: User = {
        id: 'EMP01',
        name: 'Nguyễn Văn Chủ Quán',
        email: cleanInput.includes('@') ? cleanInput : 'admin@lauracoffee.vn',
        phone: '0988888888',
        role: 'ADMIN',
        pin: '9999',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      loginSuccess(staffUser, 'mock_jwt_token_admin');
      navigate('/admin/dashboard');
    } else {
      const customerUser: User = {
        id: `CUS-${Date.now().toString().slice(-4)}`,
        name: 'Khách Hàng Bồng Biêng',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@gmail.com`,
        phone: cleanInput.includes('@') ? '0988888888' : cleanInput,
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      };
      loginSuccess(customerUser, 'mock_jwt_token_customer');
      navigate('/');
    }
  };

  const handleQuickCustomerLogin = (cus: typeof DEMO_CUSTOMERS[0]) => {
    const userObj: User = {
      id: cus.id,
      name: cus.name,
      email: cus.email,
      phone: cus.phone,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };
    loginSuccess(userObj, 'mock_jwt_token_customer');
    navigate('/');
  };

  const handleQuickLoginStaff = (staff: typeof DEMO_STAFF[0]) => {
    const staffObj: User = {
      id: staff.id,
      name: staff.name,
      email: staff.email || `${staff.role.toLowerCase()}@lauracoffee.vn`,
      phone: staff.phone,
      role: staff.role,
      pin: staff.pin,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    loginSuccess(staffObj, `mock_jwt_token_${staff.role.toLowerCase()}`);
    navigate(staff.path);
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

      {/* 1-Click Quick Login Section with 2 Tabs */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider">
            ⚡ Đăng nhập thử nghiệm (1-Click):
          </p>
          <span className="text-[10px] text-stone-400 font-medium">Demo Data</span>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-white text-amber-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ☕ Khách Hàng (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-sky-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FiShield className="w-3 h-3" /> Quản Lý / Nhân Viên (5)
          </button>
        </div>

        {/* Customer Demo Accounts */}
        {activeTab === 'customer' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {DEMO_CUSTOMERS.map((cus) => (
              <button
                key={cus.id}
                type="button"
                onClick={() => handleQuickCustomerLogin(cus)}
                className="w-full p-2 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 flex items-center justify-between transition-all cursor-pointer group text-left"
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
        )}

        {/* Staff Demo Accounts */}
        {activeTab === 'staff' && (
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {DEMO_STAFF.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => handleQuickLoginStaff(staff)}
                className="w-full p-2 rounded-xl bg-stone-50 hover:bg-sky-50 border border-stone-200 hover:border-sky-300 flex items-center justify-between transition-all cursor-pointer text-left"
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
        )}
      </div>

      <div className="text-center text-xs text-stone-600 pt-1 font-medium">
        Chưa có tài khoản Bồng Biêng?{' '}
        <Link to="/register" className="text-amber-800 font-extrabold hover:underline">
          Đăng ký thành viên ngay
        </Link>
      </div>
    </div>
  );
};
