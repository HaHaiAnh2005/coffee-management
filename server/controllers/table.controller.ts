import { Request, Response } from 'express';
import tableService from '../services/table.service';

export class TableController {
  async getAllTables(req: Request, res: Response) {
    try {
      const tables = await tableService.getAllTables();
      return res.json({ success: true, data: tables });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllAreas(req: Request, res: Response) {
    try {
      const areas = await tableService.getAllAreas();
      return res.json({ success: true, data: areas });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTableById(req: Request, res: Response) {
    try {
      const table = await tableService.getTableById(req.params.id);
      if (!table) {
        return res.status(404).json({ success: false, message: 'Table not found' });
      }
      return res.json({ success: true, data: table });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createTable(req: Request, res: Response) {
    try {
      const table = await tableService.createTable(req.body);
      return res.status(201).json({ success: true, data: table });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateTable(req: Request, res: Response) {
    try {
      const table = await tableService.updateTable(req.params.id, req.body);
      return res.json({ success: true, data: table });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status, currentOrderId } = req.body;
      const table = await tableService.updateStatus(req.params.id, status, currentOrderId);
      return res.json({ success: true, data: table });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteTable(req: Request, res: Response) {
    try {
      await tableService.deleteTable(req.params.id);
      return res.json({ success: true, message: 'Table deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new TableController();
