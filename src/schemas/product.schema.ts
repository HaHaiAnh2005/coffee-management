import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Tên món phải từ 2 ký tự'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  price: z.number().min(0, 'Giá không được âm'),
  image: z.string().url('Link hình ảnh không hợp lệ').or(z.string().min(1)),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
