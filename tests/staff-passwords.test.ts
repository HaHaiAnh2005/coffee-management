import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import User from '../backend/models/user.model';
import { ensureSeededStaffPassword } from '../backend/seed/staff-passwords';

test('seed repairs missing staff password using bcrypt and a conditional update', async (t) => {
  t.mock.method(User, 'exists', async () => ({ _id: 'test' }));
  let writes = 0;
  t.mock.method(User, 'updateOne', async (filter: { id: string; email: string; $or: unknown[] }, update: { $set: { password: string } }) => {
    assert.equal(filter.id, 'EMP01');
    assert.equal(filter.email, 'admin@lauracoffee.vn');
    assert.deepEqual(filter.$or, [{ password: { $exists: false } }, { password: null }, { password: '' }]);
    assert.equal(await bcrypt.compare('123456', update.$set.password), true);
    writes++;
  });
  await ensureSeededStaffPassword('EMP01', 'admin@lauracoffee.vn');
  assert.equal(writes, 1);
});

test('seed preserves existing staff password', async (t) => {
  t.mock.method(User, 'exists', async () => null);
  const update = t.mock.method(User, 'updateOne', async () => { throw new Error('Must not reset password'); });
  await ensureSeededStaffPassword('EMP01', 'admin@lauracoffee.vn');
  assert.equal(update.mock.callCount(), 0);
});
