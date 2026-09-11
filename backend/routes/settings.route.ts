import { Router } from 'express';
import settingsController from '../controllers/settings.controller';

const router = Router();

router.get('/', (req, res) => settingsController.getSettings(req, res));
router.put('/', (req, res) => settingsController.updateSettings(req, res));

export default router;
