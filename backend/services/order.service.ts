import Order, { IOrder } from '../models/order.model';

export class OrderService {
  async getAll(status?: string): Promise<IOrder[]> {
    const filter = status && status !== 'all' ? { status } : {};
    return await Order.find(filter).sort({ createdAt: -1 }).lean();
  }

  async getById(id: string): Promise<IOrder | null> {
    return await Order.findOne({ id }).lean();
  }

  async create(data: Partial<IOrder>): Promise<IOrder> {
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
    return await Order.findOneAndUpdate({ id }, updateData, { new: true });
  }

  async delete(id: string): Promise<IOrder | null> {
    return await Order.findOneAndDelete({ id });
  }
}

export default new OrderService();
