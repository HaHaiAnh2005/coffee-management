import Coupon, { ICoupon } from '../models/coupon.model';

export class CouponService {
  async getAll(): Promise<ICoupon[]> {
    return await Coupon.find().lean();
  }

  async getByCode(code: string): Promise<ICoupon | null> {
    return await Coupon.findOne({ code, isActive: true }).lean();
  }

  async create(data: Partial<ICoupon>): Promise<ICoupon> {
    const coupon = new Coupon(data);
    return await coupon.save();
  }

  async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
    return await Coupon.findOneAndUpdate({ id }, data, { new: true });
  }

  async delete(id: string): Promise<ICoupon | null> {
    return await Coupon.findOneAndDelete({ id });
  }
}

export default new CouponService();
