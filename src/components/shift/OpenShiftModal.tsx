import React, { useState } from 'react';
import { FiClock, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { Modal } from '../common/Modal';
import { useShiftStore } from '../../store/shift.store';
import { useAuthStore } from '../../store/auth.store';
import { useAuditStore } from '../../store/audit.store';

interface OpenShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenShiftModal: React.FC<OpenShiftModalProps> = ({ isOpen, onClose }) => {
  const [initialCash, setInitialCash] = useState<number>(1000000);
  const user = useAuthStore((state) => state.user);
  const openShift = useShiftStore((state) => state.openShift);
  const addAuditLog = useAuditStore((state) => state.addLog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cashierName = user?.name || 'Nguyễn Văn Thu Ngân';
    const cashierId = user?.id || 'EMP03';

    const shift = openShift(cashierName, cashierId, initialCash);

    addAuditLog({
      userId: cashierId,
      userName: cashierName,
      userRole: user?.role || 'CASHIER',
      action: 'SHIFT_OPEN',
      actionLabel: 'Mở ca làm việc POS',
      targetId: shift.id,
      oldValue: 'Trạng thái: Chưa mở',
      newValue: `Tiền mặt đầu ca: ${initialCash.toLocaleString('vi-VN')}đ`,
      reason: 'Mở ca bán hàng đầu ca làm việc',
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mở Ca Làm Việc POS" size="md">
      <form onSubmit={handleSubmit} className="p-2 space-y-4">
        <div className="flex items-center gap-3 p-3.5 bg-sky-50 border border-sky-200 rounded-2xl">
          <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <FiClock />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Khai báo tiền mặt đầu ca</h4>
            <p className="text-xs text-sky-800">Nhân viên trực ca: <span className="font-bold">{user?.name || 'Nguyễn Văn Thu Ngân'}</span></p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
            <FiDollarSign className="text-emerald-600" /> Số tiền mặt đầu ca (Tiền thối):
          </label>
          <div className="relative">
            <input
              type="number"
              step="10000"
              value={initialCash}
              onChange={(e) => setInitialCash(Number(e.target.value))}
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-300 font-extrabold text-base text-emerald-800 focus:ring-2 focus:ring-sky-500 bg-white"
              required
            />
            <span className="absolute right-4 top-3.5 font-bold text-xs text-stone-500">VNĐ</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[500000, 1000000, 2000000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setInitialCash(amt)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-100 hover:bg-sky-100 text-stone-700 hover:text-sky-900 transition-all border border-stone-200"
              >
                {amt.toLocaleString('vi-VN')}đ
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-md flex items-center gap-1.5 transition-all"
          >
            <FiCheckCircle /> Xác nhận mở ca
          </button>
        </div>
      </form>
    </Modal>
  );
};
