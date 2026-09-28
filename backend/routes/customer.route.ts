import { Router } from 'express';
import customerController from '../controllers/customer.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res) => customerController.getAll(req, res));
router.get('/phone/:phone', (req, res) => customerController.getByPhone(req, res));
router.get('/:id', (req, res) => customerController.getById(req, res));
router.post('/', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => customerController.create(req, res));
router.put('/:id', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => customerController.update(req, res));
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'MANAGER'), (req, res) => customerController.delete(req, res));

export default router;
