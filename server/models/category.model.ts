import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  icon?: string;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'FiCoffee' },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
