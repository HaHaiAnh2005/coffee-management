import { Request, Response } from 'express';
import couponService from '../services/coupon.service';

export class CouponController {
  async getAll(req: Request, res: Response) {
    try {
      const coupons = await couponService.getAll();
      return res.json({ success: true, data: coupons });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByCode(req: Request, res: Response) {
    try {
      const coupon = await couponService.getByCode(req.params.code);
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
      }
      return res.json({ success: true, data: coupon });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const coupon = await couponService.create(req.body);
      return res.status(201).json({ success: true, data: coupon });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const coupon = await couponService.update(req.params.id, req.body);
      return res.json({ success: true, data: coupon });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await couponService.delete(req.params.id);
      return res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new CouponController();
