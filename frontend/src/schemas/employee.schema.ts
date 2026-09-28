import { z } from 'zod';
import { personNameError, phoneError } from '../../../shared/validation';

export const employeeSchema = z.object({
  name: z.string().refine(value => !personNameError(value), 'Họ tên chỉ gồm chữ cái và khoảng trắng, từ 2 đến 100 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().refine(value => !phoneError(value), 'Số điện thoại phải gồm 10–11 chữ số và bắt đầu bằng 0'),
  role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'BARISTA', 'CUSTOMER']),
  pin: z.string().regex(/^\d{4}$/, 'PIN gồm đúng 4 chữ số').or(z.literal('')).optional(),
  shift: z.enum(['Sáng', 'Chiều', 'Tối', 'Full-time']),
  salary: z.number().min(0, 'Lương không được âm').max(Number.MAX_SAFE_INTEGER),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
