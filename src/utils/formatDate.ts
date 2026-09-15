import dayjs from 'dayjs';

/**
 * Định dạng chuỗi ngày tháng theo format Việt Nam
 */
export const formatDate = (dateString?: string, format = 'DD/MM/YYYY HH:mm'): string => {
  if (!dateString) return dayjs().format(format);
  return dayjs(dateString).format(format);
};
