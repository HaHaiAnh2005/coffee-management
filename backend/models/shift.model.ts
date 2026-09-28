import mongoose, { Schema, Document } from 'mongoose';

export interface IShift extends Document {
  id: string;
  cashierId: string;
  cashierName: string;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  expectedCash: number;
  actualCash?: number;
  variance?: number;
  notes?: string;
}

const ShiftSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    cashierId: { type: String, required: true },
    cashierName: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    openedAt: { type: String, required: true },
    closedAt: { type: String },
    initialCash: { type: Number, required: true, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    expectedCash: { type: Number, required: true, default: 0, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    actualCash: { type: Number, min: [0, 'Giá trị không được âm'], validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    variance: { type: Number, validate: { validator: Number.isFinite, message: 'Phải là số hữu hạn' } },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IShift>('Shift', ShiftSchema);
