import { authApi } from '../api/auth.api';
import type { LoginCredentials, RegisterPayload } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    return (await authApi.register(payload)).data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};
