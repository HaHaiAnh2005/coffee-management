export const OrderStatusEnum = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TableStatusEnum = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning',
} as const;
