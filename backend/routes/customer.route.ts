import { Router } from 'express';
import customerController from '../controllers/customer.controller';

const router = Router();

router.get('/', (req, res) => customerController.getAll(req, res));
router.get('/phone/:phone', (req, res) => customerController.getByPhone(req, res));
router.get('/:id', (req, res) => customerController.getById(req, res));
router.post('/', (req, res) => customerController.create(req, res));
router.put('/:id', (req, res) => customerController.update(req, res));
router.delete('/:id', (req, res) => customerController.delete(req, res));

export default router;
