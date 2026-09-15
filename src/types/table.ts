export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type AreaId = 'floor1' | 'floor2' | 'garden';

export interface Area {
  id: AreaId;
  name: string;
}

export interface Table {
  id: string;
  name: string;
  areaId: AreaId;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  occupiedAt?: string;
}
