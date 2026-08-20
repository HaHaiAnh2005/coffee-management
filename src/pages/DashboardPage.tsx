import React from 'react';
import { useOrderStore } from '../stores/useOrderStore';
import { useTableStore } from '../stores/useTableStore';
import { useMenuStore } from '../stores/useMenuStore';
import { useInventoryStore } from '../stores/useInventoryStore';
import { StatCard } from '../components/StatCard';
import { formatVND, formatDate } from '../utils/formatters';
import {
  FiDollarSign,
  FiShoppingBag,
  FiGrid,
  FiTrendingUp,
  FiBarChart2,
  FiAlertCircle,
} from 'react-icons/fi';

export const DashboardPage: React.FC = () => {
  const { getTodayStats, orders } = useOrderStore();
  const { tables } = useTableStore();
  const { products } = useMenuStore();
  const { getLowStockItems } = useInventoryStore();

  const stats = getTodayStats();
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const lowStock = getLowStockItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <FiBarChart2 className="text-sky-600" /> Báo Cáo & Thống Kê Tổng Quan
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Dữ liệu hoạt động kinh doanh realtime của quán cà phê trong ngày hôm nay.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh Thu Hôm Nay"
          value={formatVND(stats.totalRevenue)}
          subtext={`Từ ${stats.completedOrders} đơn đã hoàn thành`}
          icon={FiDollarSign}
          color="amber"
        />
        <StatCard
          title="Tổng Số Đơn Hàng"
          value={stats.totalOrders}
          subtext={`Tỷ lệ hoàn thành: ${
            stats.totalOrders > 0
              ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
              : 100
          }%`}
          icon={FiShoppingBag}
          color="emerald"
        />
        <StatCard
          title="Bàn Đang Phục Vụ"
          value={`${occupiedTables} / ${tables.length}`}
          subtext={`Công suất sử dụng: ${Math.round((occupiedTables / tables.length) * 100)}%`}
          icon={FiGrid}
          color="blue"
        />
        <StatCard
          title="Giá Trị Đơn Trung Bình"
          value={formatVND(stats.averageOrderValue)}
          subtext="Doanh thu / đơn hoàn thành"
          icon={FiTrendingUp}
          color="rose"
        />
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Completed Orders (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-sky-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">Giao Dịch Gần Đây</h3>
            <span className="text-xs text-stone-500 font-semibold">{orders.length} hóa đơn</span>
          </div>

          <div className="divide-y divide-sky-100 overflow-y-auto max-h-[350px]">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs hover:bg-sky-50/40 px-2 rounded-xl transition-colors">
                <div>
                  <p className="font-bold text-stone-900">
                    {o.code} - <span className="text-sky-700 font-semibold">{o.isTakeaway ? 'Mang về' : o.tableName}</span>
                  </p>
                  <p className="text-[11px] text-stone-500">{formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-stone-900 text-sm">{formatVND(o.total)}</p>
                  <p className="text-[11px] uppercase font-bold text-emerald-600">{o.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Warning & Quick Highlights (Right 1 col) */}
        <div className="space-y-4">
          {/* Low stock alert */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <FiAlertCircle className="text-sky-600" /> Cảnh Báo Tồn Kho
            </h3>

            {lowStock.length === 0 ? (
              <p className="text-xs text-emerald-700 font-bold">Tất cả nguyên liệu trong kho đang ở mức an toàn!</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-stone-800">{item.name}</span>
                    <span className="font-extrabold text-sky-700">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Menu Summary */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-2 text-xs shadow-sm">
            <h3 className="font-bold text-stone-900 text-sm">Thực Đơn Quán</h3>
            <p className="text-stone-600">
              Tổng số món ăn & thức uống: <span className="font-bold text-stone-900">{products.length}</span>
            </p>
            <p className="text-stone-600">
              Món đang kinh doanh:{' '}
              <span className="font-bold text-emerald-700">
                {products.filter((p) => p.isAvailable).length}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
