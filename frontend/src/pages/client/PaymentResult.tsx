import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiShoppingBag, FiRotateCcw } from 'react-icons/fi';

export const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    code?: string;
    amount?: number;
    method?: string;
    bankCode?: string;
    transactionNo?: string;
  }>({});

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setIsLoading(true);

        // Kiểm tra nếu là VNPay
        if (searchParams.has('vnp_ResponseCode')) {
          const vnpResponseCode = searchParams.get('vnp_ResponseCode');
          const vnpTxnRef = searchParams.get('vnp_TxnRef');
          const vnpAmount = searchParams.get('vnp_Amount');
          const vnpBankCode = searchParams.get('vnp_BankCode');
          const vnpTransactionNo = searchParams.get('vnp_TransactionNo');

          // Gọi backend để verify chữ ký và cập nhật DB
          const res = await axios.get(`/api/payment/verify-status?${searchParams.toString()}&method=vnpay`);

          if (vnpResponseCode === '00' && res.data.isSuccess) {
            setIsSuccess(true);
            setMessage('Giao dịch thanh toán VNPAY thành công!');
            clearCart();
          } else {
            setIsSuccess(false);
            setMessage(
              vnpResponseCode === '24'
                ? 'Khách hàng đã hủy giao dịch trên cổng VNPAY.'
                : 'Thanh toán VNPAY không thành công hoặc lỗi xác thực.'
            );
          }

          setPaymentDetails({
            orderId: vnpTxnRef || '',
            code: res.data.order?.code || vnpTxnRef || '',
            amount: vnpAmount ? Number(vnpAmount) / 100 : res.data.order?.total || 0,
            method: 'VNPAY',
            bankCode: vnpBankCode || '',
            transactionNo: vnpTransactionNo || '',
          });
          return;
        }

        // Kiểm tra nếu là MoMo
        if (searchParams.has('resultCode') || searchParams.has('partnerCode')) {
          const momoResultCode = searchParams.get('resultCode');
          const momoOrderId = searchParams.get('orderId');
          const momoAmount = searchParams.get('amount');
          const momoMessage = searchParams.get('message');

          const res = await axios.get(`/api/payment/verify-status?${searchParams.toString()}&method=momo`);

          if (Number(momoResultCode) === 0 && res.data.isSuccess) {
            setIsSuccess(true);
            setMessage('Giao dịch thanh toán MoMo thành công!');
            clearCart();
          } else {
            setIsSuccess(false);
            setMessage(momoMessage || 'Thanh toán MoMo không thành công hoặc đã bị hủy.');
          }

          setPaymentDetails({
            orderId: momoOrderId || '',
            code: res.data.order?.code || momoOrderId || '',
            amount: momoAmount ? Number(momoAmount) : res.data.order?.total || 0,
            method: 'MoMo',
          });
          return;
        }

        // Trường hợp không có params hợp lệ
        setIsSuccess(false);
        setMessage('Không tìm thấy thông tin phản hồi từ cổng thanh toán.');
      } catch (err: any) {
        console.error('Lỗi xác thực thanh toán:', err);
        setIsSuccess(false);
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực giao dịch.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-stone-700 font-semibold text-sm">Đang xác thực kết quả giao dịch từ cổng thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-12 px-4">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
        {isSuccess ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <FiCheckCircle className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wider">
                Thanh Toán Thành Công
              </span>
              <h1 className="text-2xl font-black text-stone-900 mt-2">Cảm Ơn Quý Khách!</h1>
              <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">{message}</p>
            </div>

            {/* Bảng chi tiết hóa đơn thanh toán */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span>Cổng thanh toán:</span>
                <span className="font-bold text-stone-900 uppercase">{paymentDetails.method}</span>
              </div>
              {paymentDetails.code && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Mã đơn hàng:</span>
                  <span className="font-bold text-amber-800">{paymentDetails.code}</span>
                </div>
              )}
              {paymentDetails.amount !== undefined && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Số tiền đã thanh toán:</span>
                  <span className="font-extrabold text-stone-900 text-sm">{formatCurrency(paymentDetails.amount)}</span>
                </div>
              )}
              {paymentDetails.bankCode && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Ngân hàng / Kênh:</span>
                  <span className="font-semibold text-stone-700">{paymentDetails.bankCode}</span>
                </div>
              )}
              {paymentDetails.transactionNo && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Mã giao dịch cổng:</span>
                  <span className="font-mono text-stone-700">{paymentDetails.transactionNo}</span>
                </div>
              )}
              <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-stone-500 text-[11px]">
                <span>Trạng thái đơn:</span>
                <span className="font-bold text-emerald-700">Đã thanh toán (Chờ chế biến)</span>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/order-history')}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Xem Lịch Sử Đơn Hàng <FiArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/menu"
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-4 h-4" /> Tiếp Tục Mua Hàng
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <FiXCircle className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-full uppercase tracking-wider">
                Thanh Toán Thất Bại
              </span>
              <h1 className="text-2xl font-black text-stone-900 mt-2">Giao Dịch Chưa Hoàn Tất</h1>
              <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">{message}</p>
            </div>

            {paymentDetails.code && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-left">
                <span className="text-stone-500">Mã tham chiếu đơn: </span>
                <span className="font-bold text-stone-800">{paymentDetails.code}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiRotateCcw className="w-4 h-4" /> Thử Thanh Toán Lại
              </button>
              <Link
                to="/"
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center justify-center"
              >
                Về Trang Chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
