import assert from 'node:assert/strict';
import test from 'node:test';
import Order from '../backend/models/order.model';
import { applySePayTransfer, paymentReference, sepayPayload, validSePayKey } from '../backend/services/sepay.service';
import { sepayWebhook } from '../backend/controllers/sepay.controller';
import orderService from '../backend/services/order.service';
import Product from '../backend/models/product.model';

const reference = 'BB1234567890ABCDEF';
const transfer = { id: 92704, gateway: 'TPBank', accountNumber: '07755056866', transferType: 'in' as const, transferAmount: 55000, content: `Thanh toan ${reference}`, code: null };

test('SePay requires the exact API key header', () => {
  const key = 'a'.repeat(64);
  assert.equal(validSePayKey(`Apikey ${key}`, key), true);
  for (const auth of [undefined, '', key, `Bearer ${key}`, `Apikey ${'b'.repeat(64)}`]) assert.equal(validSePayKey(auth, key), false);
});

test('SePay rejects malformed amount, id, account and direction', () => {
  assert.equal(sepayPayload.safeParse(transfer).success, true);
  for (const patch of [{ id: -1 }, { id: 1.5 }, { transferAmount: '55000' }, { transferAmount: NaN }, { transferAmount: -1 }, { transferAmount: 0 }, { accountNumber: 1234 }, { transferType: 'credit' }]) {
    assert.equal(sepayPayload.safeParse({ ...transfer, ...patch }).success, false);
  }
});

test('reference must be unambiguous and match original bank content', () => {
  assert.equal(paymentReference(`pay ${reference.toLowerCase()}.`, reference), reference);
  assert.equal(paymentReference('khong co ma', reference), undefined);
  assert.equal(paymentReference(`XX${reference}`), undefined);
  assert.equal(paymentReference(`${reference}0`), undefined);
  assert.equal(paymentReference(`${reference} BB0000000000000000`), undefined);
  assert.equal(paymentReference(reference, 'OTHER'), undefined);
});

test('webhook matches bank/account/amount and applies each payment at most once', async () => {
  const init = Order.init;
  const update = Order.findOneAndUpdate;
  const pending = { paymentReference: reference, paymentMethod: 'vietqr', paymentAccount: transfer.accountNumber, paymentBank: 'TPBank', total: 55000, status: 'pending', sepayTransactionId: undefined as string | undefined };
  let writes = 0;
  Order.init = (async () => Order) as never;
  Order.findOneAndUpdate = (async (filter: Record<string, unknown>, change: { $set: Record<string, unknown> }) => {
    assert.deepEqual(filter.sepayTransactionId, { $exists: false });
    if (pending.sepayTransactionId || Object.entries(filter).some(([key, value]) => key !== 'sepayTransactionId' && pending[key as keyof typeof pending] !== value)) return null;
    Object.assign(pending, change.$set);
    writes++;
    return pending;
  }) as never;
  try {
    for (const patch of [{ transferType: 'out' as const }, { transferAmount: 54000 }, { transferAmount: 56000 }, { accountNumber: '12345' }, { gateway: 'MBBank' }, { content: 'SAI MA' }]) {
      await applySePayTransfer({ ...transfer, ...patch });
      assert.equal(writes, 0);
    }
    await Promise.all([applySePayTransfer(transfer), applySePayTransfer(transfer)]);
    assert.equal(writes, 1);
    assert.equal(pending.status, 'completed');
    assert.equal(pending.sepayTransactionId, '92704');
    Order.findOneAndUpdate = (async () => { throw Object.assign(new Error('duplicate'), { code: 11000 }); }) as never;
    assert.equal(await applySePayTransfer(transfer), 'duplicate');
    assert.ok(Order.schema.indexes().some(([keys, opts]) => keys.sepayTransactionId === 1 && opts.unique && opts.sparse));
  } finally { Order.init = init; Order.findOneAndUpdate = update; }
});

test('endpoint fails closed without configuration/auth and returns retryable DB errors', async () => {
  const names = ['SEPAY_WEBHOOK_API_KEY', 'SEPAY_ACCOUNT_NUMBER', 'SEPAY_BANK', 'SEPAY_ACCOUNT_NAME'];
  const previous = names.map((name) => process.env[name]);
  const init = Order.init;
  let status = 200;
  let response: unknown;
  const res = { status(code: number) { status = code; return this; }, json(body: unknown) { response = body; } };
  try {
    delete process.env.SEPAY_WEBHOOK_API_KEY;
    await sepayWebhook({ get: () => '', body: transfer } as never, res as never);
    assert.equal(status, 503);
    Object.assign(process.env, { SEPAY_WEBHOOK_API_KEY: 'a'.repeat(64), SEPAY_ACCOUNT_NUMBER: transfer.accountNumber, SEPAY_BANK: 'TPBank', SEPAY_ACCOUNT_NAME: 'TEST' });
    await sepayWebhook({ get: () => 'bad', body: transfer } as never, res as never);
    assert.equal(status, 401);
    Order.init = (async () => { throw new Error('DB unavailable'); }) as never;
    await sepayWebhook({ get: () => `Apikey ${'a'.repeat(64)}`, body: transfer } as never, res as never);
    assert.equal(status, 500);
    assert.equal((response as { success: boolean }).success, false);
  } finally {
    Order.init = init;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});

test('checkout derives prices, forces pending, strips forged verification and reuses retried orders', async () => {
  const env = { ...process.env };
  const findOrder = Order.findOne;
  const findProduct = Product.findOne;
  const init = Order.init;
  const create = Order.create;
  let saved: Record<string, unknown> | null = null;
  let writes = 0;
  Object.assign(process.env, { SEPAY_WEBHOOK_API_KEY: 'a'.repeat(64), SEPAY_ACCOUNT_NUMBER: transfer.accountNumber, SEPAY_BANK: 'TPBank', SEPAY_ACCOUNT_NAME: 'TEST' });
  Order.findOne = (async () => saved) as never;
  Product.findOne = (async () => ({ id: 'P1', name: 'Coffee', price: 49000 })) as never;
  Order.init = (async () => Order) as never;
  Order.create = (async (data: Record<string, unknown>) => { writes++; saved = data; return data; }) as never;
  const request = () => ({
    id: 'SEPAY-12345678-1234-1234-1234-123456789012', total: 55000,
    status: 'completed' as const, sepayTransactionId: 'FAKE', paymentReference: 'FAKE',
    items: [{ product: { id: 'P1', name: 'fake', price: 1 }, quantity: 1, size: 'M', selectedOptions: [], itemTotalPrice: 1 }],
  });
  try {
    await assert.rejects(orderService.create({ ...request(), total: 1 }, true), /Giá đơn hàng/);
    const order = await orderService.create(request(), true);
    assert.equal(order.total, 55000);
    assert.equal(order.items[0].product.price, 49000);
    assert.equal(order.items[0].itemTotalPrice, 55000);
    assert.equal(order.status, 'pending');
    assert.equal(order.sepayTransactionId, undefined);
    assert.match(order.paymentReference!, /^BB[A-F0-9]{16}$/);
    await orderService.create(request(), true);
    assert.equal(writes, 1);
    await assert.rejects(orderService.updateStatus(order.id, 'completed'), /chưa có giao dịch/);
  } finally {
    Order.findOne = findOrder; Product.findOne = findProduct; Order.init = init; Order.create = create;
    for (const key of ['SEPAY_WEBHOOK_API_KEY', 'SEPAY_ACCOUNT_NUMBER', 'SEPAY_BANK', 'SEPAY_ACCOUNT_NAME']) {
      if (env[key] === undefined) delete process.env[key]; else process.env[key] = env[key];
    }
  }
});
