import { Request, Response } from 'express';
import Shift from '../models/shift.model';

export const getCurrentShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentShift = await Shift.findOne({ status: 'OPEN' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: currentShift || null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const openShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cashierName, cashierId, initialCash } = req.body;

    // Close any existing open shifts first
    await Shift.updateMany({ status: 'OPEN' }, { status: 'CLOSED', closedAt: new Date().toISOString() });

    const newShift = await Shift.create({
      id: `SHIFT-${Date.now().toString().slice(-6)}`,
      cashierId: cashierId || 'EMP03',
      cashierName: cashierName || 'Nguyễn Văn Thu Ngân',
      status: 'OPEN',
      openedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN'),
      initialCash: initialCash || 1000000,
      expectedCash: initialCash || 1000000,
    });

    res.json({
      success: true,
      data: newShift,
      message: 'Mở ca làm việc thành công!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const closeShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { actualCash, totalCashRevenue, notes } = req.body;

    const currentShift = await Shift.findOne({ status: 'OPEN' }).sort({ createdAt: -1 });

    if (!currentShift) {
      res.status(404).json({ success: false, message: 'Không tìm thấy ca làm việc đang mở!' });
      return;
    }

    const expectedCash = currentShift.initialCash + (totalCashRevenue || 0);
    const variance = actualCash - expectedCash;
    const closedAt = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN');

    currentShift.status = 'CLOSED';
    currentShift.closedAt = closedAt;
    currentShift.expectedCash = expectedCash;
    currentShift.actualCash = actualCash;
    currentShift.variance = variance;
    currentShift.notes = notes || '';

    await currentShift.save();

    res.json({
      success: true,
      data: currentShift,
      message: 'Đóng ca và kết toán thành công!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShiftHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const shifts = await Shift.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: shifts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
