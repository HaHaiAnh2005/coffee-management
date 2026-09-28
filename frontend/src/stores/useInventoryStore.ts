import { create } from 'zustand';
import type { InventoryItem, InventoryReceipt } from '../types';
import { INITIAL_INVENTORY, INITIAL_RECEIPTS } from '../data/mockData';
import { nonnegativeNumber } from '../../../shared/validation';

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

  updateQuantity: (itemId, newQuantity) => {
    if (!nonnegativeNumber(newQuantity)) return;
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
    });
  },

  addItem: (itemData) => {
    if (![itemData.quantity, itemData.unitPrice, itemData.minAlertThreshold].every(nonnegativeNumber)) return;
    const newId = `INV${Math.floor(10 + Math.random() * 90)}`;
    const newItem: InventoryItem = {
      ...itemData,
      id: newId,
      sku: itemData.sku || `NL-${Math.floor(100 + Math.random() * 900)}`,
      lastUpdated: new Date().toISOString(),
    };
    set({ items: [newItem, ...get().items] });
  },

  updateItem: (itemId, data) => {
    if ([data.quantity, data.unitPrice, data.minAlertThreshold].some(value => value !== undefined && !nonnegativeNumber(value))) return;
    set({
      items: get().items.map((item) =>
        item.id === itemId
          ? { ...item, ...data, lastUpdated: new Date().toISOString() }
          : item
      ),
    });
  },

  deleteItem: (itemId) =>
    set({
      items: get().items.filter((i) => i.id !== itemId),
    }),

  getLowStockItems: () => get().items.filter((item) => item.quantity <= item.minAlertThreshold),

  createReceipt: (receiptData) => {
    if (!receiptData.items.length || !nonnegativeNumber(receiptData.totalAmount)) throw new Error('Phiếu kho hoặc số tiền không hợp lệ');
    const totals = new Map<string, number>();
    for (const line of receiptData.items) {
      if (![line.quantity, line.unitPrice, line.totalPrice].every(nonnegativeNumber) || line.quantity <= 0) throw new Error('Số lượng phải lớn hơn 0, đơn giá và thành tiền không âm');
      const material = get().items.find(item => item.id === line.materialId);
      if (!material) throw new Error('Nguyên liệu không tồn tại');
      const total = (totals.get(line.materialId) || 0) + line.quantity;
      if (receiptData.type === 'EXPORT' && total > material.quantity) throw new Error(`Không đủ tồn kho: ${material.name}`);
      totals.set(line.materialId, total);
    }
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
            quantity: Number((material.quantity + (totals.get(material.id) || 0)).toFixed(2)),
            unitPrice: lineItem.unitPrice > 0 ? lineItem.unitPrice : material.unitPrice,
            lastUpdated: createdAt,
          };
        } else if (receiptData.type === 'EXPORT') {
          return {
            ...material,
            quantity: Number((material.quantity - (totals.get(material.id) || 0)).toFixed(2)),
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
