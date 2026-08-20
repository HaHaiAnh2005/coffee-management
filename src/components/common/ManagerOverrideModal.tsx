import React, { useState } from 'react';
import { FiShield, FiLock, FiAlertTriangle, FiCheck, FiX, FiKey } from 'react-icons/fi';
import { Modal } from './Modal';
import { INITIAL_EMPLOYEES } from '../../api/employee.api';
import { useAuthStore } from '../../store/auth.store';
import { useAuditStore } from '../../store/audit.store';

interface ManagerOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  actionDetails: string;
  actionType: 'ITEM_CANCEL' | 'BILL_CANCEL' | 'DISCOUNT_OVERRIDE' | 'PRICE_OVERRIDE';
  targetId?: string;
  onApproved: (approverName: string) => void;
}

export const ManagerOverrideModal: React.FC<ManagerOverrideModalProps> = ({
  isOpen,
  onClose,
  actionTitle,
  actionDetails,
  actionType,
  targetId = 'N/A',
  onApproved,
}) => {
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const currentUser = useAuthStore((state) => state.user);
  const addAuditLog = useAuditStore((state) => state.addLog);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (pin.length !== 4) {
      setError('Vui lòng nhập đủ 4 chữ số mã PIN');
      return;
    }

    // Find manager or admin with this PIN
    const manager = INITIAL_EMPLOYEES.find(
      (emp) => emp.pin === pin && (emp.role === 'ADMIN' || emp.role === 'MANAGER')
    );

    // Also accept 9999 as universal admin PIN or 1234 as universal manager PIN
    const isValidUniversalPin = pin === '1234' || pin === '9999';
    const approverName = manager ? `${manager.name} (${manager.role})` : isValidUniversalPin ? 'Trần Thị Quản Lý (MANAGER)' : null;

    if (!approverName) {
      setError('Mã PIN không đúng hoặc bạn không có quyền Quản lý duyệt!');
      setPin('');
      return;
    }

    // Log to Audit Trail
    addAuditLog({
      userId: currentUser?.id || 'EMP03',
      userName: currentUser?.name || 'Nguyễn Văn Thu Ngân',
      userRole: currentUser?.role || 'CASHIER',
      action: actionType,
      actionLabel: actionTitle,
      targetId,
      newValue: actionDetails,
      approvedBy: `${approverName} (Mã PIN: ****)`,
      reason: reason.trim() || 'Thao tác nghiệp vụ cần Quản lý cấp quyền',
    });

    // Reset and trigger approval callback
    setPin('');
    setReason('');
    setError('');
    onApproved(approverName);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="p-2 space-y-4">
        {/* Header Shield Icon */}
        <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-900/20 text-2xl">
            <FiShield />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Anti-Fraud Override
              </span>
            </div>
            <h3 className="font-bold text-stone-900 text-base">{actionTitle}</h3>
            <p className="text-xs text-amber-800 font-medium">{actionDetails}</p>
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Lý do duyệt thao tác (Tùy chọn):</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Khách đổi ý, Nhập sai món, Giảm giá VIP..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-stone-50"
          />
        </div>

        {/* PIN Input Display */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-stone-600 flex items-center justify-center gap-1">
            <FiLock className="text-amber-600" /> Nhập mã PIN Quản lý (Thử PIN: <span className="font-mono text-amber-700 font-extrabold">1234</span> hoặc <span className="font-mono text-amber-700 font-extrabold">9999</span>)
          </p>
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-extrabold transition-all ${
                  pin.length > index
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                    : 'border-stone-200 bg-stone-100 text-stone-400'
                }`}
              >
                {pin.length > index ? '●' : ''}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 flex items-center justify-center gap-1 animate-shake">
              <FiAlertTriangle /> {error}
            </p>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-11 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 font-extrabold text-base transition-all active:scale-95 border border-stone-200"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-11 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <FiX /> Xóa
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-11 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 font-extrabold text-base transition-all active:scale-95 border border-stone-200"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
          >
            <FiCheck /> Duyệt
          </button>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 text-center flex items-center justify-center gap-1">
          <FiKey className="text-amber-500" /> Thao tác sẽ được tự động ghi nhận vào Bảng Nhật ký kiểm toán Anti-Fraud.
        </div>
      </div>
    </Modal>
  );
};
