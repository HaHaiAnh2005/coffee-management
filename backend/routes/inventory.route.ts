import { Router } from 'express';
import inventoryController from '../controllers/inventory.controller';

const router = Router();

// Receipts (Phiếu nhập / xuất kho)
router.get('/receipts', (req, res) => inventoryController.getAllReceipts(req, res));
router.get('/receipts/:id', (req, res) => inventoryController.getReceiptById(req, res));
router.post('/receipts', (req, res) => inventoryController.createReceipt(req, res));

// Items (Nguyên liệu kho)
router.get('/', (req, res) => inventoryController.getAll(req, res));
router.get('/:id', (req, res) => inventoryController.getById(req, res));
router.post('/', (req, res) => inventoryController.create(req, res));
router.put('/:id', (req, res) => inventoryController.update(req, res));
router.delete('/:id', (req, res) => inventoryController.delete(req, res));

export default router;
