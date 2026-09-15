import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Client Pages
import { Home } from '../pages/client/Home';
import { Menu } from '../pages/client/Menu';
import { ProductDetail } from '../pages/client/ProductDetail';
import { Cart } from '../pages/client/Cart';
import { Checkout } from '../pages/client/Checkout';
import { OrderHistory } from '../pages/client/OrderHistory';
import { Membership } from '../pages/client/Membership';
import { Story } from '../pages/client/Story';
import { News } from '../pages/client/News';
import { Contact } from '../pages/client/Contact';
import { Profile } from '../pages/client/Profile';
import { Login } from '../pages/client/Login';
import { Register } from '../pages/client/Register';
import { TableMap } from '../pages/client/TableMap';

// Admin Pages
import { StaffLogin } from '../pages/admin/StaffLogin';
import { Dashboard } from '../pages/admin/Dashboard';
import { Products } from '../pages/admin/Products';
import { Categories } from '../pages/admin/Categories';
import { Tables } from '../pages/admin/Tables';
import { Employees } from '../pages/admin/Employees';
import { Customers } from '../pages/admin/Customers';
import { Orders } from '../pages/admin/Orders';
import { Coupons } from '../pages/admin/Coupons';
import { Reports } from '../pages/admin/Reports';
import { AuditLogs } from '../pages/admin/AuditLogs';
import { Settings } from '../pages/admin/Settings';

// Route Guards
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

// Internal POS Page
import { POSPage } from '../pages/POSPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Client Portal Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="chuyen-bong-bieng" element={<Story />} />
        <Route path="menu" element={<Menu />} />
        <Route path="san-pham" element={<Menu />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="so-do-ban" element={<TableMap />} />
        <Route path="ban-trong" element={<TableMap />} />
        <Route
          path="order-history"
          element={
            <PrivateRoute>
              <OrderHistory />
            </PrivateRoute>
          }
        />
        <Route path="chinh-sach-thanh-vien" element={<Membership />} />
        <Route path="tin-tuc" element={<News />} />
        <Route path="lien-he" element={<Contact />} />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="admin/login" element={<StaffLogin />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="admin/dashboard" element={<Dashboard />} />
        <Route path="admin/pos" element={<POSPage />} />
        <Route path="admin/products" element={<Products />} />
        <Route path="admin/categories" element={<Categories />} />
        <Route path="admin/employees" element={<Employees />} />
        <Route path="admin/customers" element={<Customers />} />
        <Route path="admin/orders" element={<Orders />} />
        <Route path="admin/coupons" element={<Coupons />} />
        <Route path="admin/reports" element={<Reports />} />
        <Route path="admin/audit-logs" element={<AuditLogs />} />
        <Route path="admin/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
