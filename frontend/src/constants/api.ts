export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  TABLES: '/tables',
  EMPLOYEES: '/employees',
  CUSTOMERS: '/customers',
  DASHBOARD: '/dashboard/stats',
};
