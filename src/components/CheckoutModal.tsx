import React, { useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useOrderStore } from '../stores/useOrderStore';
import { useTableStore } from '../stores/useTableStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { formatVND, formatDate } from '../utils/formatters';
import { generateVietQRUrl } from '../utils/vietqr';
import type { PaymentMethod } from '../types';
import { FiX, FiCheckCircle, FiPrinter, FiCreditCard } from 'react-icons/fi';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { items, selectedTableId, selectedTableName, isTakeaway, discount, getSubtotal, getTotal, clearCart } =
    useCartStore();
  const { createOrder } = useOrderStore();
  const { updateTableStatus } = useTableStore();
  const { settings } = useSettingsStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [cashGiven, setCashGiven] = useState<number>(getTotal());
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string>('');

  const subtotal = getSubtotal();
  const total = getTotal();
  const changeAmount = Math.max(0, cashGiven - total);

  const qrUrl = generateVietQRUrl(
    settings.bankName,
    settings.bankAccountNo,
    settings.bankAccountName,
    total,
    `88 BONG BIENG THANH TOAN BAN ${selectedTableName || 'TAKEAWAY'}`
  );

  const handleConfirmPayment = () => {
    const newOrder = createOrder({
      tableId: selectedTableId || undefined,
      tableName: selectedTableName || undefined,
      isTakeaway,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      status: 'completed',
      cashierName: 'Thu Ngân 01',
    });

    if (selectedTableId) {
      updateTableStatus(selectedTableId, 'available');
    }

    setCreatedOrderCode(newOrder.code);
    setIsSuccess(true);
  };

  const handleFinish = () => {
    clearCart();
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-stone-900">
        {/* Modal Header */}
        <div className="no-print p-4 border-b border-amber-900/10 flex items-center justify-between bg-amber-50/80">
          <div>
            <h2 className="font-bold text-stone-900 text-base">
              {isSuccess ? 'Thanh Toán Thành Công' : 'Thanh Toán Đơn Hàng'}
            </h2>
            <p className="text-xs text-stone-500">
              {isTakeaway ? 'Đơn Mang Về (Takeaway)' : `Vị trí: ${selectedTableName || 'Bàn chưa chọn'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-amber-100/60 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isSuccess ? (
          /* Success Screen & Bill Preview */
          <div className="p-6 text-center space-y-5 overflow-y-auto bg-[#FAF7F2]">
            <div className="no-print w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              <FiCheckCircle />
            </div>
            <div className="no-print">
              <h3 className="font-extrabold text-stone-900 text-xl">Thanh Toán Thành Công!</h3>
              <p className="text-xs text-stone-600 mt-1">Mã hóa đơn: <span className="text-amber-800 font-bold">{createdOrderCode}</span></p>
            </div>

            {/* Invoice Print Ticket */}
            <div className="printable-receipt bg-white border border-stone-200 rounded-2xl p-5 text-left text-xs font-mono max-w-md mx-auto space-y-3 text-stone-800 shadow-sm">
              <div className="text-center border-b border-dashed border-stone-400 pb-3 space-y-1">
                <h4 className="font-bold text-stone-900 text-base uppercase tracking-wider">❀ {settings.storeName || '88 BỒNG BIÊNG CAFE'} ❀</h4>
                <p className="text-[11px] text-stone-500">{settings.address || '88 Phố Bồng Biêng, Hà Nội'}</p>
                <p className="text-[11px] text-stone-500">SĐT: {settings.phone || '0988 888 888'}</p>
              </div>

              <div className="text-center font-bold text-stone-900 text-sm tracking-widest pt-1">
                HÓA ĐƠN THANH TOÁN
              </div>

              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>Mã đơn: <strong>{createdOrderCode}</strong></span>
                <span>Vị trí: <strong>{isTakeaway ? 'Mang về' : selectedTableName || 'Tại bàn'}</strong></span>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>Ngày: {formatDate(new Date().toISOString())}</span>
                <span>Thu ngân: Thu Ngân 01</span>
              </div>

              <div className="border-t border-b border-dashed border-stone-400 py-2.5 space-y-2">
                {items.map((item) => (
                  <div key={item.cartItemId} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-stone-900 text-xs">
                      <span>{item.quantity}x {item.product.name} ({item.size})</span>
                      <span>{formatVND(item.itemTotalPrice)}</span>
                    </div>
                    {item.selectedOptions.length > 0 && (
                      <div className="text-[10px] text-stone-500 pl-3">
                        + {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Giảm giá:</span>
                    <span>-{formatVND(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-stone-900 text-sm pt-1.5 border-t border-stone-300">
                  <span>TỔNG CỘNG THU:</span>
                  <span className="text-amber-800 text-base">{formatVND(total)}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-stone-400 text-[11px] text-stone-600 space-y-1">
                <p className="font-bold text-stone-900 text-xs">Cảm ơn Quý khách & Hẹn gặp lại! ❀</p>
                <p className="text-[10px] text-stone-500">WiFi: <strong>88BongBieng</strong> • Pass: <strong>88888888</strong></p>
              </div>
            </div>

            <div className="no-print flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <FiPrinter /> In Hóa Đơn
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Hoàn Thành & Trở Về POS
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection Screen */
          <div className="p-6 space-y-6 overflow-y-auto bg-[#FAF7F2]">
            {/* Payment Method Tabs */}
            <div>
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2.5">
                Phương thức thanh toán
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'momo', label: 'Ví MoMo 💖', desc: 'Mã QR MoMo' },
                  { id: 'vnpay', label: 'VNPAY-QR 💙', desc: 'Quét mọi App' },
                  { id: 'vietqr', label: 'VietQR 🏦', desc: 'Chuyển khoản' },
                  { id: 'cash', label: 'Tiền Mặt 💵', desc: 'Thu tại quầy' },
                ].map((m) => {
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                        paymentMethod === m.id
                          ? 'bg-amber-700 border-amber-700 text-white font-bold shadow-md scale-[1.02]'
                          : 'bg-white border-amber-200/80 text-stone-700 hover:border-amber-400 hover:bg-amber-50'
                      }`}
                    >
                      <span className="text-xs font-extrabold">{m.label}</span>
                      <span className={`text-[10px] ${paymentMethod === m.id ? 'text-amber-200' : 'text-stone-400'}`}>
                        {m.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MoMo QR Display */}
            {paymentMethod === 'momo' && (
              <div className="bg-pink-50/80 border border-pink-200 rounded-2xl p-4 text-center space-y-2">
                <p className="text-xs font-bold text-pink-900">💖 Khách quét mã QR Ví MoMo để thanh toán:</p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=2|99|0988888888|QUAN%20CA%20PHE%2088%20BONG%20BIENG|checkouts@momo|0|0|${total}|Thanh%20toan%20POS`}
                  alt="MoMo QR"
                  className="w-40 h-40 mx-auto rounded-xl bg-white p-2 border border-pink-200 shadow-sm"
                />
                <p className="text-[11px] text-pink-800">Số tiền cần quét: <strong className="text-pink-900">{formatVND(total)}</strong></p>
              </div>
            )}

            {/* VNPAY QR Display */}
            {paymentMethod === 'vnpay' && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center space-y-2">
                <p className="text-xs font-bold text-blue-900">💙 Khách quét mã VNPAY-QR bằng App Ngân hàng:</p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021238570010A0000007270127000697042201130988888888520458125303704540${total}5802VN5921BONG%20BIENG%20VNPAY6007HA%20NOI62190815BONGBIENG1001`}
                  alt="VNPAY QR"
                  className="w-40 h-40 mx-auto rounded-xl bg-white p-2 border border-blue-200 shadow-sm"
                />
                <p className="text-[11px] text-blue-800">Số tiền cần quét: <strong className="text-blue-900">{formatVND(total)}</strong></p>
              </div>
            )}

            {/* Payment Method Details */}
            {paymentMethod === 'vietqr' && (
              <div className="bg-white border border-amber-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-xs">
                <p className="text-xs text-stone-700 font-medium">Quét mã QR qua ứng dụng Ngân hàng (Napas247)</p>
                <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-md">
                  <img src={qrUrl} alt="VietQR" className="w-48 h-48 object-contain" />
                </div>
                <div className="text-xs text-stone-600 space-y-0.5">
                  <p>Ngân hàng: <span className="font-bold text-stone-900">{settings.bankName}</span></p>
                  <p>Số tài khoản: <span className="font-bold text-amber-800">{settings.bankAccountNo}</span></p>
                  <p>Chủ tài khoản: <span className="font-bold text-stone-900">{settings.bankAccountName}</span></p>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex justify-between items-center text-sm font-bold text-stone-900">
                  <span>Cần thanh toán:</span>
                  <span className="text-amber-800 text-lg font-extrabold">{formatVND(total)}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-stone-600 font-semibold">Tiền khách đưa (đ):</label>
                  <input
                    type="number"
                    value={cashGiven || ''}
                    onChange={(e) => setCashGiven(Number(e.target.value))}
                    className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-4 py-2.5 text-base font-bold text-amber-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Quick Cash Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[total, 50000, 100000, 200000, 500000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setCashGiven(val)}
                      className="py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                    >
                      {formatVND(val)}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-amber-100">
                  <span className="text-stone-600">Tiền thừa trả khách:</span>
                  <span className="font-extrabold text-emerald-600 text-base">{formatVND(changeAmount)}</span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-white border border-amber-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
                <FiCreditCard className="w-12 h-12 text-amber-700 mx-auto" />
                <p className="text-sm font-bold text-stone-900">Thanh toán qua Máy quẹt thẻ POS</p>
                <p className="text-xs text-stone-500">Vui lòng quẹt/chạm thẻ Napas, Visa, Mastercard trên thiết bị POS của quán.</p>
              </div>
            )}

            {/* Total Footer Action */}
            <div className="pt-2">
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all text-base cursor-pointer"
              >
                <FiCheckCircle className="w-5 h-5 stroke-[2.5]" />
                <span>Xác Nhận Đã Nhận {formatVND(total)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
