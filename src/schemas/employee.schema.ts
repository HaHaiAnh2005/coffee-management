import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'Tên nhân viên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'BARISTA', 'CUSTOMER']),
  pin: z.string().optional(),
  shift: z.enum(['Sáng', 'Chiều', 'Tối', 'Full-time']),
  salary: z.number().min(0, 'Lương không được âm'),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
