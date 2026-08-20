import React, { useState } from 'react';
import { useOrderStore } from '../stores/useOrderStore';
import { OrderDetailModal } from '../components/OrderDetailModal';
import type { Order } from '../types';
import { formatVND, formatDate } from '../utils/formatters';
import { FiFileText, FiEye } from 'react-icons/fi';

export const OrdersPage: React.FC = () => {
  const { orders, activeOrderFilter, setActiveOrderFilter } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeOrderFilter === 'all') return true;
    return o.status === activeOrderFilter;
  });

  return (
    <div className="space-y-6 text-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiFileText className="text-sky-600" /> Lịch Sử Hóa Đơn & Đơn Hàng
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tổng số hóa đơn: <span className="font-bold text-stone-900">{orders.length}</span>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-sky-50/80 border border-sky-200/80 p-1.5 rounded-2xl shadow-xs">
          {(['all', 'completed', 'cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveOrderFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeOrderFilter === filter
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-stone-600 hover:text-sky-950'
              }`}
            >
              {filter === 'all' ? 'Tất Cả' : filter === 'completed' ? 'Hoàn Thành' : 'Đã Hủy'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sky-50/80 text-stone-700 text-xs uppercase tracking-wider border-b border-sky-100 font-bold">
              <th className="p-4">Mã Hóa Đơn</th>
              <th className="p-4">Vị trí / Loại đơn</th>
              <th className="p-4">Món & Số lượng</th>
              <th className="p-4">Hình thức thanh toán</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Thời gian</th>
              <th className="p-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 text-xs text-stone-800">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-stone-500">
                  Chưa có hóa đơn nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="p-4 font-bold text-sky-700">{o.code}</td>
                  <td className="p-4 font-semibold text-stone-900">
                    {o.isTakeaway ? '🥤 Mang Về' : `🪑 ${o.tableName}`}
                  </td>
                  <td className="p-4 text-stone-600">
                    {o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="p-4 uppercase font-semibold text-stone-600">{o.paymentMethod}</td>
                  <td className="p-4 font-extrabold text-sky-800 text-sm">{formatVND(o.total)}</td>
                  <td className="p-4 text-stone-500">{formatDate(o.createdAt)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5" /> Xem phiếu
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Ticket Modal */}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};
