export * from './common';
export * from './auth';
export * from './user';
export * from './product';
export * from './category';
export * from './table';
export * from './order';
export * from './employee';
export * from './customer';

export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  taxCode: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minAlertThreshold: number;
  category: string;
  lastUpdated: string;
}
