import { Router } from 'express';
import { getCurrentShift, openShift, closeShift, getShiftHistory } from '../controllers/shift.controller';

const router = Router();

router.get('/current', getCurrentShift);
router.post('/open', openShift);
router.post('/close', closeShift);
router.get('/history', getShiftHistory);

export default router;
