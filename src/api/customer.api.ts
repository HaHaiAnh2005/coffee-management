import { axiosClient } from '../config/axios';
import type { Customer, CustomerTier } from '../types/customer';

export type { Customer, CustomerTier };

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Phạm Minh Anh',
    phone: '0912345678',
    email: 'minhanh@gmail.com',
    rewardPoints: 240,
    totalSpent: 2400000,
    tier: 'Vàng',
    createdAt: '2025-01-15',
    notes: 'Khách hàng thân thiết thích uống Cà phê muối'
  },
  {
    id: 'CUS-002',
    name: 'Hoàng Quốc Việt',
    phone: '0987654321',
    email: 'quocviet@gmail.com',
    rewardPoints: 510,
    totalSpent: 5100000,
    tier: 'Kim Cương',
    createdAt: '2025-02-01',
    notes: 'VIP - Đã quy đổi voucher 100k'
  },
  {
    id: 'CUS-003',
    name: 'Đỗ Thùy Trang',
    phone: '0905111222',
    email: 'thuytrang@gmail.com',
    rewardPoints: 85,
    totalSpent: 850000,
    tier: 'Bạc',
    createdAt: '2025-03-10',
    notes: 'Thường mua Trà nhài bồng biêng'
  },
  {
    id: 'CUS-004',
    name: 'Nguyễn Văn Hải',
    phone: '0933444555',
    email: 'vanhai.nguyen@gmail.com',
    rewardPoints: 320,
    totalSpent: 3200000,
    tier: 'Vàng',
    createdAt: '2025-04-05',
    notes: 'Khách đặt mang đi định kỳ'
  },
  {
    id: 'CUS-005',
    name: 'Lê Thị Khánh Huyền',
    phone: '0977888999',
    email: 'khanhhuyen.le@gmail.com',
    rewardPoints: 680,
    totalSpent: 6800000,
    tier: 'Kim Cương',
    createdAt: '2025-01-20',
    notes: 'Khách VIP văn phòng'
  }
];

export const calculateCustomerTier = (totalSpent: number): CustomerTier => {
  if (totalSpent >= 5000000) return 'Kim Cương';
  if (totalSpent >= 2000000) return 'Vàng';
  return 'Bạc';
};

const mapServerCustomerToClient = (c: any): Customer => {
  return {
    id: c.id || c._id,
    name: c.name || 'Khách hàng',
    phone: c.phone || '',
    email: c.email || '',
    rewardPoints: c.rewardPoints ?? c.points ?? 0,
    totalSpent: c.totalSpent ?? 0,
    tier: c.tier || calculateCustomerTier(c.totalSpent || 0),
    createdAt: c.createdAt || c.joinedDate || new Date().toISOString().split('T')[0],
    notes: c.notes || '',
  };
};

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const res: any = await axiosClient.get('/customers');
      let rawList: any[] = [];
      if (Array.isArray(res)) rawList = res;
      else if (Array.isArray(res?.data)) rawList = res.data;
      else if (Array.isArray(res?.data?.data)) rawList = res.data.data;

      if (rawList.length > 0) {
        return rawList.map(mapServerCustomerToClient);
      }
      return INITIAL_CUSTOMERS;
    } catch (error) {
      console.error('Error fetching customers from backend:', error);
      return INITIAL_CUSTOMERS;
    }
  },

  create: async (customerData: Partial<Customer>): Promise<Customer | null> => {
    try {
      const res: any = await axiosClient.post('/customers', {
        ...customerData,
        points: customerData.rewardPoints ?? 0,
        joinedDate: customerData.createdAt,
      });
      const data = res?.data || res;
      if (data && (data.id || data._id)) {
        return mapServerCustomerToClient(data);
      }
      return null;
    } catch (error) {
      console.error('Error creating customer on backend:', error);
      return null;
    }
  },

  update: async (id: string, customerData: Partial<Customer>): Promise<Customer | null> => {
    try {
      const res: any = await axiosClient.put(`/customers/${id}`, {
        ...customerData,
        points: customerData.rewardPoints,
      });
      const data = res?.data || res;
      if (data) return mapServerCustomerToClient(data);
      return null;
    } catch (error) {
      console.error('Error updating customer on backend:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await axiosClient.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting customer on backend:', error);
      return false;
    }
  },
};

