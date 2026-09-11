import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#a3c7e4] text-stone-900 border-t border-stone-800/10 p-6 text-center text-xs font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-800">
        <p>© 2026 88 BỒNG BIÊNG - Trà Hương Hoa Ủ Nhiệt Thấu Đêm & Cà Phê Mộc. All rights reserved.</p>

        {/* Subtle, discrete link for internal staff login */}
        <Link
          to="/admin/login"
          className="text-[11px] text-stone-600 hover:text-stone-950 hover:underline transition-opacity opacity-50 hover:opacity-100 font-mono"
        >
          Quản trị nội bộ
        </Link>
      </div>
    </footer>
  );
};
