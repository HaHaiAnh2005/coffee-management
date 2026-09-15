import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTableStore } from '../../stores/useTableStore';
import { useCartStore } from '../../store/cart.store';
import type { Table, TableStatus } from '../../types';
import { FiGrid, FiUsers, FiCheckCircle, FiCoffee, FiMapPin, FiCheck } from 'react-icons/fi';

export const TableMap: React.FC = () => {
  const navigate = useNavigate();
  const { tables, areas, selectedAreaId, setSelectedAreaId } = useTableStore();
  const { selectedTableId, setSelectedTable } = useCartStore();

  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [selectedTableNotification, setSelectedTableNotification] = useState<string | null>(null);

  // Status counts
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  const filteredTables = tables.filter((t) => {
    const matchesArea = selectedAreaId === 'all' || t.areaId === selectedAreaId;
    const matchesAvailability = onlyAvailable ? t.status === 'available' : true;
    return matchesArea && matchesAvailability;
  });

  const handleSelectTable = (table: Table) => {
    if (table.status !== 'available') return;
    setSelectedTable(table.id, table.name);
    setSelectedTableNotification(`Đã chọn "${table.name}"! Bạn có thể gọi nước ngay bây giờ.`);
    setTimeout(() => {
      setSelectedTableNotification(null);
      navigate('/menu');
    }, 1800);
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 🟢 Bàn Trống
          </span>
        );
      case 'occupied':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-600" /> 🔴 Có Khách
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-800 border border-blue-500/30 text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> 🟡 Đã Đặt
          </span>
        );
      case 'cleaning':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-800 border border-rose-500/30 text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> 🧹 Cần Dọn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-stone-900 pb-16">
      {/* Toast notification */}
      {selectedTableNotification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs animate-bounce">
          <FiCheckCircle className="w-5 h-5 text-emerald-200" />
          <span>{selectedTableNotification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#a3c7e4] via-[#b6d5ed] to-[#c7e0f2] border border-[#8eb7d8] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-stone-900">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            🪑 SƠ ĐỒ BÀN TRỰC TUYẾN TẠI QUÁN
          </span>
          <h1 className="text-3xl font-extrabold text-stone-950 font-product tracking-wide">
            Danh Sách Bàn Trống Tại 88 BỒNG BIÊNG
          </h1>
          <p className="text-xs text-stone-700 max-w-xl leading-relaxed">
            Xem nhanh vị trí bàn còn trống trên các tầng, chọn bàn của bạn để thưởng thức trà & cà phê mộc đậm vị!
          </p>
        </div>

        {/* Real-time counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/80 backdrop-blur-xs border border-white/90 rounded-2xl p-3.5 text-center shadow-xs">
            <span className="text-2xl font-black text-emerald-600 block">{availableCount}</span>
            <span className="text-[11px] font-bold text-stone-600">🟢 Bàn Trống</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs border border-white/90 rounded-2xl p-3.5 text-center shadow-xs">
            <span className="text-2xl font-black text-amber-700 block">{occupiedCount}</span>
            <span className="text-[11px] font-bold text-stone-600">🔴 Có Khách</span>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/10 pb-4">
        {/* Area Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedAreaId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedAreaId === 'all'
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-50'
            }`}
          >
            Tất Cả Khu Vực ({tables.length})
          </button>
          {areas.map((area) => (
            <button
              type="button"
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedAreaId === area.id
                  ? 'bg-amber-800 text-white shadow-md'
                  : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-50'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* Filter Bàn Trống Switcher */}
        <button
          type="button"
          onClick={() => setOnlyAvailable(!onlyAvailable)}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            onlyAvailable
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white border-amber-200 text-stone-800 hover:bg-amber-50'
          }`}
        >
          <span>{onlyAvailable ? '✓ Chỉ hiện Bàn Trống (Available)' : 'Hiện Tất Cả Bàn'}</span>
        </button>
      </div>

      {/* Tables Grid Display */}
      {filteredTables.length === 0 ? (
        <div className="bg-white border border-amber-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <p className="text-base font-bold text-stone-800">Không có bàn nào phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => {
              setSelectedAreaId('all');
              setOnlyAvailable(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold cursor-pointer"
          >
            Xem tất cả các bàn
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const area = areas.find((a) => a.id === table.areaId);
            const isAvailable = table.status === 'available';

            return (
              <div
                key={table.id}
                className={`bg-white border rounded-3xl p-5 space-y-4 shadow-xs transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-lg'
                    : isAvailable
                    ? 'border-amber-200/90 hover:border-emerald-500 hover:shadow-md'
                    : 'border-stone-200 bg-stone-50/70 opacity-75'
                }`}
              >
                <div>
                  {/* Top Row: Area & Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-stone-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                      <FiMapPin className="text-amber-700" /> {area?.name.split('-')[0] || table.areaId}
                    </span>
                    {getStatusBadge(table.status)}
                  </div>

                  {/* Table Name */}
                  <h3 className="font-extrabold text-stone-900 text-lg font-product tracking-wide mt-1">
                    {table.name}
                  </h3>

                  {/* Capacity Info */}
                  <p className="text-xs text-stone-500 font-semibold flex items-center gap-1.5 mt-1">
                    <FiUsers className="text-amber-800" /> Key: Sức chứa <span className="font-bold text-stone-900">{table.capacity} chỗ ngồi</span>
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-amber-100">
                  {isSelected ? (
                    <div className="bg-emerald-600 text-white py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm">
                      <FiCheck className="stroke-[3]" /> Đang chọn bàn này
                    </div>
                  ) : isAvailable ? (
                    <button
                      type="button"
                      onClick={() => handleSelectTable(table)}
                      className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <FiCoffee /> Chọn Ngồi Bàn Này ➔
                    </button>
                  ) : (
                    <div className="bg-stone-100 text-stone-400 py-2.5 px-3 rounded-xl font-semibold text-xs text-center">
                      Bàn đang bận
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
