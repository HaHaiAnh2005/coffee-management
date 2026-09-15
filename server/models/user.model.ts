import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'BARISTA' | 'CUSTOMER';
  pin?: string;
  avatar?: string;
  phone?: string;
  password?: string;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'BARISTA', 'CUSTOMER', 'admin', 'manager', 'cashier', 'staff', 'customer'],
      default: 'CUSTOMER',
    },
    pin: { type: String },
    avatar: { type: String },
    phone: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
