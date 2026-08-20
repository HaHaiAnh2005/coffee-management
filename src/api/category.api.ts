import type { Category } from '../types/category';
import { INITIAL_CATEGORIES } from '../data/mockData';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return INITIAL_CATEGORIES;
  },
};
