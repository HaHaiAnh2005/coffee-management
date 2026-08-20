import React from 'react';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { FiGrid } from 'react-icons/fi';

export const Categories: React.FC = () => {
  return (
    <div className="space-y-6 text-stone-900">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <FiGrid className="text-sky-600" /> Quản Lý Danh Mục (Categories)
        </h1>
        <p className="text-xs text-stone-500 mt-1">Danh sách phân loại sản phẩm trong quán</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_CATEGORIES.map((c) => (
          <div key={c.id} className="bg-white border border-sky-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">{c.name}</h3>
              <p className="text-xs text-stone-500 mt-1">Mã: {c.id}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
              ☕
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
