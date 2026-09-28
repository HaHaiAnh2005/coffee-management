import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import User from '../backend/models/user.model';
import { ensureSampleCustomerAccount } from '../backend/seed/customer-accounts';

const customer = { id: 'CUS-TEST', name: 'Sample', email: 'sample@example.com', phone: '0900000011' };
test('sample account gets email login, hashed default password and customer link', async (t) => {
  t.mock.method(User, 'exists', async () => null);
  let writes = 0;
  t.mock.method(User, 'updateOne', async (_filter: unknown, update: { $setOnInsert: Record<string, string> }) => {
    assert.equal(update.$setOnInsert.email, customer.email);
    assert.equal(update.$setOnInsert.customerId, customer.id);
    assert.equal(update.$setOnInsert.role, 'CUSTOMER');
    assert.equal(await bcrypt.compare('123456', update.$setOnInsert.password), true);
    writes++;
  });
  await ensureSampleCustomerAccount(customer);
  assert.equal(writes, 1);
});
test('sample seeding preserves existing accounts and passwords', async (t) => {
  t.mock.method(User, 'exists', async () => ({ _id: 'existing' }));
  const update = t.mock.method(User, 'updateOne', async () => { throw new Error('Must not overwrite'); });
  await ensureSampleCustomerAccount(customer);
  assert.equal(update.mock.callCount(), 0);
});
