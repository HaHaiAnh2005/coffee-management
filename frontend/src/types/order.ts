import type { Product } from './product';

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  size: 'S' | 'M' | 'L';
  sugarLevel: '0%' | '30%' | '50%' | '100%';
  iceLevel: 'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá';
  selectedOptions: SelectedOption[];
  note?: string;
  itemTotalPrice: number;
  discountAmount?: number;
}

export type PaymentMethod = 'cash' | 'vietqr' | 'card' | 'momo' | 'vnpay';
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  code: string;
  tableId?: string;
  tableName?: string;
  isTakeaway: boolean;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  completedAt?: string;
  cashierName: string;
  customerName?: string;
  customerPhone?: string;
}
