import type { Request, Response } from 'express';
import { applySePayTransfer, sepayConfig, sepayPayload, validSePayKey } from '../services/sepay.service';
import orderService from '../services/order.service';

export async function createSepayOrder(req: Request, res: Response) {
  try {
    if (typeof req.body?.customerName !== 'string' || !req.body.customerName.trim() ||
        typeof req.body.customerPhone !== 'string' || !/^\d{10,11}$/.test(req.body.customerPhone)) {
      res.status(400).json({ success: false, message: 'Tên hoặc số điện thoại không hợp lệ' }); return;
    }
    const order = await orderService.create(req.body, true);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Không tạo được đơn thanh toán' });
  }
}

export async function sepayWebhook(req: Request, res: Response) {
  let config;
  try { config = sepayConfig(); } catch {
    res.status(503).json({ success: false, message: 'SePay chưa được cấu hình' }); return;
  }
  if (!validSePayKey(req.get('Authorization'), config.key)) {
    res.status(401).json({ success: false, message: 'Unauthorized' }); return;
  }
  const parsed = sepayPayload.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Payload SePay không hợp lệ' }); return;
  }
  try {
    const result = await applySePayTransfer(parsed.data);
    console.info('[SePay]', parsed.data.id, result);
    res.json({ success: true });
  } catch {
    // Return failure so SePay can retry; never acknowledge an unfinished DB write.
    res.status(500).json({ success: false, message: 'Không thể xử lý giao dịch, vui lòng gửi lại' });
  }
}
