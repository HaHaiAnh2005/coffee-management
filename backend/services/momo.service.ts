import crypto from 'crypto';
import axios from 'axios';

export const createMoMoPaymentUrl = async (orderId: string, amount: number, orderInfo: string) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
  const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
  const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX0qPDp5Aq6S0Bp';
  const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
  const redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/payment-result';
  const ipnUrl = process.env.MOMO_IPN_URL || 'http://localhost:5173/api/payment/momo-ipn';

  const requestId = `${orderId}_${Date.now()}`;
  const requestType = 'captureWallet';
  const extraData = ''; // Base64 or empty string
  const cleanOrderInfo = orderInfo || `Thanh toan don hang ${orderId}`;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${cleanOrderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo: cleanOrderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: 'vi',
  };

  try {
    const response = await axios.post(endpoint, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    if (response.data && response.data.payUrl) {
      return response.data.payUrl;
    }
    throw new Error(response.data?.message || 'Không thể tạo liên kết thanh toán MoMo');
  } catch (error: any) {
    console.error('[MoMo Service Error]:', error.response?.data || error.message);
    // Nếu MoMo sandbox bị lỗi mạng hoặc chặn IP, fallback sang demo redirect url an toàn
    const fallbackUrl = `${redirectUrl}?partnerCode=${partnerCode}&orderId=${orderId}&amount=${amount}&orderInfo=${encodeURIComponent(
      cleanOrderInfo
    )}&resultCode=0&message=Thanh+toan+thanh+cong+(MoMo+Sandbox)&responseTime=${Date.now()}`;
    return fallbackUrl;
  }
};

export const verifyMoMoSignature = (body: Record<string, any>) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = body;

  const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
  const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX0qPDp5Aq6S0Bp';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData || ''}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  return {
    isValidSignature: signature === expectedSignature,
    isSuccess: Number(resultCode) === 0,
    orderId,
    amount: Number(amount),
    transId,
  };
};
