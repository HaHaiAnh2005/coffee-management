import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, isAuthenticated, loginSuccess, logout } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated,
    loginSuccess,
    logout,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'MANAGER',
  };
};
