import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import { createApp } from '../backend/app';
import userService from '../backend/services/user.service';
import inventoryService from '../backend/services/inventory.service';
import orderService from '../backend/services/order.service';
import jwt from 'jsonwebtoken';

let server: Server;
let base: string;

test('HTTP rejects invalid identity, money and purchase limits before mutations', async () => {
  const cases = [
    ['/auth/register', { name: 'An123', phone: '0912345678', email: 'test@example.com', password: '123456' }],
    ['/payment/create-url', { amount: -1 }],
    ['/payment/sepay-orders', { items: [{ product: { id: 'P1' }, quantity: 21 }] }],
    ['/orders', { items: [{ product: { id: 'P1' }, quantity: 20 }, { product: { id: 'P2' }, quantity: 20 }, { product: { id: 'P3' }, quantity: 11 }] }],
    ['/settings', { bankAccountNo: 'abc' }],
  ] as const;
  for (const [path, body] of cases) {
    const response = await fetch(base + '/api' + path, { method: path === '/settings' ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal(response.status, 400, path);
    assert.equal((await response.json()).success, false);
  }
});

test('activation issuance requires staff authorization and explicit identity confirmation', async () => {
  for (const role of [undefined, 'CUSTOMER', 'ADMIN']) {
    const token = role ? jwt.sign({ id: 'test', role }, process.env.JWT_SECRET || 'coffee_management_super_secret_jwt_key_2026') : null;
    const response = await fetch(base + '/api/auth/customer-activation/TEST', {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: '{}',
    });
    assert.equal(response.status, role === 'ADMIN' ? 400 : role ? 403 : 401);
  }
});
before(async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const app = await createApp();
    server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    base = `http://127.0.0.1:${address.port}`;
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous;
  }
});
after(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test('HTTP health and both API prefixes respond successfully', async () => {
  for (const path of ['/api/health', '/api', '/api/v1']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.ok(body.success === true || body.status === 'ok');
  }
});

test('unknown API returns JSON 404', async () => {
  const response = await fetch(base + '/api/does-not-exist');
  assert.equal(response.status, 404);
  assert.equal((await response.json()).success, false);
});

test('invalid numeric payload is rejected through the real HTTP router', async () => {
  const response = await fetch(base + '/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: -1 }) });
  assert.equal(response.status, 400);
});

for (const [path, service] of [['users', userService], ['inventory', inventoryService], ['orders', orderService]] as const) {
  test(`anonymous callers cannot delete ${path} through HTTP`, async (t) => {
    let calls = 0;
    // Replace persistence only: requests still traverse the production middleware and router.
    t.mock.method(service, 'delete', async () => { calls++; return { id: 'TEST' }; });
    const response = await fetch(`${base}/api/${path}/TEST`, { method: 'DELETE' });
    assert.ok([401, 403].includes(response.status), `Expected 401/403, received ${response.status}; mutation calls=${calls}`);
    assert.equal(calls, 0);
  });
}

for (const [path, service] of [['users', userService], ['inventory', inventoryService], ['orders', orderService]] as const) {
  for (const role of ['CUSTOMER', 'CASHIER', 'ADMIN', 'MANAGER', 'admin']) {
    test(`HTTP delete ${path}: role ${role}`, async (t) => {
      let calls = 0;
      t.mock.method(service, 'delete', async () => { calls++; return { id: 'TEST' }; });
      const token = jwt.sign({ id: 'test', role }, process.env.JWT_SECRET || 'coffee_management_super_secret_jwt_key_2026', { expiresIn: 60 });
      const response = await fetch(`${base}/api/${path}/TEST`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const allowed = ['ADMIN', 'MANAGER', 'admin'].includes(role);
      assert.equal(response.status, allowed ? 200 : 403);
      assert.equal(calls, allowed ? 1 : 0);
    });
  }
}
