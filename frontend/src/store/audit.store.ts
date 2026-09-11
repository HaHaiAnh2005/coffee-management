import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auditApi } from '../api/audit.api';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  actionLabel: string;
  targetId?: string;
  oldValue?: string;
  newValue?: string;
  approvedBy?: string;
  reason?: string;
}

interface AuditStoreState {
  logs: AuditLog[];
  fetchLogs: () => Promise<void>;
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'LOG-1001',
    timestamp: '14:15:30 - 20/08/2026',
    userId: 'EMP03',
    userName: 'Nguyễn Văn Thu Ngân',
    userRole: 'CASHIER',
    action: 'SHIFT_OPEN',
    actionLabel: 'Mở ca làm việc POS',
    targetId: 'SHIFT-20260820-01',
    oldValue: 'Trạng thái: Chưa mở',
    newValue: 'Tiền mặt đầu ca: 1,000,000đ',
    reason: 'Bắt đầu ca sáng',
  },
  {
    id: 'LOG-1002',
    timestamp: '14:20:12 - 20/08/2026',
    userId: 'EMP03',
    userName: 'Nguyễn Văn Thu Ngân',
    userRole: 'CASHIER',
    action: 'DISCOUNT_OVERRIDE',
    actionLabel: 'Duyệt chiết khấu 15% (>10%)',
    targetId: 'Đơn hàng #1002',
    oldValue: 'Giảm giá: 0%',
    newValue: 'Giảm giá: 15% (-45,000đ)',
    approvedBy: 'Trần Thị Quản Lý (Mã PIN: 1234)',
    reason: 'Khách hàng thân thiết VIP',
  },
  {
    id: 'LOG-1003',
    timestamp: '14:22:45 - 20/08/2026',
    userId: 'EMP03',
    userName: 'Nguyễn Văn Thu Ngân',
    userRole: 'CASHIER',
    action: 'ITEM_CANCEL',
    actionLabel: 'Hủy món đã gửi pha chế',
    targetId: 'Món Bạc Xỉu Sài Gòn (Đơn #1003)',
    oldValue: 'Số lượng: 2',
    newValue: 'Số lượng: 0 (Đã xóa)',
    approvedBy: 'Trần Thị Quản Lý (Mã PIN: 1234)',
    reason: 'Khách đổi ý sang Trà đào sả vải',
  },
];

export const useAuditStore = create<AuditStoreState>()(
  persist(
    (set) => ({
      logs: INITIAL_LOGS,

      fetchLogs: async () => {
        const fetched = await auditApi.getLogs();
        if (fetched && fetched.length > 0) {
          set({ logs: fetched });
        }
      },

      addLog: (logData) => {
        const newLog: AuditLog = {
          ...logData,
          id: `LOG-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN'),
        };

        set((state) => ({
          logs: [newLog, ...state.logs],
        }));

        // Async sync to MongoDB
        auditApi.createLog(logData);
      },

      clearLogs: () => {
        set({ logs: [] });
        auditApi.clearLogs();
      },
    }),
    {
      name: 'laura_coffee_audit_store',
    }
  )
);
