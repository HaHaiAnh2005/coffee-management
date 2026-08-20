import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiAward, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { useOrderStore } from '../../store/order.store';

export const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'month'>('7days');
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const orders = useOrderStore((state) => state.orders);

  // Compute live added stats from placed orders in store
  const liveCompletedOrders = orders.filter((o) => o.status === 'completed');
  const liveAddedRevenue = liveCompletedOrders.reduce((sum, o) => sum + o.total, 0);
  const liveAddedOrdersCount = liveCompletedOrders.length;

  // Base metrics map according to selected time range
  const baseMetricsMap = {
    today: { label: 'Hôm nay', totalRevenue: 6850000, totalOrders: 48, successRate: '98.5%' },
    '7days': { label: '7 ngày qua', totalRevenue: 48500000, totalOrders: 342, successRate: '99.1%' },
    '30days': { label: '30 ngày qua', totalRevenue: 198200000, totalOrders: 1380, successRate: '98.8%' },
    month: { label: 'Tháng này', totalRevenue: 215000000, totalOrders: 1490, successRate: '99.0%' },
  };

  const baseMetrics = baseMetricsMap[timeRange];
  const totalRevenue = baseMetrics.totalRevenue + liveAddedRevenue;
  const totalOrders = baseMetrics.totalOrders + liveAddedOrdersCount;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const currentMetrics = {
    label: baseMetrics.label,
    totalRevenue,
    totalOrders,
    avgOrder,
    successRate: baseMetrics.successRate,
  };

  // Daily Chart Data (Add live revenue to Today / Sunday)
  const chartData = [
    { date: 'Thứ 2', revenue: 5800000, orders: 40, heightPct: 60 },
    { date: 'Thứ 3', revenue: 6200000, orders: 44, heightPct: 65 },
    { date: 'Thứ 4', revenue: 7100000, orders: 50, heightPct: 75 },
    { date: 'Thứ 5', revenue: 6900000, orders: 48, heightPct: 72 },
    { date: 'Thứ 6', revenue: 8400000, orders: 58, heightPct: 88 },
    { date: 'Thứ 7', revenue: 9600000, orders: 68, heightPct: 100 },
    { date: 'Hôm nay', revenue: 8500000 + liveAddedRevenue, orders: 60 + liveAddedOrdersCount, heightPct: 95 },
  ];

  // Best Selling Products List with dynamic live additions
  const initialBestSellers = [
    { rank: 1, name: 'Song Nhài Bồng Biêng Signature', category: 'Trà Hương Hoa', sold: 185, revenue: 9065000 },
    { rank: 2, name: 'Cà Phê Muối Bông Biêng', category: 'Cà Phê Mộc', sold: 142, revenue: 5538000 },
    { rank: 3, name: 'Thanh Nhài Phủ Kem Mây', category: 'Trà Sữa Kem Mây', sold: 118, revenue: 5310000 },
    { rank: 4, name: 'Cà Phê Sữa Đá Sài Gòn', category: 'Cà Phê Mộc', sold: 96, revenue: 3360000 },
    { rank: 5, name: 'Trà Đào Sen Tuyết Bông Biêng', category: 'Trà Trái Cây', sold: 84, revenue: 3780000 },
  ];

  // Aggregate live items from placed orders
  const itemMap: Record<string, { sold: number; revenue: number }> = {};
  liveCompletedOrders.forEach((order) => {
    order.items.forEach((item) => {
      const name = item.product.name;
      if (!itemMap[name]) {
        itemMap[name] = { sold: 0, revenue: 0 };
      }
      itemMap[name].sold += item.quantity;
      itemMap[name].revenue += item.itemTotalPrice;
    });
  });

  const bestSellers = initialBestSellers.map((item) => {
    const liveStats = itemMap[item.name] || { sold: 0, revenue: 0 };
    return {
      ...item,
      sold: item.sold + liveStats.sold,
      revenue: item.revenue + liveStats.revenue,
    };
  });

  // Real Excel File Export Function
  const handleExportExcel = () => {
    // 1. Sheet 1: General Summary
    const summaryData = [
      { 'Chỉ Số Kinh Doanh': 'Kỳ báo cáo', 'Giá Trị': currentMetrics.label },
      { 'Chỉ Số Kinh Doanh': 'Tổng Doanh Thu (VND)', 'Giá Trị': currentMetrics.totalRevenue },
      { 'Chỉ Số Kinh Doanh': 'Tổng Số Đơn Hàng', 'Giá Trị': currentMetrics.totalOrders },
      { 'Chỉ Số Kinh Doanh': 'Giá Trị Đơn Trung Bình (VND)', 'Giá Trị': currentMetrics.avgOrder },
      { 'Chỉ Số Kinh Doanh': 'Tỷ Lệ Hoàn Thành', 'Giá Trị': currentMetrics.successRate },
      { 'Chỉ Số Kinh Doanh': 'Thời Gian Xuất File', 'Giá Trị': new Date().toLocaleString('vi-VN') },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);

    // 2. Sheet 2: Daily Breakdown
    const dailyExportData = chartData.map((d) => ({
      'Ngày Thống Kê': d.date,
      'Doanh Thu (VND)': d.revenue,
      'Số Đơn Hàng': d.orders,
      'Doanh Thu Trung Bình/Đơn': Math.round(d.revenue / d.orders),
    }));
    const wsDaily = XLSX.utils.json_to_sheet(dailyExportData);

    // 3. Sheet 3: Top Best Sellers
    const bestSellersExportData = bestSellers.map((item) => ({
      'Xếp Hạng': `TOP ${item.rank}`,
      'Tên Sản Phẩm': item.name,
      'Danh Mục': item.category,
      'Số Lượng Đã Bán': item.sold,
      'Doanh Thu Mang Lại (VND)': item.revenue,
    }));
    const wsBestSellers = XLSX.utils.json_to_sheet(bestSellersExportData);

    // Build Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tong_Quan_Doanh_Thu');
    XLSX.utils.book_append_sheet(wb, wsDaily, 'Doanh_Thu_Theo_Ngay');
    XLSX.utils.book_append_sheet(wb, wsBestSellers, 'Top_SanPham_BanChay');

    // Trigger Download
    const fileName = `Bao_Cao_Doanh_Thu_Bong_Bieng_${timeRange}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setIsExportSuccess(true);
    setTimeout(() => setIsExportSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 text-stone-900 pb-12">
      {/* Toast Notification */}
      {isExportSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-bold">
          <FiCheckCircle className="w-5 h-5 text-emerald-200" />
          <span>Đã xuất file Excel báo cáo doanh thu về máy tính thành công!</span>
        </div>
      )}

      {/* Top Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiTrendingUp className="text-sky-600" /> Báo Cáo Doanh Thu & Kinh Doanh
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Thống kê doanh số thực tế ({orders.length} đơn đã ghi nhận trên hệ thống)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-white border border-sky-200 rounded-xl p-1 text-xs font-semibold shadow-xs">
            {[
              { id: 'today', label: 'Hôm nay' },
              { id: '7days', label: '7 ngày' },
              { id: '30days', label: '30 ngày' },
              { id: 'month', label: 'Tháng này' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === t.id ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <FiDownload className="w-4 h-4" /> Xuất File Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Tổng Doanh Thu</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(currentMetrics.totalRevenue)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            ▲ +14.2% so với kỳ trước
          </span>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Tổng Số Đơn Hàng</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FiShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{currentMetrics.totalOrders} đơn</p>
          <span className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
            ▲ +8.5% tăng trưởng
          </span>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Trung Bình / Đơn</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(currentMetrics.avgOrder)}</p>
          <span className="text-[11px] text-stone-500">Giá trị trung bình mỗi ly trà/bánh</span>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Tỷ Lệ Hoàn Thành</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FiAward className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-700">{currentMetrics.successRate}</p>
          <span className="text-[11px] text-stone-500">Tỷ lệ trả món chuẩn vị thành công</span>
        </div>
      </div>

      {/* Main Charts & Best Sellers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Bar Chart Section (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-sky-100 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">Biểu Đồ Doanh Thu Theo Ngày</h3>
              <p className="text-xs text-stone-500">Doanh số thực tế ghi nhận qua hệ thống POS & Online</p>
            </div>
            <span className="text-xs font-extrabold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              {currentMetrics.label}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-sky-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(d.revenue / 1000000).toFixed(1)}M
                </div>
                <div
                  style={{ height: `${d.heightPct}%` }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-xl group-hover:brightness-110 transition-all shadow-xs"
                />
                <span className="text-[11px] text-stone-600 font-semibold">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Top Products Ranking Section (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-sky-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <FiAward className="text-sky-600" /> Top Sản Phẩm Bán Chạy
            </h3>
            <span className="text-xs text-stone-500">Xếp hạng</span>
          </div>

          <div className="space-y-3">
            {bestSellers.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-3 rounded-xl bg-sky-50/40 border border-sky-100 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                      item.rank === 1
                        ? 'bg-sky-600 text-white'
                        : item.rank === 2
                        ? 'bg-sky-200 text-sky-900'
                        : item.rank === 3
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{item.name}</h4>
                    <p className="text-[10px] text-stone-500">{item.category} • Đã bán {item.sold} ly</p>
                  </div>
                </div>

                <span className="font-extrabold text-sky-800 text-xs">{formatCurrency(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
