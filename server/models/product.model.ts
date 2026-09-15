import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  image?: string;
  description?: string;
  isAvailable: boolean;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
