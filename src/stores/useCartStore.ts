import { create } from 'zustand';
import type { CartItem, Product, SelectedOption } from '../types';

interface CartState {
  items: CartItem[];
  selectedTableId: string | null;
  selectedTableName: string | null;
  isTakeaway: boolean;
  discount: number; // Tiền giảm giá (đ)
  note: string;

  // Actions
  setSelectedTable: (tableId: string | null, tableName: string | null) => void;
  setIsTakeaway: (isTakeaway: boolean) => void;
  addItem: (
    product: Product,
    size: 'S' | 'M' | 'L',
    sugarLevel: '0%' | '30%' | '50%' | '100%',
    iceLevel: 'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá',
    selectedOptions: SelectedOption[],
    quantity?: number,
    note?: string,
    discountAmount?: number
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  updateItem: (
    oldCartItemId: string,
    product: Product,
    size: 'S' | 'M' | 'L',
    sugarLevel: '0%' | '30%' | '50%' | '100%',
    iceLevel: 'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá',
    selectedOptions: SelectedOption[],
    quantity?: number,
    note?: string,
    discountAmount?: number
  ) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  selectedTableId: null,
  selectedTableName: null,
  isTakeaway: false,
  discount: 0,
  note: '',

  setSelectedTable: (tableId, tableName) =>
    set({
      selectedTableId: tableId,
      selectedTableName: tableName,
      isTakeaway: tableId === null,
    }),

  setIsTakeaway: (isTakeaway) =>
    set((state) => ({
      isTakeaway,
      selectedTableId: isTakeaway ? null : state.selectedTableId,
      selectedTableName: isTakeaway ? null : state.selectedTableName,
    })),

  addItem: (product, size, sugarLevel, iceLevel, selectedOptions, quantity = 1, note = '', discountAmount = 0) => {
    // Tính phụ thu size
    let sizePrice = 0;
    if (size === 'M') sizePrice = 6000;
    if (size === 'L') sizePrice = 10000;

    // Tính phụ thu topping / options
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);

    const unitPrice = product.price + sizePrice + optionsPrice;
    const rawTotalPrice = unitPrice * quantity;
    const itemTotalPrice = Math.max(0, rawTotalPrice - discountAmount);

    // Tạo ID duy nhất cho CartItem
    const cartItemId = `${product.id}-${size}-${sugarLevel}-${iceLevel}-${selectedOptions.map((o) => o.optionId).join('_')}${discountAmount ? '-d' + discountAmount : ''}`;

    const existingIndex = get().items.findIndex((item) => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updatedItems = [...get().items];
      const existingItem = updatedItems[existingIndex];
      const newQuantity = existingItem.quantity + quantity;
      const totalDisc = (existingItem.discountAmount || 0) + discountAmount;
      updatedItems[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        discountAmount: totalDisc,
        itemTotalPrice: Math.max(0, unitPrice * newQuantity - totalDisc),
      };
      set({ items: updatedItems });
    } else {
      const newItem: CartItem = {
        cartItemId,
        product,
        quantity,
        size,
        sugarLevel,
        iceLevel,
        selectedOptions,
        note,
        itemTotalPrice,
        discountAmount,
      };
      set({ items: [...get().items, newItem] });
    }
  },

  removeItem: (cartItemId) =>
    set({
      items: get().items.filter((item) => item.cartItemId !== cartItemId),
    }),

  updateQuantity: (cartItemId, delta) => {
    const updatedItems = get().items
      .map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          let sizePrice = 0;
          if (item.size === 'M') sizePrice = 6000;
          if (item.size === 'L') sizePrice = 10000;
          const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
          const unitPrice = item.product.price + sizePrice + optionsPrice;
          const discount = item.discountAmount || 0;
          return {
            ...item,
            quantity: newQty,
            itemTotalPrice: Math.max(0, unitPrice * newQty - discount),
          };
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    set({ items: updatedItems });
  },

  updateItem: (oldCartItemId, product, size, sugarLevel, iceLevel, selectedOptions, quantity = 1, note = '', discountAmount = 0) => {
    let sizePrice = 0;
    if (size === 'M') sizePrice = 6000;
    if (size === 'L') sizePrice = 10000;

    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const unitPrice = product.price + sizePrice + optionsPrice;
    const rawTotalPrice = unitPrice * quantity;
    const itemTotalPrice = Math.max(0, rawTotalPrice - discountAmount);

    const newCartItemId = `${product.id}-${size}-${sugarLevel}-${iceLevel}-${selectedOptions.map((o) => o.optionId).join('_')}${discountAmount ? '-d' + discountAmount : ''}`;

    const updatedItems = get().items.map((item) => {
      if (item.cartItemId === oldCartItemId) {
        return {
          cartItemId: newCartItemId,
          product,
          quantity,
          size,
          sugarLevel,
          iceLevel,
          selectedOptions,
          note,
          itemTotalPrice,
          discountAmount,
        };
      }
      return item;
    });

    set({ items: updatedItems });
  },

  setDiscount: (discount) => set({ discount }),

  clearCart: () =>
    set({
      items: [],
      discount: 0,
      note: '',
    }),

  getSubtotal: () => get().items.reduce((sum, item) => sum + item.itemTotalPrice, 0),

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discount;
    return Math.max(0, subtotal - discount);
  },
}));
