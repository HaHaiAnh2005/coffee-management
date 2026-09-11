import { Router } from 'express';
import tableController from '../controllers/table.controller';

const router = Router();

router.get('/', (req, res) => tableController.getAllTables(req, res));
router.get('/areas', (req, res) => tableController.getAllAreas(req, res));
router.get('/:id', (req, res) => tableController.getTableById(req, res));
router.post('/', (req, res) => tableController.createTable(req, res));
router.put('/:id', (req, res) => tableController.updateTable(req, res));
router.patch('/:id/status', (req, res) => tableController.updateStatus(req, res));
router.delete('/:id', (req, res) => tableController.deleteTable(req, res));

export default router;
