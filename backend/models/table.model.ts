import mongoose, { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  id: string;
  name: string;
  areaId: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  occupiedAt?: string;
}

const TableSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    areaId: { type: String, required: true },
    capacity: { type: Number, default: 4 },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'cleaning'],
      default: 'available',
    },
    currentOrderId: { type: String },
    occupiedAt: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITable>('Table', TableSchema);
