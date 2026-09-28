import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import Customer from '../backend/models/customer.model';
import User from '../backend/models/user.model';
import Activation from '../backend/models/customer-activation.model';
import { issueCustomerActivation, activateCustomer } from '../backend/services/customer-activation.service';
import authService from '../backend/services/auth.service';

const customer = { id: 'CUS-TEST', name: 'Existing Customer', phone: '0900000077', email: 'existing@example.com', points: 680, tier: 'Kim Cương', totalSpent: 6800000 };
const password = 'Customer123!';

test('activation links existing customer, preserves loyalty and consumes code once', async (t) => {
  let stored: Record<string, unknown> | null = null;
  let saved: Record<string, unknown> | null = null;
  t.mock.method(Customer, 'findOne', async () => ({ ...customer }));
  t.mock.method(User, 'findOne', async () => null);
  t.mock.method(User, 'exists', async () => saved);
  t.mock.method(User, 'init', async () => User);
  t.mock.method(Activation, 'init', async () => Activation);
  t.mock.method(Customer.prototype, 'save', async () => { assert.fail('Existing customer must not be modified'); });
  t.mock.method(Activation, 'findOneAndUpdate', async (_filter: unknown, change: { $set: Record<string, unknown> }) => { stored = change.$set; });
  t.mock.method(Activation, 'findOneAndDelete', async (filter: Record<string, unknown>) => {
    if (!stored || stored.tokenHash !== filter.tokenHash) return null;
    assert.equal(filter.customerId, customer.id);
    assert.equal(filter.email, customer.email);
    assert.equal(filter.phone, customer.phone);
    assert.ok((filter.expiresAt as { $gt: Date }).$gt instanceof Date);
    const result = stored; stored = null; return result;
  });
  t.mock.method(User, 'create', async (data: Record<string, unknown>) => { saved = data; return new User(data); });
  const issued = await issueCustomerActivation(customer.id);
  assert.match(issued.token, /^[a-f0-9]{48}$/);
  assert.ok(issued.expiresAt.getTime() > Date.now());
  await assert.rejects(activateCustomer(customer.id, customer.email, customer.phone, password, '0'.repeat(48)), /Mã kích hoạt/);
  const result = await authService.register({ ...customer, password, activationCode: issued.token, role: 'ADMIN' });
  assert.equal(result.id, customer.id);
  assert.equal(result.customerId, customer.id);
  assert.equal(result.role, 'CUSTOMER');
  assert.equal(result.password, undefined);
  assert.ok(saved);
  assert.equal(await bcrypt.compare(password, (saved as Record<string, unknown>).password as string), true);
  await assert.rejects(activateCustomer(customer.id, customer.email, customer.phone, password, issued.token), /đã có tài khoản/);
  assert.equal(customer.points, 680);
});

test('existing profile cannot be claimed without a code or with mismatched identity', async (t) => {
  t.mock.method(Customer, 'findOne', async () => customer);
  await assert.rejects(activateCustomer(customer.id, customer.email, customer.phone, password), /nhận mã kích hoạt/);
  await assert.rejects(activateCustomer(customer.id, 'other@example.com', customer.phone, password, 'a'.repeat(48)), /không khớp/);
});

test('expired or consumed code cannot create an account', async (t) => {
  t.mock.method(Customer, 'findOne', async () => customer);
  t.mock.method(User, 'exists', async () => null);
  t.mock.method(User, 'init', async () => User);
  t.mock.method(Activation, 'findOneAndDelete', async (filter: { expiresAt: { $gt: Date } }) => {
    assert.ok(filter.expiresAt.$gt.getTime() <= Date.now());
    return null;
  });
  const create = t.mock.method(User, 'create', async () => { throw new Error('Must not create'); });
  await assert.rejects(activateCustomer(customer.id, customer.email, customer.phone, password, 'a'.repeat(48)), /hết hạn/);
  assert.equal(create.mock.callCount(), 0);
});

test('issuing a code never resets an existing account', async (t) => {
  t.mock.method(Customer, 'findOne', async () => customer);
  t.mock.method(User, 'exists', async () => ({ _id: 'existing' }));
  await assert.rejects(issueCustomerActivation(customer.id), /đã có tài khoản/);
});
