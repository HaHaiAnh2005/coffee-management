import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { issueCustomerActivation } from '../services/customer-activation.service';

const router = Router();

router.post('/customer-activation/:id', authenticateToken, requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.body.confirmedIdentity !== true) throw new Error('Cần xác nhận danh tính khách trước khi cấp mã.');
    const data = await issueCustomerActivation(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Không thể cấp mã kích hoạt.' });
  }
});

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', authenticateToken, (req, res) => authController.me(req, res));

export default router;
