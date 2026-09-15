import React from 'react';
import type { Order } from '../types';
import { formatVND, formatDate } from '../utils/formatters';
import { useSettingsStore } from '../stores/useSettingsStore';
import { FiX, FiPrinter } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const { settings } = useSettingsStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-stone-900">
        
        {/* Modal Header - HIDE ON PRINT (no-print) */}
        <div className="no-print p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/80">
          <div>
            <h2 className="font-extrabold text-stone-900 text-base flex items-center gap-1.5">
              <BsStars className="text-sky-600" /> Chi Tiết Hóa Đơn {order.code}
            </h2>
            <p className="text-xs text-sky-900 font-semibold">
              {order.isTakeaway ? '📦 Đơn mang về (Takeaway)' : `🪑 Vị trí: ${order.tableName || 'Bàn chưa xác định'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-sky-100/80 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Thermal Receipt Ticket */}
        <div className="p-5 overflow-y-auto bg-[#f3f7fa] flex justify-center">
          {/* Printable Receipt Card */}
          <div className="printable-receipt bg-white border border-stone-200 rounded-2xl p-5 text-xs font-mono space-y-3 text-stone-900 shadow-sm w-full max-w-sm">
            
            {/* Header Shop Info */}
            <div className="text-center border-b border-dashed border-stone-400 pb-3 space-y-1">
              <h3 className="font-extrabold text-stone-900 text-base uppercase tracking-wider">
                ❀ {settings.storeName || '88 BỒNG BIÊNG CAFE'} ❀
              </h3>
              <p className="text-[11px] text-stone-600 font-sans">
                {settings.address || '88 Phố Bồng Biêng, Hà Nội'}
              </p>
              <p className="text-[11px] text-stone-600 font-sans">
                Hotline: {settings.phone || '0988 888 888'}
              </p>
            </div>

            {/* Receipt Meta */}
            <div className="text-center font-bold text-stone-900 text-sm tracking-widest pt-1">
              HÓA ĐƠN THANH TOÁN
            </div>

            <div className="space-y-0.5 text-[11px] text-stone-700 pt-1">
              <div className="flex justify-between">
                <span>Mã đơn: <strong className="text-stone-900">{order.code}</strong></span>
                <span>Vị trí: <strong>{order.isTakeaway ? 'Mang về' : order.tableName || 'Tại bàn'}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian: {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thu ngân: {order.cashierName || 'Thu Ngân 01'}</span>
                <span>P.Thức: <strong className="uppercase">{order.paymentMethod}</strong></span>
              </div>
              {order.customerName && (
                <div className="flex justify-between">
                  <span>Khách hàng: <strong>{order.customerName}</strong></span>
                  <span>SĐT: {order.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="border-t border-b border-dashed border-stone-400 py-2.5 space-y-2">
              <div className="flex justify-between font-bold text-stone-900 text-[11px] border-b border-stone-200 pb-1">
                <span className="w-1/2">TÊN MÓN</span>
                <span className="w-1/6 text-center">SL</span>
                <span className="w-1/3 text-right">THÀNH TIỀN</span>
              </div>

              {order.items.map((item) => (
                <div key={item.cartItemId} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-stone-900 text-xs">
                    <span className="w-1/2 line-clamp-1">{item.product.name} ({item.size})</span>
                    <span className="w-1/6 text-center">{item.quantity}</span>
                    <span className="w-1/3 text-right">{formatVND(item.itemTotalPrice)}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 pl-2">
                    ▸ {item.sugarLevel} đường, {item.iceLevel}
                    {item.selectedOptions.length > 0 && `, ${item.selectedOptions.map((o) => o.optionName).join(', ')}`}
                    {item.note && ` (${item.note})`}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation */}
            <div className="space-y-1 text-stone-700 text-xs pt-1">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatVND(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sky-800">
                  <span>Giảm giá khuyến mãi:</span>
                  <span>-{formatVND(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-stone-900 text-sm pt-1.5 border-t border-stone-300">
                <span>TỔNG CỘNG THU:</span>
                <span className="text-sky-900 text-base">{formatVND(order.total)}</span>
              </div>
            </div>

            {/* Receipt Footer Info */}
            <div className="text-center pt-3 border-t border-dashed border-stone-400 space-y-1">
              <p className="font-bold text-stone-900 text-xs">
                Cảm ơn Quý khách & Hẹn gặp lại! ❀
              </p>
              <p className="text-[10px] text-stone-500">
                WiFi: <strong>88BongBieng</strong> • Pass: <strong>88888888</strong>
              </p>
              <p className="text-[9px] text-stone-400 font-sans italic pt-1">
                Hóa đơn có giá trị trong ngày • Chúc Quý khách ngon miệng!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer - HIDE ON PRINT (no-print) */}
        <div className="no-print p-4 border-t border-sky-100 bg-white flex justify-end gap-3 shadow-xs">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs border border-sky-300"
          >
            <FiPrinter className="w-4 h-4 text-sky-700" /> In Lại Hóa Đơn
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
