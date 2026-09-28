import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  id: string;
  sku?: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice?: number;
  minAlertThreshold: number;
  category?: string;
  supplier?: string;
  lastUpdated?: string;
}

const InventorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    unitPrice: { type: Number, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    minAlertThreshold: { type: Number, default: 10, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    category: { type: String },
    supplier: { type: String },
    lastUpdated: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>('Inventory', InventorySchema);
