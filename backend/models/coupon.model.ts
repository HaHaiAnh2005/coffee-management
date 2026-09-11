import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  id: string;
  code: string;
  description?: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableTier?: string;
}

const CouponSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    validFrom: { type: String },
    validUntil: { type: String },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableTier: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>('Coupon', CouponSchema);
