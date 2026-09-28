import assert from 'node:assert/strict';
import test from 'node:test';
import { numericError } from '../frontend/src/utils/numericValidation';
import { employeeSchema } from '../frontend/src/schemas/employee.schema';
import { numericPayloadError, validateNumericBody } from '../backend/middleware/numeric.middleware';
import Product from '../backend/models/product.model';
import Inventory from '../backend/models/inventory.model';
import Customer from '../backend/models/customer.model';
import Shift from '../backend/models/shift.model';
import { openShift } from '../backend/controllers/shift.controller';
import couponService from '../backend/services/coupon.service';
import Coupon from '../backend/models/coupon.model';

test('numeric inputs reject letters, pasted junk, blank, infinity and negatives', () => {
  for (const raw of ['', ' ', 'abc', '12abc', '1e3', '1,000', 'NaN', 'Infinity', '-1', '9'.repeat(400)]) {
    assert.notEqual(numericError(raw), '', raw);
  }
  for (const raw of ['0', '1000', '0.25', '12.']) assert.equal(numericError(raw), '', raw);
  assert.notEqual(numericError('101', 0, 100), '');
  assert.equal(numericError('100', 0, 100), '');
  assert.notEqual(numericError('1.5', 0, Infinity, true), '');
  assert.notEqual(numericError('0', 0.1), '');
});

test('salary schema rejects negative, non-numeric and non-finite salaries', () => {
  for (const value of [-1, '100', '', null, NaN, Infinity]) {
    assert.equal(employeeSchema.shape.salary.safeParse(value).success, false);
  }
  assert.equal(employeeSchema.shape.salary.safeParse(0).success, true);
  assert.equal(employeeSchema.shape.salary.safeParse(8000000).success, true);
});

test('API validates nested numbers and rejects coercion and update operators', () => {
  for (const price of ['123', 'abc', '', null, true, -1, Infinity, NaN]) {
    assert.ok(numericPayloadError({ items: [{ product: { price } }] }));
  }
  assert.ok(numericPayloadError({ points: 1.5 }));
  assert.ok(numericPayloadError({ $inc: { points: -1 } }));
  assert.ok(numericPayloadError({ 'items.0.price': -1 }));
  assert.equal(numericPayloadError({ quantity: 0.25, price: 0, points: 1, variance: -100 }), undefined);
});

test('invalid API request receives 400 before reaching mutation handler', () => {
  let status = 0;
  let nextCalled = false;
  const res = { status(code: number) { status = code; return this; }, json(body: { success: boolean }) { assert.equal(body.success, false); } };
  validateNumericBody({ body: { initialCash: 'abc' } } as never, res as never, (() => { nextCalled = true; }) as never);
  assert.equal(status, 400);
  assert.equal(nextCalled, false);
});

test('coupon percentage limit applies on creation, default type and type-only updates', async () => {
  await assert.rejects(couponService.create({ discountType: 'percent', discountValue: 101 }), /100/);
  await assert.rejects(couponService.create({ discountValue: 101 }), /100/);
  const originalFind = Coupon.findOne;
  Coupon.findOne = (async () => new Coupon({ discountType: 'fixed', discountValue: 200 })) as never;
  try {
    await assert.rejects(couponService.update('coupon', { discountType: 'percent' }), /100/);
  } finally {
    Coupon.findOne = originalFind;
  }
});

test('database models reject negative/non-finite numbers but allow stock fractions and negative variance', () => {
  for (const price of [-1, Infinity, NaN]) assert.ok(new Product({ price }).validateSync()?.errors.price);
  for (const field of ['quantity', 'unitPrice', 'minAlertThreshold']) {
    assert.ok(new Inventory({ [field]: -1 }).validateSync()?.errors[field]);
  }
  assert.ok(new Customer({ points: 1.5 }).validateSync()?.errors.points);
  assert.equal(new Inventory({ quantity: 0.25 }).validateSync()?.errors.quantity, undefined);
  assert.equal(new Shift({ variance: -100 }).validateSync()?.errors.variance, undefined);
});

test('opening a shift rejects invalid cash before closing old shifts and preserves zero cash', async () => {
  const originalUpdate = Shift.updateMany;
  const originalCreate = Shift.create;
  let updates = 0;
  let saved: Record<string, unknown> | undefined;
  Shift.updateMany = (async () => { updates++; }) as never;
  Shift.create = (async (data: Record<string, unknown>) => { saved = data; return data; }) as never;
  let status = 200;
  const res = { status(code: number) { status = code; return this; }, json() {} };
  try {
    await openShift({ body: { initialCash: -1 } } as never, res as never);
    assert.equal(status, 400);
    assert.equal(updates, 0);
    await openShift({ body: { initialCash: 0 } } as never, res as never);
    assert.equal(updates, 1);
    assert.equal(saved?.initialCash, 0);
    assert.equal(saved?.expectedCash, 0);
  } finally {
    Shift.updateMany = originalUpdate;
    Shift.create = originalCreate;
  }
});
