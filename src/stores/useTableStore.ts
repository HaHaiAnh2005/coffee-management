import { create } from 'zustand';
import type { Area, Table, TableStatus } from '../types';
import { INITIAL_AREAS, INITIAL_TABLES } from '../data/mockData';

interface TableState {
  tables: Table[];
  areas: Area[];
  selectedAreaId: string; // 'all' hoặc AreaId

  // Actions
  setSelectedAreaId: (areaId: string) => void;
  updateTableStatus: (tableId: string, status: TableStatus, currentOrderId?: string) => void;
  addTable: (table: Omit<Table, 'id' | 'status'>) => void;
  deleteTable: (tableId: string) => void;
  transferTable: (fromTableId: string, toTableId: string) => void;
}

export const useTableStore = create<TableState>((set, get) => ({
  tables: INITIAL_TABLES,
  areas: INITIAL_AREAS,
  selectedAreaId: 'all',

  setSelectedAreaId: (areaId) => set({ selectedAreaId: areaId }),

  updateTableStatus: (tableId, status, currentOrderId) =>
    set({
      tables: get().tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            status,
            currentOrderId: status === 'occupied' ? currentOrderId || table.currentOrderId : undefined,
            occupiedAt: status === 'occupied' ? new Date().toISOString() : undefined,
          };
        }
        return table;
      }),
    }),

  addTable: (newTableData) => {
    const newId = `T${Math.floor(100 + Math.random() * 900)}`;
    const newTable: Table = {
      ...newTableData,
      id: newId,
      status: 'available',
    };
    set({ tables: [...get().tables, newTable] });
  },

  deleteTable: (tableId) =>
    set({
      tables: get().tables.filter((t) => t.id !== tableId),
    }),

  transferTable: (fromTableId, toTableId) => {
    const tables = get().tables;
    const fromTable = tables.find((t) => t.id === fromTableId);
    const toTable = tables.find((t) => t.id === toTableId);

    if (!fromTable || !toTable) return;

    set({
      tables: tables.map((t) => {
        if (t.id === fromTableId) {
          return { ...t, status: 'available', currentOrderId: undefined, occupiedAt: undefined };
        }
        if (t.id === toTableId) {
          return {
            ...t,
            status: 'occupied',
            currentOrderId: fromTable.currentOrderId,
            occupiedAt: fromTable.occupiedAt || new Date().toISOString(),
          };
        }
        return t;
      }),
    });
  },
}));
