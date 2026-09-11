import { Request, Response } from 'express';
import Order from '../models/order.model';
import { createVNPayUrl, verifyVNPayCallback } from '../services/vnpay.service';
import { createMoMoPaymentUrl, verifyMoMoSignature } from '../services/momo.service';

export const createPaymentUrl = async (req: Request, res: Response) => {
  try {
    const {
      paymentMethod,
      amount,
      customerName,
      customerPhone,
      items = [],
      subtotal,
      discount = 0,
      isTakeaway = true,
      tableId,
      tableName,
    } = req.body;

    if (!paymentMethod || !amount) {
      res.status(400).json({ success: false, message: 'Thiếu phương thức hoặc số tiền thanh toán' });
      return;
    }

    const orderCount = await Order.countDocuments();
    const orderCode = `ORD-${Date.now().toString().slice(-4)}${orderCount + 1}`;
    const orderId = `order_${Date.now()}`;

    // 1. Tạo đơn hàng tạm thời ở trạng thái pending
    const newOrder = new Order({
      id: orderId,
      code: orderCode,
      tableId,
      tableName,
      isTakeaway,
      customerName: customerName || 'Khách vãng lai',
      customerPhone: customerPhone || '',
      items,
      subtotal: subtotal || amount,
      discount: discount || 0,
      total: amount,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      cashierName: paymentMethod === 'vnpay' ? 'Cổng VNPay' : 'Cổng MoMo',
    });

    await newOrder.save();

    // 2. Tạo URL thanh toán chuyển hướng theo từng cổng
    let paymentUrl = '';
    const orderInfo = `Thanh toan don hang ${orderCode} - Laura Coffee`;

    if (paymentMethod === 'vnpay') {
      paymentUrl = createVNPayUrl(req, orderId, amount, orderInfo);
    } else if (paymentMethod === 'momo') {
      paymentUrl = await createMoMoPaymentUrl(orderId, amount, orderInfo);
    } else {
      res.status(400).json({ success: false, message: 'Phương thức thanh toán không hỗ trợ cổng chuyển hướng' });
      return;
    }

    res.status(200).json({
      success: true,
      paymentUrl,
      orderId,
      code: orderCode,
      amount,
    });
  } catch (error: any) {
    console.error('[Payment Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo liên kết thanh toán',
    });
  }
};

export const verifyPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { method, orderId } = req.query;

    if (method === 'vnpay') {
      const result = verifyVNPayCallback(req.query);
      if (result.isValidSignature && result.isSuccess) {
        const order = await Order.findOneAndUpdate(
          { id: result.orderId },
          { status: 'completed', completedAt: new Date().toISOString() },
          { new: true }
        );
        res.status(200).json({ success: true, isSuccess: true, order });
        return;
      }
      res.status(200).json({
        success: true,
        isSuccess: false,
        message: 'Thanh toán thất bại hoặc chữ ký không hợp lệ',
        responseCode: result.responseCode,
      });
      return;
    }

    if (method === 'momo') {
      const { resultCode, orderId: momoOrderId } = req.query;
      const isSuccess = Number(resultCode) === 0;
      if (isSuccess && momoOrderId) {
        const order = await Order.findOneAndUpdate(
          { id: momoOrderId },
          { status: 'completed', completedAt: new Date().toISOString() },
          { new: true }
        );
        res.status(200).json({ success: true, isSuccess: true, order });
        return;
      }
      res.status(200).json({ success: true, isSuccess: false, message: 'Thanh toán MoMo chưa hoàn tất' });
      return;
    }

    // Fallback: Tìm theo orderId nếu có
    if (orderId) {
      const order = await Order.findOne({ id: orderId as string });
      res.status(200).json({ success: true, isSuccess: order?.status === 'completed', order });
      return;
    }

    res.status(400).json({ success: false, message: 'Thiếu thông tin kiểm tra giao dịch' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook IPN từ VNPay Server
export const vnpayIPN = async (req: Request, res: Response) => {
  try {
    const result = verifyVNPayCallback(req.query);
    if (!result.isValidSignature) {
      res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
      return;
    }

    const order = await Order.findOne({ id: result.orderId });
    if (!order) {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      return;
    }

    if (order.status === 'completed') {
      res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
      return;
    }

    if (result.isSuccess) {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
      await order.save();
      res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      return;
    } else {
      order.status = 'cancelled';
      await order.save();
      res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      return;
    }
  } catch (error) {
    res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

// Webhook IPN từ MoMo Server
export const momoIPN = async (req: Request, res: Response) => {
  try {
    const result = verifyMoMoSignature(req.body);
    if (!result.isValidSignature) {
      res.status(400).json({ message: 'Invalid Signature' });
      return;
    }

    const order = await Order.findOne({ id: result.orderId });
    if (order) {
      if (result.isSuccess) {
        order.status = 'completed';
        order.completedAt = new Date().toISOString();
      } else {
        order.status = 'cancelled';
      }
      await order.save();
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'IPN Error' });
  }
};
