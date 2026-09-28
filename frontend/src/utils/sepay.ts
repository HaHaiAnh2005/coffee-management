import type { Order } from '../types/order';

export const SEPAY_PENDING_KEY = 'coffee_sepay_pending';
export const SEPAY_REQUEST_KEY = 'coffee_sepay_request';

export function readPendingSePay(): Order | null {
  try {
    const order = JSON.parse(sessionStorage.getItem(SEPAY_PENDING_KEY) || 'null');
    return typeof order?.id === 'string' && order.id.startsWith('SEPAY-') && typeof order.paymentReference === 'string' ? order : null;
  } catch { return null; }
}
