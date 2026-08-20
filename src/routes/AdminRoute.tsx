import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const isStaffOrAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'MANAGER' ||
    user?.role === 'CASHIER' ||
    user?.role === 'WAITER' ||
    user?.role === 'BARISTA';

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isStaffOrAdmin) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};
