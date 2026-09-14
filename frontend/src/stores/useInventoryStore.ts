import { create } from 'zustand';
import type { InventoryItem, InventoryReceipt } from '../types';
import { INITIAL_INVENTORY, INITIAL_RECEIPTS } from '../data/mockData';

interface InventoryState {
  items: InventoryItem[];
  receipts: InventoryReceipt[];
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (itemId: string, data: Partial<InventoryItem>) => void;
  deleteItem: (itemId: string) => void;
  getLowStockItems: () => InventoryItem[];

  // Receipt Actions (Phiếu Nhập / Xuất Kho)
  createReceipt: (receiptData: Omit<InventoryReceipt, 'id' | 'code' | 'createdAt' | 'status'>) => InventoryReceipt;
  deleteReceipt: (receiptId: string) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: INITIAL_INVENTORY,
  receipts: INITIAL_RECEIPTS,
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  updateQuantity: (itemId, newQuantity) =>
    set({
      items: get().items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(0, newQuantity),
              lastUpdated: new Date().toISOString(),
            }
          : item
      ),
    }),

  addItem: (itemData) => {
    const newId = `INV${Math.floor(10 + Math.random() * 90)}`;
    const newItem: InventoryItem = {
      ...itemData,
      id: newId,
      sku: itemData.sku || `NL-${Math.floor(100 + Math.random() * 900)}`,
      lastUpdated: new Date().toISOString(),
    };
    set({ items: [newItem, ...get().items] });
  },

  updateItem: (itemId, data) =>
    set({
      items: get().items.map((item) =>
        item.id === itemId
          ? { ...item, ...data, lastUpdated: new Date().toISOString() }
          : item
      ),
    }),

  deleteItem: (itemId) =>
    set({
      items: get().items.filter((i) => i.id !== itemId),
    }),

  getLowStockItems: () => get().items.filter((item) => item.quantity <= item.minAlertThreshold),

  createReceipt: (receiptData) => {
    const count = get().receipts.length + 1;
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = receiptData.type === 'IMPORT' ? 'PNK' : 'PXK';
    const code = `${prefix}-${datePrefix}-${String(count).padStart(3, '0')}`;
    const newId = `rcpt_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newReceipt: InventoryReceipt = {
      ...receiptData,
      id: newId,
      code,
      status: 'COMPLETED',
      createdAt,
    };

    // Tự động bù trừ số lượng tồn kho theo loại phiếu
    const updatedItems = get().items.map((material) => {
      const lineItem = receiptData.items.find((it) => it.materialId === material.id);
      if (lineItem) {
        if (receiptData.type === 'IMPORT') {
          return {
            ...material,
            quantity: Number((material.quantity + lineItem.quantity).toFixed(2)),
            unitPrice: lineItem.unitPrice > 0 ? lineItem.unitPrice : material.unitPrice,
            lastUpdated: createdAt,
          };
        } else if (receiptData.type === 'EXPORT') {
          return {
            ...material,
            quantity: Number(Math.max(0, material.quantity - lineItem.quantity).toFixed(2)),
            lastUpdated: createdAt,
          };
        }
      }
      return material;
    });

    set({
      receipts: [newReceipt, ...get().receipts],
      items: updatedItems,
    });

    return newReceipt;
  },

  deleteReceipt: (receiptId) =>
    set({
      receipts: get().receipts.filter((r) => r.id !== receiptId),
    }),
}));
