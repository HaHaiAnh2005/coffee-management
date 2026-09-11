import { generateVietQRUrl } from '../utils/helpers';

export const paymentService = {
  getVietQRImage: (bankName: string, accountNo: string, accountName: string, amount: number, addInfo: string) => {
    return generateVietQRUrl(bankName, accountNo, accountName, amount, addInfo);
  },
};
