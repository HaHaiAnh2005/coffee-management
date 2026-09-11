import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF7F0] flex flex-col justify-between items-center p-6 relative overflow-hidden">
      {/* Background Floral & Warm Decor Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-[#a3c7e4]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2 pb-4">
        <Link to="/" className="flex items-center gap-2 text-stone-900 font-sans tracking-tight group">
          <span className="text-2xl font-light leading-none">88</span>
          <span className="font-light text-2xl tracking-[0.15em] uppercase font-sans group-hover:text-amber-800 transition-colors">
            BỒNG BIÊNG
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-bold text-stone-600 hover:text-amber-800 flex items-center gap-1 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-amber-900/10 shadow-2xs transition-all"
        >
          <FiArrowLeft /> Trang chủ
        </Link>
      </div>

      {/* Main Form Container Card */}
      <div className="w-full max-w-md bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xl z-10 my-auto">
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#a3c7e4]/30 border border-[#8eb7d8]/40 text-stone-900 font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            ❀
          </div>
          <h2 className="font-extrabold text-stone-950 text-2xl font-product tracking-wide">
            Thưởng Thức Bồng Biêng
          </h2>
          <p className="text-xs text-stone-500 font-medium">Đăng nhập / Đăng ký tài khoản trải nghiệm dịch vụ</p>
        </div>

        <Outlet />
      </div>

      {/* Footer copyright note */}
      <div className="z-10 pt-4 text-center text-[11px] text-stone-400 font-medium">
        © 88 BỒNG BIÊNG - Trà Hương Hoa & Cà Phê Mộc Thủ Công
      </div>
    </div>
  );
};
