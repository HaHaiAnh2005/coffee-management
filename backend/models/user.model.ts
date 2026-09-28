import mongoose, { Schema, Document } from 'mongoose';
import { personNameError, nonnegativeNumber } from '../../shared/validation';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'BARISTA' | 'CUSTOMER';
  pin?: string;
  avatar?: string;
  phone?: string;
  password?: string;
  customerId?: string;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, validate: { validator: (value: string) => !personNameError(value), message: 'Họ tên chỉ gồm chữ cái và khoảng trắng' } },
    salary: { type: Number, validate: { validator: nonnegativeNumber, message: 'Lương phải là số không âm' } },
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
    customerId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
