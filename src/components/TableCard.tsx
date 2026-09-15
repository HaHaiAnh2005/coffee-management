import React from 'react';
import type { Table, TableStatus } from '../types';
import { useOrderStore } from '../stores/useOrderStore';
import { useTableStore } from '../stores/useTableStore';
import { formatVND } from '../utils/formatters';
import { FiUser, FiClock } from 'react-icons/fi';
import dayjs from 'dayjs';

interface TableCardProps {
  table: Table;
  isSelected?: boolean;
  onSelect: (table: Table) => void;
  onOpenStatusModal?: (table: Table) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, isSelected, onSelect, onOpenStatusModal }) => {
  const order = useOrderStore((state) =>
    table.currentOrderId ? state.getOrderById(table.currentOrderId) : undefined
  );
  const updateTableStatus = useTableStore((state) => state.updateTableStatus);

  const statusConfig = {
    available: { label: '🟢 Trống', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    occupied: { label: '🔴 Có khách', color: 'bg-amber-100 text-amber-900 border-amber-400 font-bold' },
    reserved: { label: '🟡 Đã đặt', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    cleaning: { label: '🧹 Cần dọn', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  };

  const currentStatus = statusConfig[table.status];

  const handleQuickStatusChange = (e: React.MouseEvent, status: TableStatus) => {
    e.stopPropagation();
    updateTableStatus(table.id, status);
  };

  return (
    <div
      onClick={() => onSelect(table)}
      className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[150px] shadow-xs group ${
        isSelected
          ? 'bg-sky-100 border-sky-600 shadow-md ring-2 ring-sky-500/30'
          : 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-md'
      }`}
    >
      {/* Table Name & Status Badge */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-1.5">
          {table.name}
        </h3>
        <button
          type="button"
          onClick={(e) => {
            if (onOpenStatusModal) {
              e.stopPropagation();
              onOpenStatusModal(table);
            }
          }}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all shadow-2xs hover:scale-105 cursor-pointer ${currentStatus.color}`}
          title="Nhấp để đổi trạng thái bàn"
        >
          {currentStatus.label}
        </button>
      </div>

      {/* Quick Status Control Bar (Visible on hover/touch) */}
      <div className="flex items-center justify-between bg-sky-50/80 border border-sky-200 rounded-xl p-1 gap-1 my-1">
        <button
          type="button"
          onClick={(e) => handleQuickStatusChange(e, 'available')}
          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
            table.status === 'available'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-800 hover:bg-emerald-100'
          }`}
          title="Bàn Trống (Có thể xếp khách)"
        >
          Trống
        </button>

        <button
          type="button"
          onClick={(e) => handleQuickStatusChange(e, 'occupied')}
          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
            table.status === 'occupied'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-800 hover:bg-sky-100'
          }`}
          title="Bàn Có Khách"
        >
          Khách
        </button>

        <button
          type="button"
          onClick={(e) => handleQuickStatusChange(e, 'reserved')}
          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
            table.status === 'reserved'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-blue-800 hover:bg-blue-100'
          }`}
          title="Bàn Đã Đặt Trước"
        >
          Đặt
        </button>

        <button
          type="button"
          onClick={(e) => handleQuickStatusChange(e, 'cleaning')}
          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
            table.status === 'cleaning'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-800 hover:bg-rose-100'
          }`}
          title="Bàn Cần Dọn Dẹp"
        >
          Dọn
        </button>
      </div>

      {/* Occupied Details or Table Info */}
      {table.status === 'occupied' && order ? (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center justify-between text-stone-700 font-semibold">
            <span className="text-stone-500">Tạm tính:</span>
            <span className="font-extrabold text-sky-800">{formatVND(order.total)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <FiClock className="w-3 h-3 text-stone-400" />
            <span>Vào lúc: {table.occupiedAt ? dayjs(table.occupiedAt).format('HH:mm') : ''}</span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-stone-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <FiUser className="w-3.5 h-3.5" />
            {table.capacity} khách
          </span>
          <span className="text-[10px] font-semibold text-stone-400">
            {table.areaId === 'floor1' ? 'Tầng 1' : table.areaId === 'floor2' ? 'Tầng 2' : 'Sân vườn'}
          </span>
        </div>
      )}
    </div>
  );
};
