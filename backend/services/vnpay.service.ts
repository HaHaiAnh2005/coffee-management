import crypto from 'crypto';
import qs from 'qs';
import dayjs from 'dayjs';

function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {};
  const str = Object.keys(obj).map(encodeURIComponent).sort();
  for (const key of str) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  }
  return sorted;
}

export const createVNPayUrl = (req: any, orderId: string, amount: number, orderInfo: string) => {
  const date = new Date();
  const createDate = dayjs(date).format('YYYYMMDDHHmmss');
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    '127.0.0.1';

  const tmnCode = process.env.VNPAY_TMN_CODE || '2QXUI4J4';
  const secretKey = process.env.VNPAY_HASH_SECRET || 'RAOCTAVXAWJWCAGCGDIISKJGCGNIJVOZ';
  const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment-result';

  let vnp_Params: Record<string, any> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: Math.round(amount * 100), // VNPay quy định nhân 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: typeof ipAddr === 'string' ? ipAddr.split(',')[0].trim() : '127.0.0.1',
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  return vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
};

export const verifyVNPayCallback = (vnpParams: Record<string, any>) => {
  const secureHash = vnpParams['vnp_SecureHash'];
  const paramsToVerify = { ...vnpParams };
  delete paramsToVerify['vnp_SecureHash'];
  delete paramsToVerify['vnp_SecureHashType'];

  const sortedParams = sortObject(paramsToVerify);
  const secretKey = process.env.VNPAY_HASH_SECRET || 'RAOCTAVXAWJWCAGCGDIISKJGCGNIJVOZ';
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const isValidSignature = secureHash === signed;
  const isSuccess = vnpParams['vnp_ResponseCode'] === '00';

  return {
    isValidSignature,
    isSuccess,
    orderId: vnpParams['vnp_TxnRef'],
    amount: Number(vnpParams['vnp_Amount']) / 100,
    bankCode: vnpParams['vnp_BankCode'],
    transactionNo: vnpParams['vnp_TransactionNo'],
    responseCode: vnpParams['vnp_ResponseCode'],
  };
};
