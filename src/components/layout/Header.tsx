import React, { useEffect, useState } from 'react';
import { FiClock, FiSearch, FiBell, FiAlertCircle } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useProductStore } from '../../store/product.store';
import { useInventoryStore } from '../../stores/useInventoryStore';

export const Header: React.FC = () => {
  const [timeStr, setTimeStr] = useState(dayjs().format('HH:mm:ss - DD/MM/YYYY'));
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);

  const inventoryItems = useInventoryStore((state) => state.items);
  const lowStockItems = inventoryItems.filter((item) => item.quantity <= item.minAlertThreshold);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(dayjs().format('HH:mm:ss - DD/MM/YYYY'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-18 bg-white/90 backdrop-blur-xl border-b border-sky-100 px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
      <div className="relative w-80">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-600 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm món, mã đơn hàng, bàn..."
          className="w-full bg-sky-50/40 border border-sky-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-500 transition-colors shadow-xs"
        />
      </div>

      <div className="flex items-center gap-4">
        {lowStockItems.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
            <FiAlertCircle className="w-4 h-4 animate-bounce text-amber-600" />
            <span>Có {lowStockItems.length} nguyên liệu kho sắp hết</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-stone-700 text-xs font-bold bg-sky-50/70 px-4 py-2 rounded-2xl border border-sky-200/80">
          <FiClock className="w-4 h-4 text-sky-600" />
          <span>{timeStr}</span>
        </div>

        <button className="relative p-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100/80 transition-all shadow-xs cursor-pointer">
          <FiBell className="w-4.5 h-4.5" />
          {lowStockItems.length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />}
        </button>
      </div>
    </header>
  );
};
