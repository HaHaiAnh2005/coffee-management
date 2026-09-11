export const clsx = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const generateVietQRUrl = (
  bankName: string = 'TPBank',
  accountNo: string = '07755056866',
  accountName: string = 'HA HAI ANH',
  amount: number = 0,
  addInfo: string = 'Thanh toan hoa don'
): string => {
  const cleanBank = encodeURIComponent(bankName.trim());
  const cleanAccount = encodeURIComponent(accountNo.trim());
  const cleanName = encodeURIComponent(accountName.trim());
  const cleanInfo = encodeURIComponent(addInfo.trim());

  return `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-compact2.png?amount=${amount}&addInfo=${cleanInfo}&accountName=${cleanName}`;
};
