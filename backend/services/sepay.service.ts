import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import Order from '../models/order.model';

export function sepayConfig() {
  const key = process.env.SEPAY_WEBHOOK_API_KEY?.trim();
  const account = process.env.SEPAY_ACCOUNT_NUMBER?.trim();
  const bank = process.env.SEPAY_BANK?.trim();
  const accountName = process.env.SEPAY_ACCOUNT_NAME?.trim();
  if (!key || key.length < 32 || !account || !/^\d+$/.test(account) || !bank || !accountName) {
    throw new Error('Chưa cấu hình đầy đủ SePay trên server');
  }
  return { key, account, bank, accountName };
}

export function validSePayKey(header: string | undefined, key: string): boolean {
  const actual = Buffer.from(header ?? '');
  const expected = Buffer.from(`Apikey ${key}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const sepayPayload = z.object({
  id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  gateway: z.string().min(1),
  accountNumber: z.string().regex(/^\d+$/),
  transferType: z.enum(['in', 'out']),
  transferAmount: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  content: z.string().max(10000),
  code: z.string().nullish(),
});

export function paymentReference(content: string, code?: string | null): string | undefined {
  const matches = [...content.toUpperCase().matchAll(/(?:^|[^A-Z0-9])(BB[A-F0-9]{16})(?![A-Z0-9])/g)].map((match) => match[1]);
  const unique = [...new Set(matches)];
  // The reference must appear in the original bank content, not only a parsed field.
  if (unique.length !== 1 || (code && code.toUpperCase() !== unique[0])) return;
  return unique[0];
}

export async function applySePayTransfer(payload: z.infer<typeof sepayPayload>) {
  if (payload.transferType !== 'in') return 'ignored_outgoing';
  const reference = paymentReference(payload.content, payload.code);
  if (!reference) return 'ignored_reference';
  // Ensure the sparse unique indexes exist before accepting payments.
  await Order.init();
  try {
    const order = await Order.findOneAndUpdate({
      paymentReference: reference,
      paymentMethod: 'vietqr',
      paymentAccount: payload.accountNumber,
      paymentBank: payload.gateway,
      total: payload.transferAmount,
      status: 'pending',
      sepayTransactionId: { $exists: false },
    }, {
      $set: {
        status: 'completed',
        completedAt: new Date().toISOString(),
        sepayTransactionId: String(payload.id),
      },
    }, { new: true, runValidators: true });
    return order ? 'paid' : 'ignored_unmatched_or_already_paid';
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return 'duplicate';
    throw error;
  }
}
