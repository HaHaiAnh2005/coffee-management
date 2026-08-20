import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderStatus } from '../types/order';
import { generateCode } from '../utils/generateCode';

interface OrderStoreState {
  orders: Order[];
  activeFilter: 'all' | 'completed' | 'cancelled';
  activeOrderFilter: 'all' | 'completed' | 'cancelled';

  setActiveFilter: (filter: 'all' | 'completed' | 'cancelled') => void;
  setActiveOrderFilter: (filter: 'all' | 'completed' | 'cancelled') => void;
  createOrder: (orderData: Omit<Order, 'id' | 'code' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  syncFromApi: () => Promise<void>;
  getTodayStats: () => {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    averageOrderValue: number;
  };
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    code: 'ORD-1001',
    tableId: 'T01',
    tableName: 'Bàn 01',
    isTakeaway: false,
    items: [
      {
        cartItemId: 'M101-M-100-100',
        product: {
          id: 'M101',
          name: 'Thanh Nhài (Bồng Biêng)',
          categoryId: 'tea_flower',
          price: 55000,
          image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
          isAvailable: true,
        },
        quantity: 2,
        size: 'M',
        sugarLevel: '100%',
        iceLevel: 'Vừa đá',
        selectedOptions: [],
        itemTotalPrice: 82000,
      },
    ],
    subtotal: 82000,
    discount: 0,
    total: 82000,
    paymentMethod: 'vietqr',
    status: 'completed',
    createdAt: '2026-07-31 13:45',
    completedAt: '2026-07-31 13:50',
    cashierName: 'Thu Ngân 01',
  },
];

// Real-time Cross-Tab Broadcast Channel helper
const orderChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('coffee_order_realtime_channel')
  : null;

const notifyRealtimeSync = () => {
  if (orderChannel) {
    orderChannel.postMessage({ type: 'ORDER_SYNC_EVENT', timestamp: Date.now() });
  }
};

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      activeFilter: 'all',
      activeOrderFilter: 'all',

      setActiveFilter: (filter) => set({ activeFilter: filter, activeOrderFilter: filter }),
      setActiveOrderFilter: (filter) => set({ activeFilter: filter, activeOrderFilter: filter }),

      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now().toString().slice(-4)}`,
          code: generateCode('ORD'),
          createdAt: new Date().toISOString(),
          completedAt: orderData.status === 'completed' ? new Date().toISOString() : undefined,
        };

        const updatedOrders = [newOrder, ...get().orders];
        set({ orders: updatedOrders });

        // Notify other tabs in real-time instantly
        notifyRealtimeSync();

        // Asynchronously sync to MongoDB backend API
        try {
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder),
          }).catch(() => {});
        } catch (err) {}

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        const updatedOrders = get().orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
                completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt,
              }
            : o
        );
        set({ orders: updatedOrders });

        // Notify other tabs in real-time instantly
        notifyRealtimeSync();

        // Sync status update to MongoDB
        try {
          fetch(`/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          }).catch(() => {});
        } catch (err) {}
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      syncFromApi: async () => {
        try {
          const res = await fetch('/api/orders');
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            set({ orders: json.data });
          }
        } catch (err) {}
      },

      getTodayStats: () => {
        const completedOrdersList = get().orders.filter((o) => o.status === 'completed');
        const totalRevenue = completedOrdersList.reduce((sum, o) => sum + o.total, 0);
        const totalOrders = get().orders.length;
        const completedOrders = completedOrdersList.length;
        const averageOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

        return {
          totalRevenue,
          totalOrders,
          completedOrders,
          averageOrderValue,
        };
      },
    }),
    {
      name: 'coffee_order_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Listen to BroadcastChannel & localStorage events for instant real-time sync across all open tabs!
if (typeof window !== 'undefined') {
  if (orderChannel) {
    orderChannel.onmessage = (event) => {
      if (event.data?.type === 'ORDER_SYNC_EVENT') {
        useOrderStore.persist.rehydrate();
      }
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'coffee_order_store') {
      useOrderStore.persist.rehydrate();
    }
  });
}
