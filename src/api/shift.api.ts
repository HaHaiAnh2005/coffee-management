import { axiosClient } from '../config/axios';
import type { Shift } from '../store/shift.store';

export const shiftApi = {
  getCurrentShift: async (): Promise<Shift | null> => {
    try {
      const res: any = await axiosClient.get('/shifts/current');
      return res?.data || null;
    } catch {
      return null;
    }
  },

  openShift: async (cashierName: string, cashierId: string, initialCash: number): Promise<Shift | null> => {
    try {
      const res: any = await axiosClient.post('/shifts/open', {
        cashierName,
        cashierId,
        initialCash,
      });
      return res?.data || null;
    } catch {
      return null;
    }
  },

  closeShift: async (actualCash: number, totalCashRevenue: number, notes?: string): Promise<Shift | null> => {
    try {
      const res: any = await axiosClient.post('/shifts/close', {
        actualCash,
        totalCashRevenue,
        notes,
      });
      return res?.data || null;
    } catch {
      return null;
    }
  },

  getShiftHistory: async (): Promise<Shift[]> => {
    try {
      const res: any = await axiosClient.get('/shifts/history');
      return res?.data || [];
    } catch {
      return [];
    }
  },
};
