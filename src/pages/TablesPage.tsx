import React, { useState } from 'react';
import { useTableStore } from '../stores/useTableStore';
import { TableCard } from '../components/TableCard';
import type { AreaId, Table, TableStatus } from '../types';
import { FiPlus, FiGrid, FiX, FiTrash2, FiCheck } from 'react-icons/fi';

export const TablesPage: React.FC = () => {
  const { tables, areas, selectedAreaId, setSelectedAreaId, updateTableStatus, addTable, deleteTable } =
    useTableStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTableForModal, setSelectedTableForModal] = useState<Table | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | TableStatus>('all');

  const [newTableName, setNewTableName] = useState('');
  const [newTableArea, setNewTableArea] = useState<AreaId>('floor1');
  const [newTableCapacity, setNewTableCapacity] = useState(4);

  // Status counters
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;
  const cleaningCount = tables.filter((t) => t.status === 'cleaning').length;

  const filteredTables = tables.filter((t) => {
    const matchesArea = selectedAreaId === 'all' || t.areaId === selectedAreaId;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesArea && matchesStatus;
  });

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    addTable({
      name: newTableName.trim(),
      areaId: newTableArea,
      capacity: newTableCapacity,
    });
    setNewTableName('');
    setIsAddModalOpen(false);
  };

  const handleUpdateStatusModal = (tableId: string, status: TableStatus) => {
    updateTableStatus(tableId, status);
    if (selectedTableForModal) {
      setSelectedTableForModal({ ...selectedTableForModal, status });
    }
  };

  return (
    <div className="space-y-6 pb-12 text-stone-900">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiGrid className="text-sky-600" /> Quản Lý Sơ Đồ Bàn & Trạng Thái
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Cập nhật trạng thái Trống, Có khách, Đã đặt trước & Cần dọn dẹp theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/so-do-ban"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs flex items-center gap-1.5 border border-sky-200 transition-all cursor-pointer"
          >
            🪑 Xem Giao Diện Bàn Trống (Khách)
          </a>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <FiPlus className="w-4 h-4 stroke-[3]" /> Thêm Bàn Mới
          </button>
        </div>
      </div>

      {/* Table Status Summary Cards (4 Statuses) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${statusFilter === 'available'
              ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/40 shadow-md scale-[1.02]'
              : 'bg-white border-sky-100 text-stone-700 hover:border-emerald-500/50 shadow-sm'
            }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">🟢 Trống</span>
            <span className="text-lg font-black">{availableCount}</span>
          </div>
          <p className="text-[10px] opacity-80 mt-1">Sẵn sàng xếp khách</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'occupied' ? 'all' : 'occupied')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${statusFilter === 'occupied'
              ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500/40 shadow-md scale-[1.02]'
              : 'bg-white border-sky-100 text-stone-700 hover:border-amber-500/50 shadow-sm'
            }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">🔴 Có Khách</span>
            <span className="text-lg font-black">{occupiedCount}</span>
          </div>
          <p className="text-[10px] opacity-80 mt-1">Đang phục vụ</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'reserved' ? 'all' : 'reserved')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${statusFilter === 'reserved'
              ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/40 shadow-md scale-[1.02]'
              : 'bg-white border-sky-100 text-stone-700 hover:border-blue-500/50 shadow-sm'
            }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">🟡 Đã Đặt Trước</span>
            <span className="text-lg font-black">{reservedCount}</span>
          </div>
          <p className="text-[10px] opacity-80 mt-1">Giữ bàn hẹn giờ</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'cleaning' ? 'all' : 'cleaning')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${statusFilter === 'cleaning'
              ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-500/40 shadow-md scale-[1.02]'
              : 'bg-white border-sky-100 text-stone-700 hover:border-rose-500/50 shadow-sm'
            }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">🧹 Cần Dọn</span>
            <span className="text-lg font-black">{cleaningCount}</span>
          </div>
          <p className="text-[10px] opacity-80 mt-1">Chờ vệ sinh bàn</p>
        </button>
      </div>

      {/* Area Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedAreaId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${selectedAreaId === 'all'
              ? 'bg-sky-600 border-sky-600 text-white shadow-md font-extrabold'
              : 'bg-white border-sky-100 text-stone-700 hover:border-sky-300'
            }`}
        >
          Tất Cả Khu Vực ({tables.length})
        </button>
        {areas.map((area) => (
          <button
            key={area.id}
            onClick={() => setSelectedAreaId(area.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${selectedAreaId === area.id
                ? 'bg-sky-600 border-sky-600 text-white shadow-md font-extrabold'
                : 'bg-white border-sky-100 text-stone-700 hover:border-sky-300'
              }`}
          >
            {area.name} ({tables.filter((t) => t.areaId === area.id).length})
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onSelect={(t) => setSelectedTableForModal(t)}
            onOpenStatusModal={(t) => setSelectedTableForModal(t)}
          />
        ))}
      </div>

      {/* Modal: Status & Details Manager */}
      {selectedTableForModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg">
                  Quản Lý {selectedTableForModal.name}
                </h3>
                <p className="text-xs text-stone-500">Sức chứa: {selectedTableForModal.capacity} khách | Khu vực: {selectedTableForModal.areaId}</p>
              </div>
              <button
                onClick={() => setSelectedTableForModal(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Change Status Buttons (4 Main Statuses) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Cập Nhật Trạng Thái Bàn:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Available */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatusModal(selectedTableForModal.id, 'available')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${selectedTableForModal.status === 'available'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                      : 'bg-sky-50/40 border-sky-200 text-stone-800 hover:bg-sky-100'
                    }`}
                >
                  <div>
                    <p className="text-xs font-extrabold">🟢 Bàn Trống</p>
                    <p className="text-[10px] opacity-80">Sẵn sàng đón khách</p>
                  </div>
                  {selectedTableForModal.status === 'available' && <FiCheck className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Occupied */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatusModal(selectedTableForModal.id, 'occupied')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${selectedTableForModal.status === 'occupied'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-md'
                      : 'bg-sky-50/40 border-sky-200 text-stone-800 hover:bg-sky-100'
                    }`}
                >
                  <div>
                    <p className="text-xs font-extrabold">🔴 Có Khách</p>
                    <p className="text-[10px] opacity-80">Đang phục vụ món</p>
                  </div>
                  {selectedTableForModal.status === 'occupied' && <FiCheck className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Reserved */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatusModal(selectedTableForModal.id, 'reserved')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${selectedTableForModal.status === 'reserved'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md'
                      : 'bg-sky-50/40 border-sky-200 text-stone-800 hover:bg-sky-100'
                    }`}
                >
                  <div>
                    <p className="text-xs font-extrabold">🟡 Đã Đặt Trước</p>
                    <p className="text-[10px] opacity-80">Khách gọi hẹn giờ</p>
                  </div>
                  {selectedTableForModal.status === 'reserved' && <FiCheck className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Cleaning */}
                <button
                  type="button"
                  onClick={() => handleUpdateStatusModal(selectedTableForModal.id, 'cleaning')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${selectedTableForModal.status === 'cleaning'
                      ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-md'
                      : 'bg-sky-50/40 border-sky-200 text-stone-800 hover:bg-sky-100'
                    }`}
                >
                  <div>
                    <p className="text-xs font-extrabold">🧹 Cần Dọn Dẹp</p>
                    <p className="text-[10px] opacity-80">Chờ thu dọn bàn</p>
                  </div>
                  {selectedTableForModal.status === 'cleaning' && <FiCheck className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-sky-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Bạn có chắc muốn xóa ${selectedTableForModal.name}?`)) {
                    deleteTable(selectedTableForModal.id);
                    setSelectedTableForModal(null);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Xóa Bàn Này
              </button>

              <button
                type="button"
                onClick={() => setSelectedTableForModal(null)}
                className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Table */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTable}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-stone-900"
          >
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <FiPlus className="text-sky-600" /> Thêm Bàn Mới Vao Sơ Đồ
            </h3>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Tên Bàn:</label>
              <input
                type="text"
                required
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="VD: Bàn 07, Bàn VIP 2..."
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Khu Vực:</label>
              <select
                value={newTableArea}
                onChange={(e) => setNewTableArea(e.target.value as AreaId)}
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Sức chứa (số khách):</label>
              <input
                type="number"
                min={1}
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-3 pt-2 border-t border-sky-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md"
              >
                Thêm Bàn
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
