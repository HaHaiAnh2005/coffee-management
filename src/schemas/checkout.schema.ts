import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập tên người nhận'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(5, 'Địa chỉ giao hàng chi tiết'),
  note: z.string().optional(),
  paymentMethod: z.enum(['cash', 'vietqr', 'card']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
