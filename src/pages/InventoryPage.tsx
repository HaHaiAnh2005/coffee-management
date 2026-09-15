import React, { useState } from 'react';
import { useInventoryStore } from '../stores/useInventoryStore';
import { formatDate } from '../utils/formatters';
import { FiBox, FiPlus, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

export const InventoryPage: React.FC = () => {
  const { items, updateQuantity, addItem, deleteItem } = useInventoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('Kg');
  const [quantity, setQuantity] = useState(10);
  const [minAlertThreshold, setMinAlertThreshold] = useState(3);
  const [category, setCategory] = useState('Cà phê hạt');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addItem({
      name: name.trim(),
      unit: unit.trim(),
      quantity,
      minAlertThreshold,
      category: category.trim(),
    });

    setName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-100 flex items-center gap-2">
            <FiBox className="text-amber-500" /> Quản Lý Kho & Nguyên Liệu
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Tổng mặt hàng nguyên liệu: <span className="font-bold text-stone-200">{items.length}</span>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <FiPlus className="w-4 h-4 stroke-[3]" /> Thêm Nguyên Liệu
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-amber-200/80 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-amber-50/80 text-stone-700 text-xs uppercase tracking-wider border-b border-amber-200/80 font-bold">
              <th className="p-4">Tên nguyên liệu</th>
              <th className="p-4">Phân loại</th>
              <th className="p-4">Số lượng tồn</th>
              <th className="p-4">Ngưỡng cảnh báo</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Cập nhật lần cuối</th>
              <th className="p-4 text-right">Điều chỉnh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 text-xs text-stone-800">
            {items.map((item) => {
              const isLowStock = item.quantity <= item.minAlertThreshold;
              return (
                <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="p-4 font-bold text-stone-900">{item.name}</td>
                  <td className="p-4 text-stone-600">{item.category}</td>
                  <td className="p-4 font-extrabold text-amber-800 text-sm">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="p-4 text-stone-500">
                    &lt;= {item.minAlertThreshold} {item.unit}
                  </td>
                  <td className="p-4">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full animate-pulse">
                        <FiAlertCircle /> Sắp Hết Kho
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                        An Toàn
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-stone-500">{formatDate(item.lastUpdated)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 5)}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold"
                    >
                      +5 {item.unit}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Inventory Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddItem}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-stone-900"
          >
            <h3 className="font-bold text-stone-900 text-base">Thêm Nguyên Liệu Mới</h3>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Tên Nguyên Liệu:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Hạt Cà Phê Robusta, Sữa Tươi..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Đơn vị tính:</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Kg, Lít, Hộp, Cái..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Số lượng nhập ban đầu:</label>
              <input
                type="number"
                required
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Ngưỡng cảnh báo hết kho:</label>
              <input
                type="number"
                required
                min={0}
                value={minAlertThreshold}
                onChange={(e) => setMinAlertThreshold(Number(e.target.value))}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Phân loại kho:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Cà phê hạt, Sữa & Bơ, Trà & Bột..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md"
              >
                Thêm Vào Kho
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
