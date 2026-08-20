import dayjs from 'dayjs';

/**
 * Định dạng số tiền thành định dạng Việt Nam Đồng (VNĐ)
 * Ví dụ: 45000 -> 45.000 đ
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Định dạng ngày tháng giờ theo định dạng Việt Nam
 */
export const formatDate = (dateString?: string, format = 'DD/MM/YYYY HH:mm'): string => {
  if (!dateString) return dayjs().format(format);
  return dayjs(dateString).format(format);
};

/**
 * Tạo mã đơn hàng dạng ngắn gọn (vd: #ORD-0842)
 */
export const generateOrderCode = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomNum}`;
};
