import mongoose, { Schema, Document } from 'mongoose';
import { personNameError } from '../../shared/validation';

export interface ICustomer extends Document {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
  totalSpent: number;
  totalOrders?: number;
  joinedDate?: string;
  notes?: string;
}

const CustomerSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, validate: { validator: (value: string) => !personNameError(value), message: 'Họ tên chỉ gồm chữ cái và khoảng trắng' } },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    points: { type: Number, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isSafeInteger, message: 'Phải là số nguyên hợp lệ' } },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'diamond', 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'], default: 'Bạc' },
    totalSpent: { type: Number, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    totalOrders: { type: Number, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isSafeInteger, message: 'Phải là số nguyên hợp lệ' } },
    joinedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
