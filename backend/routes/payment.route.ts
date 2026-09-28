import { Router } from 'express';
import { sepayWebhook, createSepayOrder } from '../controllers/sepay.controller';
import { validateNumericBody } from '../middleware/numeric.middleware';
import {
  createPaymentUrl,
  verifyPaymentStatus,
  vnpayIPN,
  momoIPN,
} from '../controllers/payment.controller';

const router = Router();
router.post('/sepay-webhook', sepayWebhook);
router.post('/sepay-orders', validateNumericBody, createSepayOrder);

// POST /api/payment/create-url - Tạo URL chuyển hướng thanh toán
router.post('/create-url', createPaymentUrl);

// GET /api/payment/verify-status - Frontend gọi để kiểm tra và cập nhật trạng thái đơn
router.get('/verify-status', verifyPaymentStatus);

// IPN Webhooks từ máy chủ Cổng thanh toán
router.get('/vnpay-ipn', vnpayIPN);
router.post('/momo-ipn', momoIPN);

export default router;
