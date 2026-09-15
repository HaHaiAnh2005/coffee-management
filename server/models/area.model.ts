import mongoose, { Schema, Document } from 'mongoose';

export interface IArea extends Document {
  id: string;
  name: string;
}

const AreaSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IArea>('Area', AreaSchema);
