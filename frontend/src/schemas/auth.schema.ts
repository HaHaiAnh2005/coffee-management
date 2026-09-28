import { z } from 'zod';
import { personNameError, phoneError } from '../../../shared/validation';

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

export const registerSchema = z.object({
  name: z.string().refine(value => !personNameError(value), 'Họ tên chỉ gồm chữ cái và khoảng trắng, từ 2 đến 100 ký tự'),
  phone: z.string().refine(value => !phoneError(value), 'Số điện thoại phải gồm 10–11 chữ số và bắt đầu bằng 0'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
