import type { Order } from '../types/order';

export const orderApi = {
  create: async (order: Omit<Order, 'id' | 'code' | 'createdAt'>): Promise<Order> => {
    return {
      ...order,
      id: `ORD-${Date.now()}`,
      code: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
  },
};
