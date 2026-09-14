import { Request, Response } from 'express';
import inventoryService from '../services/inventory.service';

export class InventoryController {
  async getAll(req: Request, res: Response) {
    try {
      const items = await inventoryService.getAll();
      return res.json({ success: true, data: items });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const item = await inventoryService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      return res.json({ success: true, data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const item = await inventoryService.create(req.body);
      return res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const item = await inventoryService.update(req.params.id, req.body);
      return res.json({ success: true, data: item });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await inventoryService.delete(req.params.id);
      return res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- Receipt Actions (Phiếu Nhập / Xuất Kho) ---
  async getAllReceipts(req: Request, res: Response) {
    try {
      const receipts = await inventoryService.getAllReceipts();
      return res.json({ success: true, data: receipts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getReceiptById(req: Request, res: Response) {
    try {
      const receipt = await inventoryService.getReceiptById(req.params.id);
      if (!receipt) {
        return res.status(404).json({ success: false, message: 'Receipt not found' });
      }
      return res.json({ success: true, data: receipt });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createReceipt(req: Request, res: Response) {
    try {
      const { type, reason, supplier, creatorName, items, totalAmount, notes } = req.body;
      const count = (await inventoryService.getAllReceipts()).length;
      const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const prefix = type === 'IMPORT' ? 'PNK' : 'PXK';
      const code = `${prefix}-${datePrefix}-${String(count + 1).padStart(3, '0')}`;
      const id = `rcpt_${Date.now()}`;

      const receipt = await inventoryService.createReceipt({
        id,
        code,
        type: type || 'IMPORT',
        reason: reason || (type === 'IMPORT' ? 'Nhập kho định kỳ' : 'Xuất pha chế'),
        supplier: supplier || '',
        creatorName: creatorName || 'Thủ kho',
        items: items || [],
        totalAmount: totalAmount || 0,
        notes: notes || '',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({ success: true, data: receipt });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new InventoryController();
