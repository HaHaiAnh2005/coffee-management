import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import productRoute from './product.route';
import categoryRoute from './category.route';
import tableRoute from './table.route';
import orderRoute from './order.route';
import customerRoute from './customer.route';
import couponRoute from './coupon.route';
import inventoryRoute from './inventory.route';
import settingsRoute from './settings.route';
import shiftRoute from './shift.route';
import auditRoute from './audit.route';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Coffee Management REST API Server is running!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      tables: '/api/tables',
      orders: '/api/orders',
      customers: '/api/customers',
      coupons: '/api/coupons',
      inventory: '/api/inventory',
      shifts: '/api/shifts',
      auditLogs: '/api/audit-logs',
      settings: '/api/settings',
    },
  });
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/tables', tableRoute);
router.use('/orders', orderRoute);
router.use('/customers', customerRoute);
router.use('/coupons', couponRoute);
router.use('/inventory', inventoryRoute);
router.use('/shifts', shiftRoute);
router.use('/audit-logs', auditRoute);
router.use('/settings', settingsRoute);

export default router;
