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
}

export default new InventoryController();
