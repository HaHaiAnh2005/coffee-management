import Order, { IOrder } from '../models/order.model';
import { randomBytes } from 'node:crypto';
import Product from '../models/product.model';
import { sepayConfig } from './sepay.service';
import { orderQuantityError } from '../../shared/validation';

export class OrderService {
  async getAll(status?: string): Promise<IOrder[]> {
    const filter = status && status !== 'all' ? { status } : {};
    return await Order.find(filter).sort({ createdAt: -1 }).lean();
  }

  async getById(id: string): Promise<IOrder | null> {
    return await Order.findOne({ id }).lean();
  }

  async create(data: Partial<IOrder>, verifyWithSepay = false): Promise<IOrder> {
    const quantityError = orderQuantityError(data.items);
    if (quantityError) throw new Error(quantityError);
    // These fields may only be set by the server or the authenticated bank webhook.
    delete data.paymentReference;
    delete data.sepayTransactionId;
    delete data.paymentAccount;
    delete data.paymentBank;
    delete data.paymentAccountName;
    if (!verifyWithSepay && data.id?.startsWith('SEPAY-')) throw new Error('Đơn SePay phải được tạo qua endpoint thanh toán');
    if (verifyWithSepay) {
      const config = sepayConfig();
      if (!data.id || !/^SEPAY-[0-9a-f-]{36}$/.test(data.id)) throw new Error('Thiếu mã yêu cầu VietQR hợp lệ');
      const existing = await Order.findOne({ id: data.id });
      if (existing) return existing;
      if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 100) throw new Error('Giỏ hàng không hợp lệ');
      const pricedItems = [];
      for (const item of data.items) {
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || !['S', 'M', 'L'].includes(item.size ?? '')) throw new Error('Số lượng hoặc kích cỡ không hợp lệ');
        const product = await Product.findOne({ id: item.product?.id, isAvailable: true });
        if (!product) throw new Error('Sản phẩm không còn được bán');
        // The current product database has no option-price catalog to verify against.
        if (item.selectedOptions?.length) throw new Error('Món có tùy chọn bổ sung cần cửa hàng xác nhận giá trước khi chuyển khoản');
        const price = product.price + (item.size === 'M' ? 6000 : item.size === 'L' ? 10000 : 0);
        pricedItems.push({ ...item, product: { id: product.id, name: product.name, price: product.price, categoryId: product.categoryId, image: product.image }, itemTotalPrice: price * item.quantity });
      }
      const total = pricedItems.reduce((sum, item) => sum + item.itemTotalPrice, 0);
      if (!Number.isSafeInteger(total) || total <= 0 || total !== data.total) throw new Error('Giá đơn hàng đã thay đổi hoặc không hợp lệ. Vui lòng tải lại giỏ hàng');
      await Order.init();
      try {
        const reference = `BB${randomBytes(8).toString('hex').toUpperCase()}`;
        return await Order.create({
          id: data.id, code: reference, paymentReference: reference,
          items: pricedItems, isTakeaway: true,
          customerName: data.customerName, customerPhone: data.customerPhone,
          subtotal: total, discount: 0, total, paymentMethod: 'vietqr', status: 'pending',
          paymentAccount: config.account, paymentBank: config.bank, paymentAccountName: config.accountName,
          cashierName: 'Online SePay', createdAt: new Date().toISOString(),
        });
      } catch (error) {
        if ((error as { code?: number }).code === 11000) {
          const duplicate = await Order.findOne({ id: data.id });
          if (duplicate) return duplicate;
        }
        throw error;
      }
    }
    const orderId = data.id || `ORD-${Date.now().toString().slice(-4)}`;
    const code = data.code || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = data.createdAt || new Date().toISOString();

    const order = new Order({
      ...data,
      id: orderId,
      code,
      createdAt,
      completedAt: data.status === 'completed' ? new Date().toISOString() : undefined,
    });
    return await order.save();
  }

  async updateStatus(id: string, status: string): Promise<IOrder | null> {
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date().toISOString();
    }
    if (status === 'completed') {
      const order = await Order.findOne({ id });
      if (order?.paymentReference && !order.sepayTransactionId) throw new Error('Đơn VietQR chưa có giao dịch SePay xác nhận');
    }
    return await Order.findOneAndUpdate({ id, ...(status === 'completed' ? { $or: [{ paymentReference: { $exists: false } }, { sepayTransactionId: { $exists: true } }] } : {}) }, updateData, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<IOrder | null> {
    return await Order.findOneAndDelete({ id });
  }
}

export default new OrderService();
