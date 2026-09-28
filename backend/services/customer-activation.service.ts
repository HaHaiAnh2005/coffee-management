import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import Customer from '../models/customer.model';
import User from '../models/user.model';
import CustomerActivation from '../models/customer-activation.model';

const digest = (token: string) => createHash('sha256').update(token).digest('hex');

export async function issueCustomerActivation(customerId: string) {
  const customer = await Customer.findOne({ id: customerId });
  if (!customer?.phone || !customer.email) throw new Error('Hồ sơ phải có số điện thoại và email trước khi kích hoạt.');
  const email = customer.email.trim().toLowerCase();
  if (await User.exists({ $or: [{ customerId }, { id: customerId }, { email }, { phone: customer.phone }] })) {
    throw new Error('Khách hàng đã có tài khoản hoặc thông tin đang được tài khoản khác sử dụng.');
  }
  const token = randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await CustomerActivation.init();
  await CustomerActivation.findOneAndUpdate({ customerId }, {
    $set: { tokenHash: digest(token), phone: customer.phone, email, expiresAt },
  }, { upsert: true, runValidators: true });
  return { token, expiresAt, email, phone: customer.phone };
}

export async function activateCustomer(customerId: string, email: string, phone: string, password: string, token?: string) {
  if (!token || !/^[a-f0-9]{48}$/.test(token)) throw new Error('Khách hàng đã có hồ sơ. Vui lòng liên hệ quán để nhận mã kích hoạt.');
  const customer = await Customer.findOne({ id: customerId, phone });
  if (!customer || customer.email?.trim().toLowerCase() !== email) throw new Error('Thông tin đăng ký không khớp hồ sơ khách hàng.');
  if (await User.exists({ $or: [{ customerId }, { id: customerId }, { email }, { phone }] })) {
    throw new Error('Khách hàng đã có tài khoản. Vui lòng đăng nhập.');
  }
  // Deletion atomically consumes the code. A failed save requires a new code from staff.
  const passwordHash = await bcrypt.hash(password, 10);
  await User.init();
  const activation = await CustomerActivation.findOneAndDelete({
    customerId, email, phone, tokenHash: digest(token), expiresAt: { $gt: new Date() },
  });
  if (!activation) throw new Error('Mã kích hoạt sai, đã hết hạn hoặc đã được sử dụng.');
  const user = await User.create({
    id: customer.id, customerId: customer.id, name: customer.name,
    email, phone, role: 'CUSTOMER', password: passwordHash,
  });
  const result = user.toObject();
  delete result.password;
  return result;
}
