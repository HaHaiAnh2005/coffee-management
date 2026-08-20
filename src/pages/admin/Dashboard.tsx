import React from 'react';
import { useOrderStore } from '../../store/order.store';
import { useTableStore } from '../../stores/useTableStore';
import { useProductStore } from '../../store/product.store';
import { useInventoryStore } from '../../stores/useInventoryStore';
import { StatCard } from '../../components/StatCard';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { FiDollarSign, FiShoppingBag, FiGrid, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

export const Dashboard: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);
  const tables = useTableStore((state) => state.tables);
  const products = useProductStore((state) => state.products);
  const inventoryItems = useInventoryStore((state) => state.items);

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const lowStock = inventoryItems.filter((i) => i.quantity <= i.minAlertThreshold);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <FiTrendingUp className="text-sky-600" /> Báo Cáo Quản Trị Hệ Thống (Admin Dashboard)
        </h1>
        <p className="text-xs text-stone-500 mt-1">Tổng quan doanh thu & chỉ số vận hành quán cà phê</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Doanh Thu Hôm Nay" value={formatCurrency(totalRevenue)} subtext={`${completedOrders.length} đơn hàng`} icon={FiDollarSign} color="amber" />
        <StatCard title="Tổng Số Đơn Hàng" value={orders.length} subtext="Hệ thống POS & Online" icon={FiShoppingBag} color="emerald" />
        <StatCard title="Tổng Sản Phẩm Menu" value={products.length} subtext="22 Món Bồng Biêng dệt hương" icon={FiTrendingUp} color="blue" />
        <StatCard title="Kho Nguyên Liệu" value={inventoryItems.length} subtext="Nguyên liệu pha chế" icon={FiAlertCircle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-sky-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-stone-900 text-sm">Giao Dịch Hóa Đơn Mới Nhất</h3>
          <div className="divide-y divide-sky-100/80 overflow-y-auto max-h-[350px]">
            {orders.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs hover:bg-sky-50/40 px-2 rounded-xl transition-colors">
                <div>
                  <p className="font-bold text-stone-800">{o.code} - <span className="text-sky-700 font-semibold">{o.isTakeaway ? 'Mang về' : o.tableName}</span></p>
                  <p className="text-[11px] text-stone-500">{formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900">{formatCurrency(o.total)}</p>
                  <p className="text-[11px] uppercase font-semibold text-emerald-600">{o.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-3 shadow-sm">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <FiAlertCircle className="text-sky-600" /> Cảnh Báo Kho Nguyên Liệu
          </h3>
          {lowStock.length === 0 ? (
            <p className="text-xs text-emerald-600 font-bold">Tồn kho nguyên liệu an toàn!</p>
          ) : (
            lowStock.map((i) => (
              <div key={i.id} className="p-2.5 rounded-xl bg-sky-50 border border-sky-200/80 flex justify-between text-xs">
                <span className="font-semibold text-stone-800">{i.name}</span>
                <span className="font-bold text-sky-700">{i.quantity} {i.unit}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
