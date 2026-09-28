import bcrypt from 'bcryptjs';
import User from '../models/user.model';

// Repair only seeded accounts without credentials; never reset an existing password.
export async function ensureSeededStaffPassword(id: string, email: string) {
  const filter = { id, email, $or: [{ password: { $exists: false } }, { password: null }, { password: '' }] };
  if (!await User.exists(filter)) return;
  const password = await bcrypt.hash('123456', 10);
  await User.updateOne(filter, { $set: { password } });
}
