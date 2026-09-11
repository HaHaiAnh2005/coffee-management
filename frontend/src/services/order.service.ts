import { orderApi } from '../api/order.api';
import type { Order } from '../types/order';

export const orderService = {
  processNewOrder: async (orderData: Omit<Order, 'id' | 'code' | 'createdAt'>) => {
    return await orderApi.create(orderData);
  },
};
