import { axiosClient } from '../config/axios';
import type { Category } from '../types/category';
import { INITIAL_CATEGORIES } from '../data/mockData';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res: any = await axiosClient.get('/categories');
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return INITIAL_CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return INITIAL_CATEGORIES;
    }
  },

  create: async (data: Partial<Category>): Promise<Category | null> => {
    try {
      const res: any = await axiosClient.post('/categories', data);
      if (res?.data) return res.data;
      if (res && typeof res === 'object' && res.id) return res;
      return null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  },

  update: async (id: string, data: Partial<Category>): Promise<Category | null> => {
    try {
      const res: any = await axiosClient.put(`/categories/${id}`, data);
      if (res?.data) return res.data;
      return null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await axiosClient.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  },
};

