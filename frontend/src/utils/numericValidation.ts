export function numericError(raw: string, min = 0, max = Infinity, integer = false): string {
  if (!raw.trim()) return 'Vui lòng nhập số';
  if (!/^-?\d+(\.\d*)?$/.test(raw) || !Number.isFinite(Number(raw))) {
    return 'Chỉ được nhập số, không nhập chữ hoặc ký tự đặc biệt';
  }
  const value = Number(raw);
  if (Math.abs(value) > Number.MAX_SAFE_INTEGER) return 'Số quá lớn, vui lòng nhập giá trị nhỏ hơn';
  if (value < min) return min === 0 ? 'Giá trị không được âm' : `Giá trị phải từ ${min} trở lên`;
  if (value > max) return `Giá trị không được vượt quá ${max}`;
  if (integer && !Number.isSafeInteger(value)) return 'Vui lòng nhập số nguyên hợp lệ';
  return '';
}

/** Also used by payment buttons that do not belong to a form. */
export function validateNumericInputs(): boolean {
  for (const input of document.querySelectorAll<HTMLInputElement>('input[data-numeric]')) {
    if (!input.reportValidity()) return false;
  }
  return true;
}
