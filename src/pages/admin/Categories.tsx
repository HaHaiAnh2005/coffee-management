import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuStore } from '../../stores/useMenuStore';
import type { Category } from '../../types';
import {
  FiGrid,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiList,
  FiCoffee,
  FiLayers,
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi';

const QUICK_EMOJIS = ['☕', '🧋', '☁️', '🧀', '🥜', '🍹', '🍇', '🥐', '🍵', '🍰', '🧃', '🧊'];

const getCleanIcon = (icon?: string) => {
  if (!icon || icon.startsWith('Fi')) {
    switch (icon) {
      case 'FiFeather':
        return '🧋';
      case 'FiSmile':
        return '☁️';
      case 'FiZap':
        return '🧀';
      case 'FiCoffee':
        return '🥜';
      case 'FiPieChart':
        return '🥐';
      default:
        return '☕';
    }
  }
  return icon;
};

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { categories, products, addCategory, updateCategory, deleteCategory } = useMenuStore();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete modal states
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form states
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('☕');
  const [catDesc, setCatDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCatId(`cat_${Date.now().toString().slice(-4)}`);
    setCatName('');
    setCatIcon('☕');
    setCatDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatId(cat.id);
    setCatName(cat.name);
    setCatIcon(getCleanIcon(cat.icon));
    setCatDesc(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: catName,
        icon: catIcon,
        description: catDesc,
      });
      showToast(`Đã cập nhật danh mục "${catName}"!`);
    } else {
      await addCategory({
        id: catId.trim() || `cat_${Date.now()}`,
        name: catName,
        icon: catIcon,
        description: catDesc,
      });
      showToast(`Đã thêm danh mục mới "${catName}"!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    const catNameDeleted = deletingCategory.name;
    await deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
    showToast(`Đã xóa danh mục "${catNameDeleted}"!`);
  };

  // Filtered categories
  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  // Calculate product counts per category
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  const totalProducts = products.length;
  const topCategory = [...categories].sort(
    (a, b) => getProductCount(b.id) - getProductCount(a.id)
  )[0];

  return (
    <div className="space-y-6 text-stone-900 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-sky-500/30 animate-in fade-in slide-in-from-top-4">
          <FiCheckCircle className="text-emerald-400 w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiGrid className="text-sky-600" /> Quản Lý Danh Mục (Category Management)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý các nhóm phân loại sản phẩm, biểu tượng đại diện và cấu trúc menu quán
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <FiPlus className="stroke-[3]" /> Thêm Danh Mục Mới
        </button>
      </div>

      {/* Stats Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Tổng Danh Mục</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5">{categories.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
            <FiLayers />
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Tổng Sản Phẩm Menu</p>
            <h3 className="text-2xl font-black text-sky-800 mt-0.5">{totalProducts} món</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            <FiCoffee />
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Danh Mục Nhiều Món Nhất</p>
            <h3 className="text-sm font-extrabold text-stone-900 mt-0.5 line-clamp-1">
              {topCategory ? topCategory.name : 'Chưa có'}
            </h3>
            <p className="text-[11px] text-sky-700 font-bold">
              {topCategory ? `${getProductCount(topCategory.id)} sản phẩm` : ''}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shrink-0">
            🏆
          </div>
        </div>
      </div>

      {/* Filter, Search & View Switcher Bar */}
      <div className="bg-white border border-sky-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên danh mục hoặc mã ID..."
            className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1 bg-sky-50/80 p-1 rounded-xl border border-sky-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FiGrid className="w-3.5 h-3.5" /> Dạng Thẻ
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FiList className="w-3.5 h-3.5" /> Dạng Bảng
          </button>
        </div>
      </div>

      {/* Display Categories: Grid View vs Table View */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white border border-sky-100 rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm font-bold text-stone-800">Không tìm thấy danh mục nào phù hợp</p>
          <p className="text-xs text-stone-500">Thử tìm kiếm với từ khóa khác hoặc bấm Thêm Danh Mục Mới.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const count = getProductCount(cat.id);
            const cleanIcon = getCleanIcon(cat.icon);
            return (
              <div
                key={cat.id}
                className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 text-sky-800 flex items-center justify-center font-bold text-2xl shadow-xs group-hover:scale-105 transition-transform">
                      {cleanIcon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm">{cat.name}</h3>
                      <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 inline-block mt-0.5">
                        ID: {cat.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold transition-colors cursor-pointer"
                      title="Chỉnh sửa danh mục"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-2 rounded-lg bg-stone-50 hover:bg-rose-600 hover:text-white text-stone-500 transition-colors cursor-pointer"
                      title="Xóa danh mục"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}

                <div className="pt-3 border-t border-sky-50 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/admin/products?category=${cat.id}`)}
                    className="text-xs font-bold text-sky-900 bg-sky-100/70 hover:bg-sky-200 px-2.5 py-1 rounded-full border border-sky-200 transition-colors cursor-pointer"
                    title={`Xem ${count} sản phẩm thuộc danh mục này`}
                  >
                    {count} sản phẩm
                  </button>

                  <button
                    onClick={() => navigate(`/admin/products?category=${cat.id}`)}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Xem danh sách món</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-sky-50/80 text-stone-700 uppercase tracking-wider border-b border-sky-100 font-bold">
                <th className="p-4">Danh Mục & Biểu Tượng</th>
                <th className="p-4">Mã ID</th>
                <th className="p-4">Mô Tả</th>
                <th className="p-4">Số Lượng Món</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-stone-800">
              {filteredCategories.map((cat) => {
                const count = getProductCount(cat.id);
                const cleanIcon = getCleanIcon(cat.icon);
                return (
                  <tr key={cat.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-4 flex items-center gap-3 font-bold text-stone-900">
                      <span className="text-xl bg-sky-100/80 p-2 rounded-xl border border-sky-200">
                        {cleanIcon}
                      </span>
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4 font-mono text-sky-800 text-[11px] font-bold">{cat.id}</td>
                    <td className="p-4 text-stone-500 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/admin/products?category=${cat.id}`)}
                        className="font-extrabold text-sky-800 bg-sky-100 hover:bg-sky-200 px-2.5 py-0.5 rounded-full border border-sky-200 cursor-pointer transition-colors"
                      >
                        {count} món
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-2 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-stone-500 transition-colors cursor-pointer"
                        title="Xóa"
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
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <FiGrid className="text-sky-600" />
                <span>{editingCategory ? `Sửa Danh Mục: ${editingCategory.name}` : 'Thêm Danh Mục Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Category ID (Editable for new, disabled for edit) */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-bold">Mã Định Danh (Category ID):</label>
              <input
                type="text"
                required
                disabled={!!editingCategory}
                value={catId}
                onChange={(e) => setCatId(e.target.value)}
                placeholder="VD: tea_flower, cloud_cream..."
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 disabled:opacity-60 disabled:bg-stone-100 font-mono"
              />
            </div>

            {/* Category Name */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-bold">Tên Danh Mục Hiển Thị:</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="VD: 🧋 TRÀ SỮA HƯƠNG HOA..."
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Emoji / Icon Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-stone-700 font-bold">Biểu Tượng / Emoji Đại Diện:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  placeholder="Emoji..."
                  className="w-20 bg-sky-50/40 border border-sky-200 rounded-xl text-center py-2 text-base font-bold focus:outline-none focus:border-sky-500"
                />
                <div className="flex-1 flex flex-wrap gap-1.5 bg-sky-50/40 p-2 rounded-xl border border-sky-100">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCatIcon(emoji)}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                        catIcon === emoji ? 'bg-sky-200 border border-sky-400 shadow-xs' : 'hover:bg-sky-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-bold">Mô Tả Danh Mục (Tùy chọn):</label>
              <textarea
                rows={3}
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Mô tả ngắn gọn dòng sản phẩm thuộc danh mục này..."
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Modal Buttons */}
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
                {editingCategory ? 'Lưu Thay Đổi' : 'Thêm Danh Mục'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold text-lg shrink-0">
                <FiAlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Xác Nhận Xóa Danh Mục</h3>
                <p className="text-xs text-stone-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-xs space-y-2">
              <p className="font-bold text-stone-800">
                Bạn có chắc chắn muốn xóa danh mục <span className="text-rose-700 font-extrabold">"{deletingCategory.name}"</span>?
              </p>
              {getProductCount(deletingCategory.id) > 0 && (
                <div className="p-2.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold flex items-center gap-2">
                  <span>⚠️ Cảnh báo:</span>
                  <span>Đang có {getProductCount(deletingCategory.id)} sản phẩm thuộc danh mục này!</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Xóa Danh Mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

