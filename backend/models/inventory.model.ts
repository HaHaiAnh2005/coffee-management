import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minAlertThreshold: number;
  category?: string;
  lastUpdated?: string;
}

const InventorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    minAlertThreshold: { type: Number, default: 10 },
    category: { type: String },
    lastUpdated: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>('Inventory', InventorySchema);
