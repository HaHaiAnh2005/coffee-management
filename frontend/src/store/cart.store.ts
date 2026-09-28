import { create } from 'zustand';
import type { CartItem, SelectedOption } from '../types/order';
import type { Product } from '../types/product';
import { orderQuantityError, nonnegativeNumber } from '../../../shared/validation';

interface CartStoreState {
  validationError: string;
  note: string;
  getSubtotal: () => number;
  getTotal: () => number;
  items: CartItem[];
  selectedTableId: string | null;
  selectedTableName: string | null;
  isTakeaway: boolean;
  discount: number;

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
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  validationError: '',
  note: '',
  getSubtotal: () => get().items.reduce((sum, item) => sum + item.itemTotalPrice, 0),
  getTotal: () => Math.max(0, get().getSubtotal() - get().discount),
  items: [],
  selectedTableId: null,
  selectedTableName: null,
  isTakeaway: false,
  discount: 0,

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
    const error = orderQuantityError([...get().items, { product, quantity }]);
    if (error) { set({ validationError: error }); return; }
    if (![product.price, discountAmount, ...selectedOptions.map(o => o.price)].every(nonnegativeNumber)) {
      set({ validationError: 'Giá và số tiền giảm phải là số hợp lệ, không âm' }); return;
    }
    set({ validationError: '' });
    let sizePrice = 0;
    if (size === 'M') sizePrice = 6000;
    if (size === 'L') sizePrice = 10000;
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);

    const unitPrice = product.price + sizePrice + optionsPrice;
    const rawTotalPrice = unitPrice * quantity;
    const itemTotalPrice = Math.max(0, rawTotalPrice - discountAmount);
    const cartItemId = JSON.stringify([product.id, size, sugarLevel, iceLevel, selectedOptions.map(o => [o.groupId, o.optionId, o.price]).sort(), note, discountAmount]);

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
    if (!Number.isSafeInteger(delta)) { set({ validationError: 'Số lượng phải là số nguyên' }); return; }
    const candidate = get().items.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0);
    const error = candidate.length ? orderQuantityError(candidate) : '';
    if (error) { set({ validationError: error }); return; }
    set({ validationError: '' });
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
    if (!get().items.some(item => item.cartItemId === oldCartItemId)) return;
    const error = orderQuantityError([...get().items.filter(item => item.cartItemId !== oldCartItemId), { product, quantity }]);
    if (error) { set({ validationError: error }); return; }
    if (![product.price, discountAmount, ...selectedOptions.map(o => o.price)].every(nonnegativeNumber)) { set({ validationError: 'Giá và số tiền giảm không hợp lệ' }); return; }
    get().removeItem(oldCartItemId);
    get().addItem(product, size, sugarLevel, iceLevel, selectedOptions, quantity, note, discountAmount);
  },

  setDiscount: (discount) => {
    if (!nonnegativeNumber(discount) || discount > get().getSubtotal()) { set({ validationError: 'Giảm giá phải từ 0 đến tổng tiền hàng' }); return; }
    set({ discount, validationError: '' });
  },
  clearCart: () => set({ items: [], discount: 0, note: '', validationError: '' }),
}));
