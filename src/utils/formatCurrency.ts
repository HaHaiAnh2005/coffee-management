/**
 * Định dạng số tiền thành định dạng Việt Nam Đồng (VNĐ)
 * VD: 45000 -> 45.000 đ
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
