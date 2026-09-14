import mongoose, { Schema, Document } from 'mongoose';

export type ReceiptType = 'IMPORT' | 'EXPORT';

export interface IReceiptItem {
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IInventoryReceipt extends Document {
  id: string;
  code: string;
  type: ReceiptType;
  reason: string;
  supplier?: string;
  creatorName: string;
  items: IReceiptItem[];
  totalAmount: number;
  notes?: string;
  status: 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

const ReceiptItemSchema: Schema = new Schema(
  {
    materialId: { type: String, required: true },
    materialName: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const InventoryReceiptSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['IMPORT', 'EXPORT'], required: true },
    reason: { type: String, required: true },
    supplier: { type: String },
    creatorName: { type: String, required: true },
    items: { type: [ReceiptItemSchema], required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    notes: { type: String },
    status: { type: String, enum: ['COMPLETED', 'CANCELLED'], default: 'COMPLETED' },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IInventoryReceipt>('InventoryReceipt', InventoryReceiptSchema);
