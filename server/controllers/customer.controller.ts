import { Request, Response } from 'express';
import customerService from '../services/customer.service';

export class CustomerController {
  async getAll(req: Request, res: Response) {
    try {
      const customers = await customerService.getAll();
      return res.json({ success: true, data: customers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const customer = await customerService.getById(req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      return res.json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByPhone(req: Request, res: Response) {
    try {
      const customer = await customerService.getByPhone(req.params.phone);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      return res.json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const customer = await customerService.create(req.body);
      return res.status(201).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const customer = await customerService.update(req.params.id, req.body);
      return res.json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await customerService.delete(req.params.id);
      return res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new CustomerController();
