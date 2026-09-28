import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken, requireRole('ADMIN', 'MANAGER'));

router.get('/', (req, res) => userController.getAll(req, res));
router.get('/:id', (req, res) => userController.getById(req, res));
router.post('/', (req, res) => userController.create(req, res));
router.put('/:id', (req, res) => userController.update(req, res));
router.delete('/:id', (req, res) => userController.delete(req, res));

export default router;
