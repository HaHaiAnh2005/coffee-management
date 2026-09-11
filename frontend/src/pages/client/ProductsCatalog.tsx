import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/product.store';
import { useCartStore } from '../../store/cart.store';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatCurrency';
import { ProductOptionModal } from '../../components/ProductOptionModal';
import type { Product } from '../../types';
import { FiSearch, FiSliders } from 'react-icons/fi';

export const ProductsCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useProductStore();
  const { addItem } = useCartStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  let filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesQuery = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#a3c7e4] via-[#b6d5ed] to-[#c7e0f2] border border-[#8eb7d8] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-stone-900">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-800">
            ❀ CATALÓG SẢN PHẨM BỒNG BIÊNG
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Tất Cả Sản Phẩm Trà & Bánh</h1>
          <p className="text-xs text-stone-700">Dễ dàng lọc theo từng dòng sản phẩm và tìm kiếm thức uống yêu thích</p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên..."
              className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#2b6ba4]"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-700 w-full sm:w-auto">
            <FiSliders className="text-[#2b6ba4]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-stone-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
          }`}
        >
          Tất Cả ({products.length})
        </button>
        {INITIAL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-[#a3c7e4] border-[#8eb7d8] text-stone-900 font-extrabold shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => p.isAvailable && navigate(`/product/${p.id}`)}
            className={`bg-white border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 group ${
              !p.isAvailable && 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="relative rounded-xl overflow-hidden h-48 bg-amber-50">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-1">
              <Link
                to={`/product/${p.id}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-stone-950 text-base line-clamp-1 hover:text-amber-800 transition-colors block font-product tracking-wide"
              >
                {p.name}
              </Link>
              <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">{p.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-amber-100 gap-2">
              <div>
                <span className="font-extrabold text-amber-800 text-sm block">{formatCurrency(p.price)}</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">
                  🎁 Voucher Hạng TV
                </span>
              </div>
              {p.isAvailable ? (
                <Link
                  to={`/product/${p.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105"
                >
                  Xem món
                </Link>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-400 text-[11px]">Hết món</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <ProductOptionModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, size, sugar, ice, options, qty, note, discountAmt) => {
          addItem(p, size, sugar, ice, options, qty, note, discountAmt);
        }}
      />
    </div>
  );
};
