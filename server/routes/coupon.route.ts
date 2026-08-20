import { Router } from 'express';
import couponController from '../controllers/coupon.controller';

const router = Router();

router.get('/', (req, res) => couponController.getAll(req, res));
router.get('/code/:code', (req, res) => couponController.getByCode(req, res));
router.post('/', (req, res) => couponController.create(req, res));
router.put('/:id', (req, res) => couponController.update(req, res));
router.delete('/:id', (req, res) => couponController.delete(req, res));

export default router;
