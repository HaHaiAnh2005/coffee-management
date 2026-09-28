import mongoose, { Schema, Document } from 'mongoose';
import { orderQuantityError } from '../../shared/validation';
import { numericPayloadError } from '../middleware/numeric.middleware';

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
  paymentReference?: string;
  sepayTransactionId?: string;
  paymentAccount?: string;
  paymentBank?: string;
  paymentAccountName?: string;
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
    items: { type: [Schema.Types.Mixed], validate: { validator: (items: unknown) => !orderQuantityError(items) && !numericPayloadError(items), message: 'Món không hợp lệ: tối đa 20 mỗi món, 50 cả đơn; giá và tiền không âm' } },
    subtotal: { type: Number, required: true, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    discount: { type: Number, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    total: { type: Number, required: true, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    paymentMethod: { type: String, default: 'cash' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'completed',
    },
    createdAt: { type: String },
    completedAt: { type: String },
    cashierName: { type: String },
    paymentReference: { type: String, unique: true, sparse: true },
    sepayTransactionId: { type: String, unique: true, sparse: true },
    paymentAccount: { type: String },
    paymentBank: { type: String },
    paymentAccountName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
