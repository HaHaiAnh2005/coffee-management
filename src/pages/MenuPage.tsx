import React, { useState } from 'react';
import { useMenuStore } from '../stores/useMenuStore';
import type { CategoryId } from '../types';
import { formatVND } from '../utils/formatters';
import { FiCoffee, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { ImageDropzone } from '../components/common/ImageDropzone';

export const MenuPage: React.FC = () => {
  const { products, categories, toggleProductAvailability, addProduct, deleteProduct } =
    useMenuStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('coffee');
  const [price, setPrice] = useState(35000);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name: name.trim(),
      categoryId,
      price,
      image:
        image.trim() ||
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      description: description.trim(),
      isAvailable: true,
    });

    setName('');
    setImage('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-100 flex items-center gap-2">
            <FiCoffee className="text-amber-500" /> Quản Lý Thực Đơn (Menu)
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Tổng số món: <span className="font-bold text-stone-200">{products.length}</span>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <FiPlus className="w-4 h-4 stroke-[3]" /> Thêm Món Mới
        </button>
      </div>

      {/* Menu Table List */}
      <div className="bg-white border border-amber-200/80 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-amber-50/80 text-stone-700 text-xs uppercase tracking-wider border-b border-amber-200/80 font-bold">
              <th className="p-4">Hình ảnh & Tên món</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Đơn giá</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 text-xs text-stone-800">
            {products.map((p) => {
              const catName = categories.find((c) => c.id === p.categoryId)?.name || p.categoryId;
              return (
                <tr key={p.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-amber-200" />
                    <div>
                      <p className="font-bold text-stone-900">{p.name}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{p.description}</p>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-stone-600">{catName}</td>
                  <td className="p-4 font-extrabold text-amber-800">{formatVND(p.price)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleProductAvailability(p.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        p.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {p.isAvailable ? <FiToggleRight className="w-4 h-4 text-emerald-700" /> : <FiToggleLeft className="w-4 h-4 text-rose-700" />}
                      <span>{p.isAvailable ? 'Còn Hàng' : 'Tạm Hết'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa món"
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProduct}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-stone-900"
          >
            <h3 className="font-bold text-stone-900 text-base">Thêm Món Mới</h3>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Tên Món Uống / Bánh:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cà Phê Trứng Hà Nội..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Danh Mục:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Giá bán (đ):</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <ImageDropzone value={image} onChange={setImage} />

            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-semibold">Mô tả món:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Nguyên liệu, hương vị..."
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
                Thêm Món
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
