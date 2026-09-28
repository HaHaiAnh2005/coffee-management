import type { Request, Response, NextFunction } from 'express';

const numericFields = new Set([
  'salary', 'price', 'quantity', 'unitPrice', 'minAlertThreshold', 'totalPrice',
  'totalAmount', 'discountValue', 'minOrderValue', 'maxDiscount', 'usageLimit',
  'usedCount', 'points', 'rewardPoints', 'totalSpent', 'totalOrders', 'subtotal',
  'discount', 'total', 'itemTotalPrice', 'initialCash', 'actualCash', 'expectedCash',
  'totalCashRevenue', 'variance',
  'amount', 'discountAmount', 'cashReceived', 'receivedAmount', 'change', 'shippingFee', 'tax', 'taxRate', 'vat', 'vatRate', 'loyaltyRate',
]);
const integerFields = new Set(['points', 'rewardPoints', 'totalOrders', 'usageLimit', 'usedCount']);

export function numericPayloadError(value: unknown, prefix = ''): string | undefined {
  if (!value || typeof value !== 'object') return;
  for (const [key, field] of Object.entries(value)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (key.startsWith('$') || key.includes('.')) return 'Không được gửi toán tử cập nhật trực tiếp';
    if (numericFields.has(key)) {
      if (typeof field !== 'number' || !Number.isFinite(field)) return `${name}: phải là số hợp lệ`;
      if (Math.abs(field) > Number.MAX_SAFE_INTEGER) return `${name}: số quá lớn`;
      if (key !== 'variance' && field < 0) return `${name}: không được âm`;
      if (integerFields.has(key) && !Number.isSafeInteger(field)) return `${name}: phải là số nguyên hợp lệ`;
      if (['taxRate', 'vat', 'vatRate'].includes(key) && field > 100) return `${name}: không được vượt quá 100%`;
    }
    const nested = numericPayloadError(field, name);
    if (nested) return nested;
  }
}

export function validateNumericBody(req: Request, res: Response, next: NextFunction) {
  const error = numericPayloadError(req.body);
  if (error) { res.status(400).json({ success: false, message: error }); return; }
  next();
}
