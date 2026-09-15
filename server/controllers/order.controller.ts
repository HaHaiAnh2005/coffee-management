import { Request, Response } from 'express';
import orderService from '../services/order.service';

export class OrderController {
  async getAll(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const orders = await orderService.getAll(status);
      return res.json({ success: true, data: orders });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const order = await orderService.getById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, data: order });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const order = await orderService.create(req.body);
      return res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const order = await orderService.updateStatus(req.params.id, status);
      return res.json({ success: true, data: order });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await orderService.delete(req.params.id);
      return res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new OrderController();
