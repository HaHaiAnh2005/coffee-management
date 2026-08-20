export type Role = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'BARISTA' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: Role;
  pin?: string;
  address?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password?: string;
}
