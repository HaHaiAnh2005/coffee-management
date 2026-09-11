import { create } from 'zustand';
import type { InventoryItem } from '../types';
import { INITIAL_INVENTORY } from '../data/mockData';

interface InventoryState {
  items: InventoryItem[];
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  deleteItem: (itemId: string) => void;
  getLowStockItems: () => InventoryItem[];
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: INITIAL_INVENTORY,
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
      lastUpdated: new Date().toISOString(),
    };
    set({ items: [newItem, ...get().items] });
  },

  deleteItem: (itemId) =>
    set({
      items: get().items.filter((i) => i.id !== itemId),
    }),

  getLowStockItems: () => get().items.filter((item) => item.quantity <= item.minAlertThreshold),
}));
