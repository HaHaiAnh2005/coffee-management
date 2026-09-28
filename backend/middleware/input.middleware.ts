import type { Request, Response, NextFunction } from 'express';
import { personNameError, phoneError, emailError, orderQuantityError } from '../../shared/validation';

export function inputError(path: string, body: Record<string, unknown>): string {
  const identity = /^\/(users|customers)(\/|$)/.test(path) || path === '/auth/register';
  const order = path === '/orders' || path === '/payment/create-url' || path === '/payment/sepay-orders';
  if (identity && body.name !== undefined) { const error = personNameError(body.name); if (error) return error; }
  if (order && body.customerName !== undefined && body.customerName !== '') { const error = personNameError(body.customerName); if (error) return error; }
  if (identity || path === '/settings' || order) {
    for (const key of ['phone', 'customerPhone']) {
      if (body[key] !== undefined && body[key] !== '') { const error = phoneError(body[key]); if (error) return error; }
    }
    if (body.email !== undefined && body.email !== '') { const error = emailError(body.email); if (error) return error; }
  }
  if (body.pin !== undefined && body.pin !== '' && (typeof body.pin !== 'string' || !/^\d{4}$/.test(body.pin))) return 'Mã PIN phải gồm đúng 4 chữ số';
  if (body.bankAccountNo !== undefined && (typeof body.bankAccountNo !== 'string' || !/^\d{6,20}$/.test(body.bankAccountNo))) return 'Số tài khoản phải gồm 6–20 chữ số';
  if (body.birthday && (typeof body.birthday !== 'string' || !Number.isFinite(Date.parse(body.birthday)) || Date.parse(body.birthday) > Date.now())) return 'Ngày sinh không hợp lệ hoặc nằm trong tương lai';
  if (body.discountType === 'percent' && typeof body.discountValue === 'number' && body.discountValue > 100) return 'Giảm giá phần trăm không được vượt quá 100';
  if (/^\/coupons(\/|$)/.test(path) && body.code !== undefined && (typeof body.code !== 'string' || !/^[A-Za-z0-9_-]{1,30}$/.test(body.code))) return 'Mã giảm giá gồm 1–30 chữ cái, chữ số, gạch ngang hoặc gạch dưới';
  for (const key of ['validFrom', 'validUntil', 'expiryDate']) {
    if (body[key] !== undefined && body[key] !== '' && (typeof body[key] !== 'string' || !Number.isFinite(Date.parse(body[key] as string)))) return `${key}: ngày không hợp lệ`;
  }
  if (body.validFrom && body.validUntil && String(body.validFrom) > String(body.validUntil)) return 'Ngày kết thúc phải sau ngày bắt đầu';
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && ['name', 'storeName', 'title', 'address', 'description', 'note', 'notes', 'reason', 'supplier'].includes(key)) {
      if (!value.trim() && ['name', 'storeName', 'title', 'address', 'reason'].includes(key)) return `${key}: không được để trống`;
      if (value.length > (['note', 'notes', 'description'].includes(key) ? 2000 : 300)) return `${key}: nội dung quá dài`;
    }
  }
  if (order && body.items !== undefined) return orderQuantityError(body.items);
  return '';
}
export function validateInputBody(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return next();
  const error = inputError(req.path, req.body || {});
  if (error) { res.status(400).json({ success: false, message: error }); return; }
  next();
}
