import bcrypt from 'bcryptjs';
import User from '../models/user.model';

// Only called for the explicit sample-customer list, never all customer records.
export async function ensureSampleCustomerAccount(customer: { id: string; name: string; email: string; phone: string }) {
  const email = customer.email.trim().toLowerCase();
  if (await User.exists({ $or: [{ id: customer.id }, { customerId: customer.id }, { email }, { phone: customer.phone }] })) return;
  const password = await bcrypt.hash('123456', 10);
  await User.updateOne({ email }, { $setOnInsert: {
    id: customer.id, customerId: customer.id, name: customer.name,
    email, phone: customer.phone, role: 'CUSTOMER', password,
  } }, { upsert: true, runValidators: true });
}
