import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res) => orderController.getAll(req, res));
router.get('/:id', (req, res) => orderController.getById(req, res));
router.post('/', (req, res) => orderController.create(req, res));
router.patch('/:id/status', (req, res) => orderController.updateStatus(req, res));
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => orderController.delete(req, res));

export default router;
