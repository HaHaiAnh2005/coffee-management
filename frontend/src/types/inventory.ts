export type ReceiptType = 'IMPORT' | 'EXPORT';

export interface ReceiptItem {
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InventoryReceipt {
  id: string;
  code: string;
  type: ReceiptType;
  reason: string;
  supplier?: string;
  creatorName: string;
  items: ReceiptItem[];
  totalAmount: number;
  notes?: string;
  status: 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku?: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice?: number;
  minAlertThreshold: number;
  category: string;
  supplier?: string;
  lastUpdated: string;
}
