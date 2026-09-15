import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../store/product.store';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Product } from '../../types';
import { FiCoffee, FiPlus, FiTrash2, FiEdit2, FiToggleLeft, FiToggleRight, FiSearch, FiFilter, FiBookOpen } from 'react-icons/fi';
import { ImageDropzone } from '../../components/common/ImageDropzone';
import { getProductStoryDetail } from '../../utils/productStories';

export const Products: React.FC = () => {
  const { products, categories, toggleAvailability, addProduct, updateProduct, deleteProduct } = useProductStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [filterCategory, setFilterCategory] = useState(categoryParam || 'all');
  const [search, setSearch] = useState('');

  // Sync category filter when URL search params change
  useEffect(() => {
    if (categoryParam) {
      setFilterCategory(categoryParam);
    } else {
      setFilterCategory('all');
    }
  }, [categoryParam]);

  const handleSelectCategoryFilter = (catId: string) => {
    setFilterCategory(catId);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'tea_flower');
  const [price, setPrice] = useState(55000);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [origin, setOrigin] = useState('');
  const [servingSuggestion, setServingSuggestion] = useState('');
  const [aromaNotesInput, setAromaNotesInput] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || 'tea_flower');
    setPrice(55000);
    setImage('');
    setDescription('');
    setStory('');
    setOrigin('');
    setServingSuggestion('');
    setAromaNotesInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    const storyDetail = getProductStoryDetail(p);
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setImage(p.image);
    setDescription(p.description || '');
    setStory(p.story || storyDetail.story);
    setOrigin(p.origin || storyDetail.origin);
    setServingSuggestion(p.servingSuggestion || storyDetail.servingSuggestion);
    setAromaNotesInput((p.aromaNotes || storyDetail.aromaNotes).join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const imgUrl = image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80';
    const notesArray = aromaNotesInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        categoryId,
        price,
        image: imgUrl,
        description,
        story,
        origin,
        servingSuggestion,
        aromaNotes: notesArray,
      });
    } else {
      addProduct({
        name,
        categoryId,
        price,
        image: imgUrl,
        description,
        story,
        origin,
        servingSuggestion,
        aromaNotes: notesArray,
        isAvailable: true,
      });
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.categoryId === filterCategory;
    const matchesSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-stone-900">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiCoffee className="text-sky-600" /> Quản Lý Thực Đơn Quán (Menu Management)
          </h1>
          <p className="text-xs text-stone-500">Thêm, sửa, xóa, bật/tắt kinh doanh và tùy chỉnh Câu Chuyện Hương Vị nghệ thuật</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <FiPlus className="stroke-[3]" /> Thêm Món Mới
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-sky-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => handleSelectCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-sky-600 text-white border-sky-600 font-extrabold shadow-xs'
                : 'bg-sky-50/50 border-sky-200 text-stone-700 hover:bg-sky-100'
            }`}
          >
            <FiFilter className="inline mr-1" /> Tất cả ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                filterCategory === c.id
                  ? 'bg-sky-600 text-white border-sky-600 font-extrabold shadow-xs'
                  : 'bg-sky-50/50 border-sky-200 text-stone-700 hover:bg-sky-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên món..."
            className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-sky-50/80 text-stone-700 uppercase tracking-wider border-b border-sky-100 font-bold">
              <th className="p-4">Hình ảnh & Tên món</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Trạng thái kinh doanh</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 text-stone-800">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-sky-50/40 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-sky-200" />
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">{p.name}</span>
                    <span className="text-[11px] text-stone-500 line-clamp-1">{p.description || p.story}</span>
                  </div>
                </td>
                <td className="p-4 font-semibold text-stone-600">
                  {categories.find((c) => c.id === p.categoryId)?.name || p.categoryId}
                </td>
                <td className="p-4 font-extrabold text-sky-800 text-sm">{formatCurrency(p.price)}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleAvailability(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold cursor-pointer transition-all ${
                      p.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                    }`}
                  >
                    {p.isAvailable ? <FiToggleRight className="w-4 h-4 text-emerald-700" /> : <FiToggleLeft className="w-4 h-4 text-rose-700" />}
                    <span>{p.isAvailable ? 'Đang Bán' : 'Tạm Ngưng'}</span>
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold transition-colors cursor-pointer"
                    title="Sửa món & Câu chuyện hương vị"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc chắn muốn xóa món "${p.name}"?`)) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-stone-500 transition-colors cursor-pointer"
                    title="Xóa món"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl text-stone-900 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <FiBookOpen className="text-sky-600" />
                <span>{editingProduct ? `Chỉnh Sửa Món: ${editingProduct.name}` : 'Thêm Món Mới Vào Menu'}</span>
              </h3>
              <span className="text-[11px] font-extrabold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
                ADMIN EDITOR
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-bold">Tên món thức uống / bánh:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Trà Nhài Mộc Bồng Biêng..."
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-stone-700 font-bold">Danh mục:</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-700 font-bold">Giá bán Size M (VNĐ):</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Drag & Drop Image Field */}
            <ImageDropzone value={image} onChange={setImage} />

            {/* Short Description */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-bold">Mô tả ngắn (Hiển thị thẻ menu):</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nguyên liệu ngắn gọn..."
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Dedicated Long Flavor Story Field */}
            <div className="space-y-1 pt-2 border-t border-sky-100">
              <label className="text-xs text-sky-900 font-extrabold flex items-center justify-between">
                <span>📖 CÂU CHUYỆN HƯƠNG VỊ BỒNG BIÊNG (Văn học chém nghệ thuật):</span>
                <span className="text-[10px] text-sky-700 font-normal">Hiển thị ở Modal Đặt Món & Trang Chi Tiết</span>
              </label>
              <textarea
                rows={5}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Nhập đoạn văn kể chuyện hương vị dài nghệ thuật (có thể dùng 2 đoạn văn cách dòng)..."
                className="w-full bg-sky-50/50 border border-sky-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-sky-600 leading-relaxed font-medium"
              />
            </div>

            {/* Origin & Serving Suggestion Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-stone-700 font-bold">🌾 Nguồn Gốc Nguyên Liệu:</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="VD: Trà Ô long Lâm Đồng & Nho xanh Mẫu Đơn..."
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-700 font-bold">☕ Gợi Ý Thưởng Thức:</label>
                <input
                  type="text"
                  value={servingSuggestion}
                  onChange={(e) => setServingSuggestion(e.target.value)}
                  placeholder="VD: Uống lạnh vừa đá nghiêng ly 45 độ..."
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Aroma Notes Input */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-bold">✦ Nốt Hương Độc Đáo (Phân cách bằng dấu phẩy):</label>
              <input
                type="text"
                value={aromaNotesInput}
                onChange={(e) => setAromaNotesInput(e.target.value)}
                placeholder="VD: Hương nhài sương sớm, Sữa béo dịu, Hậu vị ngọt sâu"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-sky-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {editingProduct ? 'Lưu Thay Đổi Món' : 'Thêm Món Mới'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
