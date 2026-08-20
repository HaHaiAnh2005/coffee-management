import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  cartItemId?: string;
  product: {
    id: string;
    name: string;
    categoryId?: string;
    price: number;
    image?: string;
    isAvailable?: boolean;
  };
  quantity: number;
  size?: string;
  sugarLevel?: string;
  iceLevel?: string;
  selectedOptions?: { id?: string; name?: string; price?: number }[];
  note?: string;
  itemTotalPrice: number;
}

export interface IOrder extends Document {
  id: string;
  code: string;
  tableId?: string;
  tableName?: string;
  isTakeaway: boolean;
  customerPhone?: string;
  customerName?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: string;
  completedAt?: string;
  cashierName?: string;
}

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    tableId: { type: String },
    tableName: { type: String },
    isTakeaway: { type: Boolean, default: false },
    customerPhone: { type: String },
    customerName: { type: String },
    items: [Schema.Types.Mixed],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'cash' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'completed',
    },
    createdAt: { type: String },
    completedAt: { type: String },
    cashierName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
