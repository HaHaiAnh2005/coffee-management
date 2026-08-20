import React, { useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { FiSettings, FiCheckCircle } from 'react-icons/fi';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const [formState, setFormState] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <FiSettings className="text-sky-600" /> Cài Đặt Thông Tin Quán & Ngân Hàng
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Cấu hình thông tin cửa hàng hiển thị trên hóa đơn và tài khoản nhận thanh toán VietQR.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheckCircle className="w-4 h-4" /> Đã lưu thông tin cài đặt thành công!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-sky-100 rounded-2xl p-6 space-y-5 shadow-sm">
        <h3 className="font-bold text-stone-900 text-sm border-b border-sky-100 pb-2">
          1. Thông Tin Cửa Hàng (Hiển thị trên hóa đơn)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Tên Quán Cà Phê:</label>
            <input
              type="text"
              value={formState.storeName}
              onChange={(e) => setFormState({ ...formState, storeName: e.target.value })}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Số điện thoại liên hệ:</label>
            <input
              type="text"
              value={formState.phone}
              onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Địa chỉ quán:</label>
            <input
              type="text"
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <h3 className="font-bold text-stone-900 text-sm border-b border-sky-100 pb-2 pt-2">
          2. Tài Khoản Ngân Hàng (Tạo mã VietQR tự động)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Tên Ngân Hàng (vd: MBBank, Vietcombank):</label>
            <input
              type="text"
              value={formState.bankName}
              onChange={(e) => setFormState({ ...formState, bankName: e.target.value })}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Số tài khoản:</label>
            <input
              type="text"
              value={formState.bankAccountNo}
              onChange={(e) => setFormState({ ...formState, bankAccountNo: e.target.value })}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-600 font-semibold">Tên chủ tài khoản (viết hoa không dấu):</label>
            <input
              type="text"
              value={formState.bankAccountName}
              onChange={(e) => setFormState({ ...formState, bankAccountName: e.target.value })}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            Lưu Cấu Hình
          </button>
        </div>
      </form>
    </div>
  );
};
