import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import type { Order } from '../types/order';
import { useOrderStore } from '../store/order.store';
import { generateVietQRUrl } from '../utils/helpers';
import { formatCurrency } from '../utils/formatCurrency';
import { SEPAY_PENDING_KEY, SEPAY_REQUEST_KEY } from '../utils/sepay';
import { FiCheckCircle, FiCopy, FiCheck, FiRefreshCw, FiX, FiAlertCircle, FiShield } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';

interface SePayPaymentProps {
  initialOrder: Order;
  onComplete: () => void;
  onCancel?: () => void;
}

export function SePayPayment({ initialOrder, onComplete, onCancel }: SePayPaymentProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [checking, setChecking] = useState(false);
  const [copiedField, setCopiedField] = useState<'account' | 'ref' | 'amount' | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  const [statusState, setStatusState] = useState<'waiting' | 'not_found' | 'success' | 'cancelled' | 'error'>('waiting');
  const [message, setMessage] = useState('Hệ thống đang chờ nhận tiền chuyển khoản từ ngân hàng...');

  const copyToClipboard = (text: string, field: 'account' | 'ref' | 'amount') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const verifyPayment = useCallback(async (manual: boolean = false) => {
    if (checking || order.status === 'cancelled') return;
    setChecking(true);
    try {
      const { data } = await axios.get('/api/payment/verify-status', {
        params: { method: 'vietqr', orderId: initialOrder.id },
        timeout: 10000,
      });

      if (!data.success || data.order?.id !== initialOrder.id) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      setOrder(data.order);

      if (data.isSuccess && data.order.status === 'completed') {
        setStatusState('success');
        setMessage('Xác nhận thanh toán thành công! Đang hoàn tất đơn...');
        useOrderStore.setState((state) => ({
          orders: [data.order, ...state.orders.filter((item) => item.id !== initialOrder.id)],
        }));
        sessionStorage.removeItem(SEPAY_PENDING_KEY);
        sessionStorage.removeItem(SEPAY_REQUEST_KEY);
        setTimeout(() => {
          onComplete();
        }, 1200);
        return;
      }

      if (data.order.status === 'cancelled') {
        setStatusState('cancelled');
        setMessage('Đơn hàng đã bị hủy. Vui lòng liên hệ cửa hàng nếu bạn đã chuyển khoản.');
        return;
      }

      if (manual) {
        setStatusState('not_found');
        setMessage(
          'Chưa ghi nhận biến động số dư từ SePay. Nếu bạn vừa chuyển tiền, hệ thống ngân hàng thường mất từ 5-15 giây để thông báo. Vui lòng đợi thêm giây lát rồi bấm kiểm tra lại nhé!'
        );
      }
    } catch {
      if (manual) {
        setStatusState('error');
        setMessage('Chưa kết nối được máy chủ để kiểm tra. Vui lòng kiểm tra lại mạng hoặc thử lại sau.');
      }
    } finally {
      setChecking(false);
    }
  }, [checking, initialOrder.id, onComplete, order.status]);

  // Polling tự động mỗi 4.5 giây để bắt webhook SePay khi ngân hàng hoàn tất
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (!active || order.status === 'cancelled' || order.status === 'completed') return;
      try {
        const { data } = await axios.get('/api/payment/verify-status', {
          params: { method: 'vietqr', orderId: initialOrder.id },
          timeout: 8000,
        });
        if (!active) return;
        if (data.success && data.isSuccess && data.order?.status === 'completed') {
          setStatusState('success');
          setMessage('Thanh toán thành công! Đang chuyển hướng...');
          useOrderStore.setState((state) => ({
            orders: [data.order, ...state.orders.filter((item) => item.id !== initialOrder.id)],
          }));
          sessionStorage.removeItem(SEPAY_PENDING_KEY);
          sessionStorage.removeItem(SEPAY_REQUEST_KEY);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return;
        }
      } catch {
        // Silent catch for background polling
      }
      if (active) {
        timer = setTimeout(poll, 4500);
      }
    };

    timer = setTimeout(poll, 4500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [initialOrder.id, onComplete, order.status]);

  const qrUrl = generateVietQRUrl(
    order.paymentBank || 'TPBank',
    order.paymentAccount || '',
    order.paymentAccountName || '',
    order.total,
    order.paymentReference || ''
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 px-6 py-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <BsQrCode className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Thanh Toán Chuyển Khoản VietQR
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/90">
                Xác thực giao dịch tự động 24/7 qua SePay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-amber-100 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Đang chờ thanh toán
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                title="Đóng / Hủy"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Main 2-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">

            {/* Left: VietQR Image Focus */}
            <div className="bg-gradient-to-b from-amber-50/60 to-stone-50 rounded-2xl p-4 border border-amber-200/80 flex flex-col items-center text-center shadow-xs">
              <div className="relative group bg-white p-3 rounded-2xl border border-amber-200 shadow-md">
                {order.status !== 'cancelled' ? (
                  <img
                    src={qrUrl}
                    alt="Mã VietQR thanh toán"
                    className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain rounded-xl bg-white"
                  />
                ) : (
                  <div className="w-64 h-64 flex flex-col items-center justify-center text-stone-400 gap-2">
                    <FiAlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-xs font-bold text-stone-600">Đơn hàng đã bị hủy</p>
                  </div>
                )}
              </div>

              <p className="text-xs font-bold text-stone-800 mt-3 flex items-center gap-1">
                <FiShield className="w-3.5 h-3.5 text-emerald-600" /> Quét mã bằng App Ngân hàng bất kỳ
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Hỗ trợ Napas247, MB, Vietcombank, Techcombank, TPBank, BIDV,...
              </p>
            </div>

            {/* Right: Transfer Details & Copy Helpers */}
            <div className="space-y-3.5 text-xs text-stone-700">
              {/* Amount Box */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Số tiền cần thanh toán
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(order.total), 'amount')}
                  className="px-3 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-300 text-amber-900 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'amount' ? <FiCheck className="text-emerald-700" /> : <FiCopy />}
                  {copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>

              {/* Bank Details Table */}
              <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Ngân hàng:</span>
                  <span className="font-bold text-stone-900">{order.paymentBank || 'TPBank'}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Chủ tài khoản:</span>
                  <span className="font-bold text-stone-900 uppercase">{order.paymentAccountName || 'HA HAI ANH'}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-500 font-medium">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-900 text-sm">{order.paymentAccount}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.paymentAccount || '', 'account')}
                      title="Sao chép số tài khoản"
                      className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
                    >
                      {copiedField === 'account' ? <FiCheck className="text-emerald-700" /> : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transfer Reference Box */}
              <div className="bg-amber-100/60 border border-amber-300/90 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900">
                    Nội dung chuyển khoản (bắt buộc):
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.paymentReference || '', 'ref')}
                    className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'ref' ? <FiCheck /> : <FiCopy />}
                    {copiedField === 'ref' ? 'Đã chép mã' : 'Sao chép'}
                  </button>
                </div>
                <p className="font-mono font-black text-base text-amber-950 bg-white/80 py-1.5 px-3 rounded-xl border border-amber-300 text-center tracking-wider select-all">
                  {order.paymentReference}
                </p>
                <p className="text-[10px] text-amber-800 leading-tight">
                  * Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống SePay tự động ghi nhận thanh toán.
                </p>
              </div>
            </div>
          </div>

          {/* Live Status Feedback Banner */}
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 transition-all ${
              statusState === 'success'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                : statusState === 'not_found'
                ? 'bg-amber-50 border border-amber-300 text-amber-900'
                : statusState === 'cancelled'
                ? 'bg-rose-50 border border-rose-300 text-rose-900'
                : 'bg-stone-100 border border-stone-200 text-stone-700'
            }`}
          >
            {statusState === 'success' ? (
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : statusState === 'not_found' ? (
              <FiAlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            ) : statusState === 'cancelled' ? (
              <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <FiRefreshCw className={`w-4 h-4 text-stone-500 shrink-0 mt-0.5 ${checking ? 'animate-spin text-amber-700' : ''}`} />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {checking ? 'Đang kiểm tra kết nối với SePay...' : message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={checking || order.status === 'cancelled' || statusState === 'success'}
              onClick={() => {
                setCheckCount((c) => c + 1);
                void verifyPayment(true);
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Đang kiểm tra giao dịch...' : 'Kiểm tra và hoàn thành 🚀'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={checking || statusState === 'success'}
                className="py-3 px-5 rounded-2xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                Hủy / Đổi phương thức
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
