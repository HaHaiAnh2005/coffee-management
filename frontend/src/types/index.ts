export * from './common';
export * from './auth';
export * from './user';
export * from './product';
export * from './category';
export * from './order';
export * from './employee';
export * from './customer';
export * from './inventory';

export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  taxCode: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
}
