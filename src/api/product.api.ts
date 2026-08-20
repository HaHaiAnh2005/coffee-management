import { axiosClient } from '../config/axios';
import type { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/mockData';

export const productApi = {
  getAll: async (categoryId?: string): Promise<Product[]> => {
    try {
      const res: any = await axiosClient.get('/products', {
        params: categoryId && categoryId !== 'all' ? { categoryId } : {},
      });

      // Strict Array verification
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;

      return INITIAL_PRODUCTS;
    } catch (error) {
      console.error('Error fetching products from server:', error);
      return INITIAL_PRODUCTS;
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const res: any = await axiosClient.get(`/products/${id}`);
      if (res?.data) return res.data;
      if (res && typeof res === 'object' && res.id) return res;
      return null;
    } catch {
      return null;
    }
  },

  create: async (productData: Partial<Product>): Promise<Product | null> => {
    try {
      const res: any = await axiosClient.post('/products', productData);
      if (res?.data) return res.data;
      if (res && typeof res === 'object' && res.id) return res;
      return null;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      const res: any = await axiosClient.put(`/products/${id}`, productData);
      if (res?.data) return res.data;
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await axiosClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },
};
