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
    if (coupon.discountType === 'percent' && coupon.discountValue > 100) throw new Error('Phần trăm giảm giá không được vượt quá 100');
    return await coupon.save();
  }

  async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
    const coupon = await Coupon.findOne({ id });
    if (!coupon) return null;
    coupon.set(data);
    if (coupon.discountType === 'percent' && coupon.discountValue > 100) throw new Error('Phần trăm giảm giá không được vượt quá 100');
    return await coupon.save();
  }

  async delete(id: string): Promise<ICoupon | null> {
    return await Coupon.findOneAndDelete({ id });
  }
}

export default new CouponService();
