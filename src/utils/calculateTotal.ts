import type { CartItem } from '../types/order';

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.itemTotalPrice, 0);
};

export const calculateTotal = (items: CartItem[], discount = 0): number => {
  const subtotal = calculateSubtotal(items);
  return Math.max(0, subtotal - discount);
};
