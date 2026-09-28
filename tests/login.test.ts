import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import User from '../backend/models/user.model';
import authService from '../backend/services/auth.service';

test('login rejects missing, wrong, demo, PIN and hash-as-password credentials', async (t) => {
  const password = await bcrypt.hash('Actual-password-928!', 4);
  t.mock.method(User, 'findOne', async () => new User({ id: 'TEST', name: 'Test', email: 'test@example.com', role: 'ADMIN', password, pin: '9999' }));
  for (const supplied of [undefined, '', 'wrong', '123', '123456', '9999', password]) {
    await assert.rejects(authService.login('TEST', supplied), /mật khẩu/);
  }
  const result = await authService.login('TEST', 'Actual-password-928!');
  assert.ok(result.token);
  assert.equal(result.user.password, undefined);
});

test('accounts without a password cannot obtain tokens', async (t) => {
  t.mock.method(User, 'findOne', async () => new User({ id: 'TEST', role: 'ADMIN' }));
  await assert.rejects(authService.login('TEST', '123456'), /mật khẩu/);
});
