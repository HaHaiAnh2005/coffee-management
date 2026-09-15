import React from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isStaffOrAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'MANAGER' ||
    user?.role === 'CASHIER' ||
    user?.role === 'WAITER' ||
    user?.role === 'BARISTA';

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStaffOrAdmin) return <Navigate to="/login" replace />;

  const isStaff = user?.role === 'CASHIER' || user?.role === 'WAITER' || user?.role === 'BARISTA';
  if (isStaff && location.pathname !== '/admin/orders') {
    return <Navigate to="/admin/orders" replace />;
  }

  return <>{children}</>;
};
