import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  address: string;
  phone: string;
  taxCode: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
}

const SettingsSchema: Schema = new Schema(
  {
    storeName: { type: String, default: 'Laura Coffee & Tea' },
    address: { type: String, default: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
    phone: { type: String, default: '0988888888' },
    taxCode: { type: String, default: '0101234567' },
    bankName: { type: String, default: 'Vietcombank' },
    bankAccountNo: { type: String, default: '9988776655' },
    bankAccountName: { type: String, default: 'QUAN CA PHE LAURA' },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
