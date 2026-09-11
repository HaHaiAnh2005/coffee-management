import React, { useState } from 'react';
import { useOrderStore } from '../../store/order.store';
import { useAuthStore } from '../../store/auth.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { FiClock, FiFileText, FiChevronRight, FiShoppingBag, FiUser } from 'react-icons/fi';
import { OrderDetailModal } from '../../components/OrderDetailModal';
import type { Order } from '../../types';
import { Link } from 'react-router-dom';

export const OrderHistory: React.FC = () => {
  const { user } = useAuthStore();
  const allOrders = useOrderStore((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const lastCustomerPhone = localStorage.getItem('last_customer_phone');
  const lastCustomerName = localStorage.getItem('last_customer_name');

  // Filter orders for the specific logged in customer or current guest phone
  const orders = allOrders.filter((o) => {
    if (user) {
      // Admin sees all, regular user sees their own
      if (user.role === 'ADMIN') return true;
      const matchPhone = user.phone && o.customerPhone === user.phone;
      const matchName = user.name && o.customerName === user.name;
      return Boolean(matchPhone || matchName);
    }

    if (lastCustomerPhone) {
      return o.customerPhone === lastCustomerPhone;
    }

    if (lastCustomerName) {
      return o.customerName === lastCustomerName;
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-stone-900 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiClock className="text-[#2b6ba4]" /> Lịch Sử Đơn Hàng Của Tôi
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {user ? `Tài khoản: ${user.name} (${user.phone})` : lastCustomerPhone ? `Đơn hàng gắn với SĐT: ${lastCustomerPhone}` : 'Danh sách đơn hàng của bạn'}
          </p>
        </div>
        <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
          Tổng số đơn: <strong className="text-stone-900">{orders.length}</strong> đơn hàng
        </span>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center mx-auto text-2xl">
            ☕
          </div>
          <p className="text-sm font-bold text-stone-800">Bạn chưa có đơn hàng nào trong lịch sử.</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Hãy khám phá ngay thực đơn thức uống phong phú của 88 Bồng Biêng và đặt món nhé!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <FiShoppingBag /> Đặt Món Ngay
          </Link>
        </div>
      ) : (
        /* Order Cards List */
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className="bg-white border border-stone-200 hover:border-amber-400 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              {/* Order Header Info */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="font-bold text-[#2b6ba4] text-sm group-hover:text-amber-800 transition-colors">
                      {o.code}
                    </span>
                    <p className="text-[11px] text-stone-500">{formatDate(o.createdAt)}</p>
                  </div>
                  {o.isTakeaway && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                      📦 Mang về
                    </span>
                  )}
                  {o.customerName && (
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <FiUser className="w-3 h-3 text-stone-400" /> {o.customerName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      o.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : o.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {o.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="space-y-1.5 text-xs text-stone-700">
                {o.items.map((i, idx) => (
                  <div key={i.cartItemId || idx} className="flex justify-between items-center">
                    <span>
                      <strong className="text-stone-900">{i.quantity}x</strong> {i.product.name} ({i.size})
                    </span>
                    <span className="font-semibold text-stone-900">{formatCurrency(i.itemTotalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                <span className="text-stone-500">
                  Thanh toán: <strong className="text-stone-900 uppercase">{o.paymentMethod}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-[#2b6ba4] text-sm group-hover:text-amber-800 transition-colors">
                    {formatCurrency(o.total)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(o);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 transition-all border border-amber-300 shadow-2xs cursor-pointer hover:scale-105"
                  >
                    <FiFileText className="w-3.5 h-3.5" /> Xem Hóa Đơn Chi Tiết <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Thermal Receipt Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
