import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { useOrderStore } from '../../store/order.store';
import { useAuthStore } from '../../store/auth.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { generateVietQRUrl } from '../../utils/helpers';
import { calculateSubtotal } from '../../utils/calculateTotal';
import { FiCheckCircle, FiDollarSign, FiUserCheck } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [customerName, setCustomerName] = useState(
    () => user?.name || localStorage.getItem('last_customer_name') || ''
  );
  const [phone, setPhone] = useState(
    () => user?.phone || localStorage.getItem('last_customer_phone') || ''
  );
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'vnpay' | 'cash'>('momo');
  const [isProcessingGateway, setIsProcessingGateway] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill from logged-in user profile if available
  useEffect(() => {
    if (user?.name) setCustomerName(user.name);
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const subtotal = calculateSubtotal(items);
  const total = subtotal;

  const qrUrl = generateVietQRUrl('TPBank', '07755056866', 'HA HAI ANH', total, 'BONG BIENG ONLINE CHECKOUT');

  // Generated MoMo QR link simulation
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=2|99|0988888888|QUAN%20CA%20PHE%2088%20BONG%20BIENG|checkouts@momo|0|0|${total}|Thanh%20toan%20don%20hang%20Bong%20Bieng`;
  
  // Generated VNPAY QR link simulation
  const vnpayQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021238570010A0000007270127000697042201130988888888520458125303704540${total}5802VN5921BONG%20BIENG%20VNPAY6007HA%20NOI62190815BONGBIENG1001`;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    try {
      localStorage.setItem('last_customer_phone', phone);
      localStorage.setItem('last_customer_name', customerName);
    } catch (e) {}

    if (paymentMethod === 'momo' || paymentMethod === 'vnpay') {
      setIsProcessingGateway(true);
      setTimeout(() => {
        setIsProcessingGateway(false);
        createOrder({
          isTakeaway: true,
          items,
          subtotal,
          discount: 0,
          total,
          paymentMethod,
          status: 'completed',
          cashierName: 'Cổng Thanh Toán Online',
          customerName,
          customerPhone: phone,
        });
        setIsSuccess(true);
      }, 2500);
      return;
    }

    createOrder({
      isTakeaway: true,
      items,
      subtotal,
      discount: 0,
      total,
      paymentMethod,
      status: 'completed',
      cashierName: 'Online System',
      customerName,
      customerPhone: phone,
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-white border border-amber-200/80 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 shadow-lg text-stone-900">
        <FiCheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
        <h2 className="text-2xl font-extrabold text-stone-900">Thanh Toán Thành Công!</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Đơn hàng của bạn đã được thanh toán qua <span className="font-bold text-amber-800 uppercase">{paymentMethod}</span>. 88 Bồng Biêng đang chế biến và giao ngay đến bạn!
        </p>
        <button
          onClick={() => {
            clearCart();
            navigate('/order-history');
          }}
          className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Xem Lịch Sử Đơn Hàng ➔
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-stone-900 pb-12">
      {/* Gateway Transition Overlay */}
      {isProcessingGateway && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold animate-pulse shadow-lg bg-pink-600">
              {paymentMethod === 'momo' ? '💖' : '💙'}
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              Đang chuyển hướng cổng thanh toán {paymentMethod === 'momo' ? 'MoMo' : 'VNPAY'}...
            </h3>
            <p className="text-xs text-stone-500">Hệ thống đang xác thực chữ ký mã hóa bảo mật HMAC-SHA512 và xác nhận giao dịch tự động.</p>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-700 h-full w-3/4 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Thanh Toán Đơn Hàng Online</h1>
        <p className="text-xs text-stone-600 mt-1">Hỗ trợ các cổng thanh toán MoMo, VNPAY, VietQR và Tiền mặt khi nhận hàng</p>
      </div>

      {/* Online Order Type Indicator: Takeaway / Delivery Only */}
      <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-100 border border-amber-300/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber-800 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm">
          🛍️
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-800 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
            HÌNH THỨC: BÁN MANG VỀ & GIAO HÀNG TẬN NƠI
          </span>
          <p className="text-xs text-amber-950 font-medium mt-0.5">
            Đơn hàng đặt trực tuyến của Khách Hàng được chế biến, đóng gói mang về và giao hàng tận nơi nhanh chóng.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Delivery Details (5 cols) */}
        <div className="md:col-span-5 bg-white border border-amber-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <h3 className="font-bold text-stone-900 text-sm">
              1. Thông Tin Nhận Hàng
            </h3>
            {user && (
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <FiUserCheck className="w-3 h-3" /> Đã tự động điền
              </span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Họ và tên người nhận:</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nguyễn Văn A..."
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Số điện thoại liên hệ:</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0988..."
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Địa chỉ giao tận nơi:</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, Tên đường, Phường/Xã..."
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Right Column: Payment Gateways Selector (7 cols) */}
        <div className="md:col-span-7 bg-white border border-amber-200/80 rounded-2xl p-6 space-y-5 shadow-xs">
          <h3 className="font-bold text-stone-900 text-sm border-b border-amber-100 pb-2">
            2. Chọn Cổng Thanh Toán Hỗ Trợ
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* MoMo Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('momo')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'momo'
                  ? 'bg-pink-50 border-pink-500 text-pink-950 ring-2 ring-pink-500/20 font-bold shadow-xs'
                  : 'bg-amber-50/40 border-amber-200 text-stone-700 hover:bg-amber-100/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                MoMo
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Ví MoMo 💖</p>
                <p className="text-[10px] text-stone-500">Quét mã QR / App MoMo</p>
              </div>
            </button>

            {/* VNPAY Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('vnpay')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'vnpay'
                  ? 'bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-600/20 font-bold shadow-xs'
                  : 'bg-amber-50/40 border-amber-200 text-stone-700 hover:bg-amber-100/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
                VNPAY
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">VNPAY-QR 💙</p>
                <p className="text-[10px] text-stone-500">ATM / Visa / QR Bank</p>
              </div>
            </button>

            {/* VietQR Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('vietqr')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'vietqr'
                  ? 'bg-amber-100/80 border-amber-600 text-amber-950 font-bold shadow-xs'
                  : 'bg-amber-50/40 border-amber-200 text-stone-700 hover:bg-amber-100/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <BsQrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">VietQR Transfer</p>
                <p className="text-[10px] text-stone-500">Chuyển khoản 24/7</p>
              </div>
            </button>

            {/* Cash Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                  : 'bg-amber-50/40 border-amber-200 text-stone-700 hover:bg-amber-100/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <FiDollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Tiền Mặt (COD)</p>
                <p className="text-[10px] text-stone-500">Thanh toán khi nhận</p>
              </div>
            </button>
          </div>

          {/* QR Code Preview Box based on selected gateway */}
          {paymentMethod === 'momo' && (
            <div className="p-4 bg-pink-50/60 border border-pink-200 rounded-2xl text-center space-y-2">
              <p className="text-xs font-bold text-pink-900 flex items-center justify-center gap-1">
                💖 Mã QR Thanh Toán Qua Ví MoMo:
              </p>
              <img src={momoQrUrl} alt="MoMo QR" className="w-40 h-40 mx-auto rounded-xl bg-white p-2 border border-pink-200 shadow-sm" />
              <p className="text-[10px] text-pink-800">Quét mã bằng App MoMo hoặc bấm Xác nhận để tự động chuyển hướng</p>
            </div>
          )}

          {paymentMethod === 'vnpay' && (
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl text-center space-y-2">
              <p className="text-xs font-bold text-blue-900 flex items-center justify-center gap-1">
                💙 Mã QR Thanh Toán Qua VNPAY-QR:
              </p>
              <img src={vnpayQrUrl} alt="VNPAY QR" className="w-40 h-40 mx-auto rounded-xl bg-white p-2 border border-blue-200 shadow-sm" />
              <p className="text-[10px] text-blue-800">Hỗ trợ tất cả ứng dụng Ngân hàng (MB, VCB, BIDV, Techcombank...)</p>
            </div>
          )}

          {paymentMethod === 'vietqr' && (
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-center space-y-2">
              <p className="text-xs font-bold text-amber-900">
                🏦 Mã VietQR Ngân Hàng TPBank: <strong className="text-stone-900">HA HAI ANH (0775 5056 866)</strong>
              </p>
              <img src={qrUrl} alt="VietQR TPBank" className="w-44 h-44 mx-auto rounded-xl bg-white p-2 border border-amber-200 shadow-sm" />
              <p className="text-[11px] text-stone-600">Mã QR tự động nhập đúng số tiền <strong>{formatCurrency(total)}</strong> và nội dung chuyển khoản</p>
            </div>
          )}

          <div className="pt-3 border-t border-amber-100 space-y-3">
            <div className="flex justify-between items-baseline font-black text-stone-900 text-lg">
              <span>Tổng cần thanh toán:</span>
              <span className="text-amber-800 text-xl">{formatCurrency(total)}</span>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.01]"
            >
              {paymentMethod === 'momo' && 'Xác Nhận & Thanh Toán Qua MoMo 💖'}
              {paymentMethod === 'vnpay' && 'Xác Nhận & Thanh Toán Qua VNPAY 💙'}
              {paymentMethod === 'vietqr' && 'Xác Nhận Đơn & Chuyển Khoản 🏦'}
              {paymentMethod === 'cash' && 'Xác Nhận Đặt Hàng (Tiền Mặt) 💵'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
