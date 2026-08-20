import { create } from 'zustand';
import type { Category, CategoryId, Product } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/mockData';
import { productApi } from '../api/product.api';

export interface MenuState {
  products: Product[];
  categories: Category[];
  selectedCategoryId: CategoryId | 'all';
  selectedCategory: CategoryId | 'all';
  searchQuery: string;

  // Actions
  fetchProducts: () => Promise<void>;
  setSelectedCategoryId: (categoryId: CategoryId | 'all') => void;
  setSelectedCategory: (categoryId: CategoryId | 'all') => void;
  setSearchQuery: (query: string) => void;
  toggleProductAvailability: (productId: string) => void;
  toggleAvailability: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const useMenuStore = create<MenuState>()((set, get) => ({
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  selectedCategoryId: 'all',
  selectedCategory: 'all',
  searchQuery: '',

  fetchProducts: async () => {
    const fetched = await productApi.getAll();
    if (Array.isArray(fetched) && fetched.length > 0) {
      set({ products: fetched });
    }
  },

  setSelectedCategoryId: (categoryId) =>
    set({ selectedCategoryId: categoryId, selectedCategory: categoryId }),
  setSelectedCategory: (categoryId) =>
    set({ selectedCategoryId: categoryId, selectedCategory: categoryId }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleProductAvailability: (productId) => {
    const currentProducts = Array.isArray(get().products) ? get().products : [];
    const p = currentProducts.find((prod) => prod.id === productId);
    if (!p) return;
    const newStatus = !p.isAvailable;
    set({
      products: currentProducts.map((item) =>
        item.id === productId ? { ...item, isAvailable: newStatus } : item
      ),
    });
    productApi.update(productId, { isAvailable: newStatus });
  },

  toggleAvailability: (productId) => {
    const currentProducts = Array.isArray(get().products) ? get().products : [];
    const p = currentProducts.find((prod) => prod.id === productId);
    if (!p) return;
    const newStatus = !p.isAvailable;
    set({
      products: currentProducts.map((item) =>
        item.id === productId ? { ...item, isAvailable: newStatus } : item
      ),
    });
    productApi.update(productId, { isAvailable: newStatus });
  },

  addProduct: async (productData) => {
    const newId = `M${Math.floor(800 + Math.random() * 100)}`;
    const newProduct: Product = {
      name: productData.name,
      categoryId: productData.categoryId,
      price: productData.price,
      image: productData.image,
      description: productData.description,
      optionGroups: productData.optionGroups,
      isAvailable: productData.isAvailable ?? true,
      id: newId,
    };

    const currentProducts = Array.isArray(get().products) ? get().products : [];
    set({ products: [newProduct, ...currentProducts] });

    // Sync to MongoDB via REST API
    const saved = await productApi.create(newProduct);
    return saved || newProduct;
  },

  updateProduct: async (productId, updatedData) => {
    const currentProducts = Array.isArray(get().products) ? get().products : [];
    set({
      products: currentProducts.map((p) => (p.id === productId ? { ...p, ...updatedData } : p)),
    });
    await productApi.update(productId, updatedData);
  },

  deleteProduct: async (productId) => {
    const currentProducts = Array.isArray(get().products) ? get().products : [];
    set({
      products: currentProducts.filter((p) => p.id !== productId),
    });
    await productApi.delete(productId);
  },
}));

// Automatically fetch products from MongoDB on load
useMenuStore.getState().fetchProducts();
