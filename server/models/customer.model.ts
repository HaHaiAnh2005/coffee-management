import mongoose, { Schema, Document } from 'mongoose';

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
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    points: { type: Number, default: 0 },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'diamond', 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'], default: 'Bạc' },
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    joinedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
