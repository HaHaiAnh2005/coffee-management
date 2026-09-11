import { VNPay, ProductCode } from 'vnpay';

export const getVNPayInstance = () => {
  const tmnCode = process.env.VNPAY_TMN_CODE || '2QXUI4J4';
  const secureSecret = process.env.VNPAY_HASH_SECRET || 'EBAHADUGCOEWYXCMYZRMTMLSHGKNRPBN';
  const vnpayHost = process.env.VNPAY_URL
    ? process.env.VNPAY_URL.replace('/paymentv2/vpcpay.html', '')
    : 'https://sandbox.vnpayment.vn';

  return new VNPay({
    tmnCode,
    secureSecret,
    vnpayHost,
    testMode: true,
  });
};

export const createVNPayUrl = (req: any, orderId: string, amount: number, orderInfo: string) => {
  const vnpay = getVNPayInstance();
  const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment-result';

  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  return vnpay.buildPaymentUrl({
    vnp_Amount: Math.round(amount),
    vnp_IpAddr: typeof ipAddr === 'string' ? ipAddr.split(',')[0].trim() : '127.0.0.1',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: returnUrl,
    vnp_Locale: 'vn',
  });
};

export const verifyVNPayCallback = (vnpParams: Record<string, any>) => {
  const vnpay = getVNPayInstance();
  try {
    const verify = vnpay.verifyReturnUrl(vnpParams as any);
    return {
      isValidSignature: verify.isVerified,
      isSuccess: verify.isSuccess,
      orderId: vnpParams['vnp_TxnRef'] || verify.vnp_TxnRef,
      amount: Number(vnpParams['vnp_Amount']) / 100,
      bankCode: vnpParams['vnp_BankCode'],
      transactionNo: vnpParams['vnp_TransactionNo'],
      responseCode: vnpParams['vnp_ResponseCode'],
      message: verify.message,
    };
  } catch (err: any) {
    return {
      isValidSignature: false,
      isSuccess: false,
      orderId: vnpParams['vnp_TxnRef'],
      amount: Number(vnpParams['vnp_Amount']) / 100,
      responseCode: vnpParams['vnp_ResponseCode'],
      message: err.message,
    };
  }
};
