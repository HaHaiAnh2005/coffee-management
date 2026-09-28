import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole, type AuthRequest } from '../backend/middleware/auth.middleware';

function response() {
  return { code: 200, status(code: number) { this.code = code; return this; }, json() {} };
}

test('authentication rejects missing, invalid and expired credentials', () => {
  const secret = process.env.JWT_SECRET || 'coffee_management_super_secret_jwt_key_2026';
  for (const [authorization, expected] of [[undefined, 401], ['Bearer invalid', 403], [`Bearer ${jwt.sign({ id: 'test' }, secret, { expiresIn: -1 })}`, 403]] as const) {
    const res = response();
    let called = false;
    authenticateToken({ headers: { authorization } } as AuthRequest, res as never, () => { called = true; });
    assert.equal(res.code, expected);
    assert.equal(called, false);
  }
});

test('authentication accepts a signed token and attaches the authenticated identity', () => {
  const secret = process.env.JWT_SECRET || 'coffee_management_super_secret_jwt_key_2026';
  const req = { headers: { authorization: `Bearer ${jwt.sign({ id: 'test', role: 'ADMIN' }, secret, { expiresIn: 60 })}` } } as AuthRequest;
  let called = false;
  authenticateToken(req, response() as never, () => { called = true; });
  assert.equal(called, true);
  assert.equal(req.user?.id, 'test');
});

test('role guard rejects anonymous and unauthorized roles but permits admin', () => {
  for (const [role, expected] of [[undefined, 401], ['CASHIER', 403], ['ADMIN', 200]] as const) {
    const res = response();
    let called = false;
    requireRole('ADMIN')({ user: role ? { role } : undefined } as AuthRequest, res as never, () => { called = true; });
    assert.equal(res.code, expected);
    assert.equal(called, role === 'ADMIN');
  }
});
