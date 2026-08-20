import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/product.store';
import { useCartStore } from '../../store/cart.store';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../../data/mockData';
import { ProductOptionModal } from '../../components/ProductOptionModal';
import type { Product } from '../../types';
import { FiSearch, FiSliders, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { BannerCarousel } from '../../components/common/BannerCarousel';

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useProductStore();
  const { items, addItem } = useCartStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  // Auto detect old cached products in browser and instantly replace with 22 new Bồng Biêng items
  useEffect(() => {
    const hasOldData = products.some((p) => p.id.startsWith('P') || p.categoryId === 'coffee');
    if (hasOldData || products.length < 20) {
      useProductStore.setState({
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        selectedCategoryId: 'all',
        selectedCategory: 'all',
      });
    }
  }, [products]);

  const displayProducts = INITIAL_PRODUCTS;
  const displayCategories = INITIAL_CATEGORIES;

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  // Filter products by selected category and search query
  let filteredProducts = displayProducts.filter((p) => {
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
    <div className="space-y-10 pb-24 bg-[#FBF7F0] -mx-6 -mt-6 p-6 min-h-screen">
      {/* Top Banner Slider */}
      <BannerCarousel />

      {/* Luxury Showcase Header & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
        <div className="space-y-1 text-stone-900">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
              ❀ 88 BỒNG BIÊNG SHOWCASE MENU
            </span>
            <button
              type="button"
              onClick={() => {
                useProductStore.setState({
                  products: INITIAL_PRODUCTS,
                  categories: INITIAL_CATEGORIES,
                  selectedCategoryId: 'all',
                  selectedCategory: 'all',
                });
              }}
              className="text-[10px] font-extrabold bg-amber-200/80 hover:bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300 transition-all cursor-pointer shadow-2xs"
              title="Khôi phục lại 22 món dệt hương Bồng Biêng chuẩn"
            >
              🔄 Tải lại 22 món Bồng Biêng
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-950 font-product tracking-wide">
            Thực Đơn Thưởng Thức Bồng Biêng
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Cappuccino, Trà nhài..."
              className="w-full bg-white border border-amber-900/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-amber-900/15 rounded-xl px-3 py-2.5 text-xs text-stone-700 shadow-2xs">
            <FiSliders className="text-amber-700" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-stone-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="default">Sắp xếp</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Luxury Category Navigation Bar */}
      <div className="border-b border-amber-900/15 pb-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-8 md:gap-12 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-sm md:text-base font-extrabold tracking-wider uppercase transition-all relative pb-2 cursor-pointer ${selectedCategory === 'all'
              ? 'text-stone-950 font-black'
              : 'text-stone-500 hover:text-stone-800'
              }`}
          >
            <span>TẤT CẢ MÓN</span>
            <sup className="text-[10px] font-bold text-amber-800 ml-0.5">{displayProducts.length}</sup>
            {selectedCategory === 'all' && (
              <span className="absolute left-0 right-0 bottom-0 h-[2.5px] bg-stone-950 rounded-full" />
            )}
          </button>

          {INITIAL_CATEGORIES.map((cat) => {
            const count = displayProducts.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-sm md:text-base font-extrabold tracking-wider uppercase transition-all relative pb-2 cursor-pointer ${isSelected
                  ? 'text-stone-950 font-black'
                  : 'text-stone-500 hover:text-stone-800'
                  }`}
              >
                <span>{cat.name}</span>
                <sup className="text-[10px] font-bold text-amber-800 ml-0.5">{count}</sup>
                {isSelected && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2.5px] bg-stone-950 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Drink & Pastry Items Grid */}
      <div className="py-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-stone-500 space-y-2">
            <p className="text-base font-bold text-stone-800">Không tìm thấy món ăn/thức uống phù hợp.</p>
            <p className="text-xs">Vui lòng thử từ khóa khác hoặc chọn danh mục khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
            {filteredProducts.map((product) => {
              const isMustTry = ['M101', 'M503'].includes(product.id);
              const isNew = ['M501', 'M502'].includes(product.id);
              const catObj = INITIAL_CATEGORIES.find((c) => c.id === product.categoryId);

              return (
                <div
                  key={product.id}
                  onClick={() => product.isAvailable && navigate(`/product/${product.id}`)}
                  className={`group flex flex-col items-center text-center space-y-3 cursor-pointer p-4 rounded-3xl transition-all duration-500 hover:bg-white/60 hover:shadow-lg relative ${
                    !product.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {/* Must Try / New Badge */}
                  {isMustTry && (
                    <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-amber-600 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-1">
                      ⭐ MUST TRY
                    </span>
                  )}
                  {isNew && (
                    <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-1">
                      🆕 MÓN MỚI
                    </span>
                  )}

                  {/* Floating Drink Glass Container */}
                  <div className="relative w-full aspect-square max-w-[200px] flex items-center justify-center mx-auto">
                    <div className="absolute inset-1 rounded-full bg-[#f4ebd9] group-hover:scale-105 transition-transform duration-500 shadow-inner border border-amber-900/10" />

                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden z-10 shadow-md border-2 border-white/90">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Tag / Category Subtitle */}
                  <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                    {catObj?.name || 'Bồng Biêng Special'}
                  </span>

                  {/* Main Product Title */}
                  <h3 className="font-extrabold text-stone-900 text-lg md:text-xl font-product tracking-wide line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price Tag & Size Pricing */}
                  <div className="pt-1 flex flex-col items-center gap-1">
                    <span className="font-extrabold text-[#e05326] text-lg tracking-tight">
                      {product.categoryId === 'pastry'
                        ? `${product.price.toLocaleString('vi-VN')} đ`
                        : `M: ${product.price.toLocaleString('vi-VN')}đ • L: ${(product.price + 10000).toLocaleString('vi-VN')}đ`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                      <span>🎁 Voucher Hạng TV</span>
                      <span className="text-amber-700 font-extrabold">-10K ~ -50K</span>
                    </span>
                  </div>

                  {/* Quick Add & Detail Buttons */}
                  {product.isAvailable && (
                    <div className="flex items-center gap-2 mt-2 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        <FiPlus /> Đặt Món
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-800 border border-stone-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Floating Cart Summary Bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92vw] bg-stone-900 text-white rounded-full p-2.5 px-5 shadow-2xl flex items-center justify-between border border-amber-500/30 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg font-bold">
              <FiShoppingBag />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900">
                {cartItemsCount}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-stone-400 font-medium">Đơn hàng của bạn</p>
              <p className="text-amber-400 font-extrabold text-sm md:text-base">
                {cartTotalPrice.toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs tracking-wide shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Xem Giỏ Hàng & Thanh Toán</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Product Option Customizer Modal */}
      {selectedProduct && (
        <ProductOptionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, size, sugar, ice, options, qty, note, discountAmt) => {
            addItem(p, size, sugar, ice, options, qty, note, discountAmt);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};
