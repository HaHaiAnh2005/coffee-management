import React, { useState } from 'react';
import { INITIAL_COUPONS, type Coupon, type MembershipTier } from '../../api/coupon.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiGift, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiClock, FiTag, FiShield } from 'react-icons/fi';

export const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountValue: 20000,
    discountType: 'fixed' as 'fixed' | 'percent',
    minOrderValue: 50000,
    expiryDate: '2026-12-31',
    status: 'active' as 'active' | 'expired',
    minTier: 'Tất cả' as MembershipTier,
  });

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: 'BONG' + Math.floor(10 + Math.random() * 90) + 'K',
      title: 'Khuyến Mãi Mới',
      description: 'Ưu đãi dành cho thành viên',
      discountValue: 20000,
      discountType: 'fixed',
      minOrderValue: 50000,
      expiryDate: '2026-12-31',
      status: 'active',
      minTier: 'Tất cả',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cp: Coupon) => {
    setEditingCoupon(cp);
    setFormData({
      code: cp.code,
      title: cp.title || '',
      description: cp.description || '',
      discountValue: cp.discountValue,
      discountType: cp.discountType,
      minOrderValue: cp.minOrderValue,
      expiryDate: cp.expiryDate,
      status: cp.status,
      minTier: cp.minTier || 'Tất cả',
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(
      coupons.map((cp) =>
        cp.id === id ? { ...cp, status: cp.status === 'active' ? 'expired' : 'active' } : cp
      )
    );
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
      setCoupons(coupons.filter((cp) => cp.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;

    if (editingCoupon) {
      // Edit
      setCoupons(
        coupons.map((cp) =>
          cp.id === editingCoupon.id
            ? {
                ...cp,
                code: formData.code.toUpperCase(),
                title: formData.title,
                description: formData.description,
                discountValue: formData.discountValue,
                discountType: formData.discountType,
                minOrderValue: formData.minOrderValue,
                expiryDate: formData.expiryDate,
                status: formData.status,
                minTier: formData.minTier,
              }
            : cp
        )
      );
    } else {
      // Create new
      const newCp: Coupon = {
        id: `CP_${Date.now()}`,
        code: formData.code.toUpperCase(),
        title: formData.title,
        description: formData.description,
        discountValue: formData.discountValue,
        discountType: formData.discountType,
        minOrderValue: formData.minOrderValue,
        expiryDate: formData.expiryDate,
        status: formData.status,
        minTier: formData.minTier,
      };
      setCoupons([...coupons, newCp]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-stone-900 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiGift className="text-sky-600" /> Quản Lý Mã Giảm Giá & Voucher
          </h1>
          <p className="text-xs text-stone-500 mt-1">Tạo khuyến mãi, tùy chỉnh hạn sử dụng & bật/tắt trạng thái voucher</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <FiPlus className="stroke-[3]" /> Tạo Mã Giảm Giá Mới
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((cp) => (
          <div
            key={cp.id}
            className={`bg-white border rounded-2xl p-5 space-y-4 shadow-sm transition-all duration-300 relative ${
              cp.status === 'active' ? 'border-sky-100 hover:border-sky-300' : 'border-stone-200 opacity-70'
            }`}
          >
            {/* Header: Code & Status */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold font-mono">
                    MÃ VOUCHER
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-bold flex items-center gap-1">
                    <FiShield className="w-3 h-3 text-sky-600" />
                    {cp.minTier || 'Tất cả'}
                  </span>
                </div>
                <h3 className="font-black text-sky-700 text-xl font-mono mt-1 tracking-wider">{cp.code}</h3>
                {cp.title && <p className="text-xs font-bold text-stone-800 mt-0.5">{cp.title}</p>}
              </div>

              {/* Status Badge Toggle Button */}
              <button
                onClick={() => handleToggleStatus(cp.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  cp.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                }`}
                title="Nhấn để đổi trạng thái Còn hạn / Hết hạn"
              >
                <FiClock className="w-3 h-3" />
                {cp.status === 'active' ? 'Còn Hạn' : 'Hết Hạn'}
              </button>
            </div>

            {/* Discount Info */}
            <div className="space-y-1 bg-sky-50/50 p-3 rounded-xl border border-sky-100 text-xs">
              <div className="flex justify-between font-bold text-stone-800">
                <span>Mức giảm:</span>
                <span className="text-emerald-700 text-sm">
                  {cp.discountType === 'fixed' ? formatCurrency(cp.discountValue) : `Giảm ${cp.discountValue}%`}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Hạng áp dụng:</span>
                <span className="font-bold text-sky-700">{cp.minTier || 'Tất cả'}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Đơn tối thiểu:</span>
                <span className="font-semibold">{formatCurrency(cp.minOrderValue)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Hạn sử dụng:</span>
                <span className="font-semibold text-stone-800 font-mono">{cp.expiryDate}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-sky-100">
              <span className="text-[11px] text-stone-400 font-mono">ID: {cp.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(cp)}
                  className="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FiEdit2 className="w-3 h-3" /> Sửa
                </button>
                <button
                  onClick={() => handleDeleteCoupon(cp.id)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-stone-500 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FiTrash2 className="w-3 h-3" /> Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <FiTag className="text-sky-600" />
                {editingCoupon ? 'Chỉnh Sửa Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Mã Khuyến Mãi (Code):</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: BONG20K, CHAOSANG..."
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-sky-800 font-mono font-bold focus:outline-none focus:border-sky-500 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Hạng Thành Viên Áp Dụng:</label>
                <select
                  value={formData.minTier}
                  onChange={(e) => setFormData({ ...formData, minTier: e.target.value as MembershipTier })}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold focus:outline-none focus:border-sky-500"
                >
                  <option value="Tất cả">🥉 Tất cả thành viên (Mới/Đồng/Bạc/Vàng/Kim Cương)</option>
                  <option value="Bạc">🥈 Dành cho Hạng Bạc trở lên</option>
                  <option value="Vàng">🥇 Dành riêng Hạng Vàng trở lên</option>
                  <option value="Kim Cương">💎 Độc quyền Hạng Kim Cương VIP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Loại giảm giá:</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="fixed">Tiền mặt cố định (VND)</option>
                    <option value="percent">Theo Phần Trăm (%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Giá trị giảm:</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Đơn tối thiểu (VND):</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Hạn sử dụng:</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Trạng thái mã:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="active">Còn Hạn (Hoạt động)</option>
                  <option value="expired">Hết Hạn (Vô hiệu hóa)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-sky-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md"
                >
                  <FiCheck className="stroke-[3]" /> Lưu Mã Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
