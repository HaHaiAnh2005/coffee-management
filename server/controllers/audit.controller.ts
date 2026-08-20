import { Request, Response } from 'express';
import AuditLog from '../models/audit.model';

const INITIAL_LOGS = [
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

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    let logs = await AuditLog.find({}).sort({ createdAt: -1 });

    if (logs.length === 0) {
      await AuditLog.insertMany(INITIAL_LOGS);
      logs = await AuditLog.find({}).sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, userName, userRole, action, actionLabel, targetId, oldValue, newValue, approvedBy, reason } = req.body;

    const newLog = await AuditLog.create({
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN'),
      userId,
      userName,
      userRole,
      action,
      actionLabel,
      targetId,
      oldValue,
      newValue,
      approvedBy,
      reason,
    });

    res.json({
      success: true,
      data: newLog,
      message: 'Ghi nhật ký kiểm toán thành công!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    await AuditLog.deleteMany({});
    res.json({
      success: true,
      message: 'Đã xóa toàn bộ lịch sử nhật ký kiểm toán trong MongoDB!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
