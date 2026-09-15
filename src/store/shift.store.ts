import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shiftApi } from '../api/shift.api';

export interface Shift {
  id: string;
  cashierId: string;
  cashierName: string;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  expectedCash: number;
  actualCash?: number;
  variance?: number;
  notes?: string;
}

interface ShiftStoreState {
  currentShift: Shift | null;
  shiftHistory: Shift[];
  fetchCurrentShift: () => Promise<void>;
  openShift: (cashierName: string, cashierId: string, initialCash: number) => Shift;
  closeShift: (actualCash: number, totalCashRevenue: number, notes?: string) => Shift | null;
  isShiftOpen: () => boolean;
}

export const useShiftStore = create<ShiftStoreState>()(
  persist(
    (set, get) => ({
      currentShift: {
        id: 'SHIFT-20260820-01',
        cashierId: 'EMP03',
        cashierName: 'Nguyễn Văn Thu Ngân',
        status: 'OPEN',
        openedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN'),
        initialCash: 1000000,
        expectedCash: 1000000,
      },
      shiftHistory: [],

      fetchCurrentShift: async () => {
        const active = await shiftApi.getCurrentShift();
        if (active) {
          set({ currentShift: active });
        }
      },

      openShift: (cashierName, cashierId, initialCash) => {
        const newShift: Shift = {
          id: `SHIFT-${Date.now().toString().slice(-6)}`,
          cashierId,
          cashierName,
          status: 'OPEN',
          openedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN'),
          initialCash,
          expectedCash: initialCash,
        };
        set({ currentShift: newShift });

        // Async sync to MongoDB
        shiftApi.openShift(cashierName, cashierId, initialCash);

        return newShift;
      },

      closeShift: (actualCash, totalCashRevenue, notes = '') => {
        const { currentShift, shiftHistory } = get();
        if (!currentShift) return null;

        const expectedCash = currentShift.initialCash + totalCashRevenue;
        const variance = actualCash - expectedCash;
        const closedShift: Shift = {
          ...currentShift,
          status: 'CLOSED',
          closedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN'),
          expectedCash,
          actualCash,
          variance,
          notes,
        };

        set({
          currentShift: null,
          shiftHistory: [closedShift, ...shiftHistory],
        });

        // Async sync to MongoDB
        shiftApi.closeShift(actualCash, totalCashRevenue, notes);

        return closedShift;
      },

      isShiftOpen: () => {
        const current = get().currentShift;
        return current?.status === 'OPEN';
      },
    }),
    {
      name: 'laura_coffee_shift_store',
    }
  )
);
