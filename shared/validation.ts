export const MAX_ORDER_QUANTITY = 20;
export const MAX_CART_QUANTITY = 50;
export const PERSON_NAME_PATTERN = '[\\p{L}\\p{M}]+(?: +[\\p{L}\\p{M}]+)*';
export const PHONE_PATTERN = '0[0-9]{9,10}';
export function personNameError(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > 100 || !new RegExp(`^${PERSON_NAME_PATTERN}$`, 'u').test(value.trim().normalize('NFC'))) {
    return 'Họ tên phải có 2–100 ký tự, chỉ gồm chữ cái và khoảng trắng';
  }
  return '';
}
export function phoneError(value: unknown): string {
  return typeof value === 'string' && new RegExp(`^${PHONE_PATTERN}$`).test(value.trim()) ? '' : 'Số điện thoại phải bắt đầu bằng 0 và gồm 10–11 chữ số';
}
export function emailError(value: unknown): string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Email không hợp lệ';
}
export function nonnegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
}
export function orderQuantityError(items: unknown): string {
  if (!Array.isArray(items) || !items.length) return 'Giỏ hàng phải có ít nhất một món';
  let total = 0;
  const byProduct = new Map<string, number>();
  for (const item of items) {
    if (!item || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ORDER_QUANTITY) return 'Số lượng món phải là số nguyên từ 1 đến 20';
    total += item.quantity;
    const id = item.product?.id;
    if (typeof id !== 'string' || !id.trim()) return 'Món phải có mã sản phẩm hợp lệ';
    if (typeof id === 'string') {
      const count = (byProduct.get(id) || 0) + item.quantity;
      if (count > MAX_ORDER_QUANTITY) return 'Mỗi món được mua tối đa 20, kể cả khác size hoặc topping';
      byProduct.set(id, count);
    }
  }
  return total > MAX_CART_QUANTITY ? 'Mỗi đơn được mua tối đa 50 món' : '';
}
