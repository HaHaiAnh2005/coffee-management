import { z } from 'zod';
import { personNameError } from '../../../shared/validation';

export const checkoutSchema = z.object({
  customerName: z.string().refine(value => !personNameError(value), 'Họ tên chỉ gồm chữ cái và khoảng trắng, từ 2 đến 100 ký tự'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được phép điền số, không được chứa chữ cái')
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại tối đa 11 số'),
  address: z.string().min(5, 'Địa chỉ giao hàng chi tiết'),
  note: z.string().optional(),
  paymentMethod: z.enum(['cash', 'vietqr', 'card']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
