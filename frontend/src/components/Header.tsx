import React, { useEffect, useState } from 'react';
import { FiClock, FiSearch, FiBell, FiAlertCircle } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useMenuStore } from '../stores/useMenuStore';
import { useInventoryStore } from '../stores/useInventoryStore';

export const Header: React.FC = () => {
  const [timeStr, setTimeStr] = useState(dayjs().format('HH:mm:ss - DD/MM/YYYY'));
  const searchQuery = useMenuStore((state) => state.searchQuery);
  const setSearchQuery = useMenuStore((state) => state.setSearchQuery);
  
  // Tránh lặp vô tận (infinite re-render) do Selector tạo ra mảng mới:
  const inventoryItems = useInventoryStore((state) => state.items);
  const lowStockItems = inventoryItems.filter((item) => item.quantity <= item.minAlertThreshold);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(dayjs().format('HH:mm:ss - DD/MM/YYYY'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-stone-900 border-b border-stone-800 px-6 flex items-center justify-between shrink-0">
      {/* Search Input */}
      <div className="relative w-72">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm món, mã đơn..."
          className="w-full bg-stone-950/70 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 transition-colors"
        />
      </div>

      {/* Clock & Notifications */}
      <div className="flex items-center gap-5">
        {lowStockItems.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-medium">
            <FiAlertCircle className="w-4 h-4 animate-bounce" />
            <span>Có {lowStockItems.length} nguyên liệu sắp hết kho</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-stone-400 text-xs font-medium bg-stone-950/50 px-3.5 py-2 rounded-xl border border-stone-800/80">
          <FiClock className="w-4 h-4 text-amber-500" />
          <span>{timeStr}</span>
        </div>

        <button className="relative p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 transition-colors">
          <FiBell className="w-4 h-4" />
          {lowStockItems.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>
      </div>
    </header>
  );
};
