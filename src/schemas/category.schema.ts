import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải ít nhất 2 ký tự'),
  icon: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
