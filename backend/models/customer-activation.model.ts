import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  customerId: { type: String, required: true, unique: true },
  tokenHash: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

export default mongoose.model('CustomerActivation', schema);
