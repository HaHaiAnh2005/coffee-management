import React, { useState } from 'react';
import { FiLock, FiDollarSign, FiAlertCircle, FiCheckSquare } from 'react-icons/fi';
import { Modal } from '../common/Modal';
import { useShiftStore } from '../../store/shift.store';
import { useAuthStore } from '../../store/auth.store';
import { useAuditStore } from '../../store/audit.store';

interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashRevenueTotal?: number;
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  isOpen,
  onClose,
  cashRevenueTotal = 2450000,
}) => {
  const currentShift = useShiftStore((state) => state.currentShift);
  const closeShift = useShiftStore((state) => state.closeShift);
  const user = useAuthStore((state) => state.user);
  const addAuditLog = useAuditStore((state) => state.addLog);

  const initialCash = currentShift?.initialCash || 1000000;
  const expectedTotal = initialCash + cashRevenueTotal;

  const [actualCash, setActualCash] = useState<number>(expectedTotal);
  const [notes, setNotes] = useState('');

  const variance = actualCash - expectedTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const closedShift = closeShift(actualCash, cashRevenueTotal, notes);

    if (closedShift) {
      addAuditLog({
        userId: user?.id || 'EMP03',
        userName: user?.name || 'Nguyễn Văn Thu Ngân',
        userRole: user?.role || 'CASHIER',
        action: 'SHIFT_CLOSE',
        actionLabel: 'Kết toán & Đóng ca làm việc',
        targetId: closedShift.id,
        oldValue: `Tiền mặt dự kiến: ${expectedTotal.toLocaleString('vi-VN')}đ`,
        newValue: `Thực tế: ${actualCash.toLocaleString('vi-VN')}đ (Lệch: ${variance > 0 ? '+' : ''}${variance.toLocaleString('vi-VN')}đ)`,
        reason: notes.trim() || 'Đóng ca kết toán doanh thu',
      });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kết Toán & Đóng Ca Làm Việc" size="md">
      <form onSubmit={handleSubmit} className="p-2 space-y-4">
        {/* Current Shift Summary */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-500 font-medium">Mã ca trực:</span>
            <span className="font-mono font-bold text-stone-800">{currentShift?.id || 'SHIFT-ACTIVE'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-500 font-medium">Nhân viên thu ngân:</span>
            <span className="font-bold text-stone-800">{currentShift?.cashierName || 'Nguyễn Văn Thu Ngân'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-500 font-medium">Giờ mở ca:</span>
            <span className="font-bold text-stone-800">{currentShift?.openedAt || 'Hôm nay'}</span>
          </div>
        </div>

        {/* Calculation Table */}
        <div className="space-y-2 bg-sky-50/60 border border-sky-100 p-3.5 rounded-2xl">
          <div className="flex justify-between text-xs font-medium text-stone-600">
            <span>Tiền mặt đầu ca (Tiền thối):</span>
            <span className="font-bold text-stone-800">{initialCash.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-stone-600">
            <span>Doanh thu tiền mặt thu được:</span>
            <span className="font-bold text-emerald-700">+{cashRevenueTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="pt-2 border-t border-sky-200 flex justify-between text-sm font-extrabold text-stone-900">
            <span>Tổng tiền mặt dự kiến trong két:</span>
            <span className="text-sky-900 font-mono text-base">{expectedTotal.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Actual Cash Input */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
            <FiDollarSign className="text-emerald-600" /> Tiền mặt đếm thực tế trong két cuối ca:
          </label>
          <input
            type="number"
            value={actualCash}
            onChange={(e) => setActualCash(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 font-extrabold text-base text-stone-900 focus:ring-2 focus:ring-sky-500 bg-white"
            required
          />

          {/* Variance Status Indicator */}
          <div
            className={`mt-2 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
              variance === 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : variance > 0
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span className="flex items-center gap-1">
              <FiAlertCircle /> Chênh lệch kiểm đếm:
            </span>
            <span className="font-mono text-sm font-extrabold">
              {variance === 0
                ? 'Khớp chuẩn 100% (0đ)'
                : variance > 0
                ? `Thừa +${variance.toLocaleString('vi-VN')}đ`
                : `Thiếu ${variance.toLocaleString('vi-VN')}đ`}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Ghi chú đóng ca (Tùy chọn):</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú lý do chênh lệch tiền hoặc sự cố ca trực..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-stone-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-all"
          >
            Bỏ qua
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white shadow-md flex items-center gap-1.5 transition-all"
          >
            <FiLock /> Kết toán & Đóng ca
          </button>
        </div>
      </form>
    </Modal>
  );
};
