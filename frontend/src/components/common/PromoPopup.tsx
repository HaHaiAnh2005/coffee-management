import React, { useState } from 'react';
import { FiX, FiGift } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { formatCurrency } from '../../utils/formatCurrency';
import { useProductStore } from '../../store/product.store';
import { useCartStore } from '../../store/cart.store';
import { ProductOptionModal } from '../ProductOptionModal';
import type { Product } from '../../types';

export const PromoPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useProductStore();
  const { addItem } = useCartStore();

  // Find promo product (Matcha Latte Tây Bắc or Song Nhài Signature or first product)
  const promoProduct = products.find((p) => p.name.includes('Matcha') || p.name.includes('Song Nhài')) || products[0];

  if (!promoProduct) return null;

  const handleBuyNow = () => {
    if (promoProduct && promoProduct.isAvailable) {
      setSelectedProduct(promoProduct);
    }
  };

  return (
    <>
      {/* Floating Minimized Gift Badge when Closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-extrabold hover:scale-105 transition-all cursor-pointer border border-white/30 animate-pulse"
          title="Xem ưu đãi món mới"
        >
          <FiGift className="w-4 h-4 text-amber-200" />
          <span>🎁 Món HOT Hôm Nay</span>
        </button>
      )}

      {/* Main Promo Popup Modal Card (Exact Style of Reference Image) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-[90vw] sm:w-[380px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-6">
          <div className="relative bg-gradient-to-r from-[#ea580c] via-[#e24e23] to-[#c2410c] text-white rounded-3xl p-5 shadow-2xl border border-white/20 overflow-hidden flex items-center justify-between group">
            
            {/* Background Decorative Glow */}
            <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left Content Area */}
            <div className="space-y-3 pr-2 z-10 max-w-[62%]">
              {/* Brand Emblem Icon */}
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                <BsStars className="w-5 h-5 text-amber-200" />
              </div>

              {/* Product Name */}
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight uppercase tracking-wider line-clamp-2">
                  {promoProduct.name.replace(/[🌸🌺🍵☕🍹🧋]/g, '').trim() || 'MATCHA LATTE TÂY BẮC'}
                </h3>
              </div>

              {/* Price Tag */}
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-[11px] opacity-90 italic font-medium">(chỉ)</span>
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight">
                  {formatCurrency(promoProduct.price)}
                </span>
              </div>

              {/* MUA NGAY Action Link/Button */}
              <div>
                <button
                  onClick={handleBuyNow}
                  className="text-white text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1 group-hover:translate-x-1 duration-300"
                >
                  MUA NGAY →
                </button>
              </div>
            </div>

            {/* Right Area: Drink Image & Rotating Decorative Text Badge */}
            <div className="relative shrink-0 w-32 h-32 flex items-center justify-center">
              {/* Rotating Circular Text SVG Overlay */}
              <div className="absolute inset-0 animate-[spin_12s_linear_infinite] pointer-events-none opacity-85">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    fill="none"
                  />
                  <text fill="#ffffff" fontSize="8.5" fontWeight="bold" letterSpacing="2.5">
                    <textPath href="#circlePath">
                      FEATURED PRODUCTS • SIGNATURE DRINK • 
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Product Glass Image */}
              <img
                src={promoProduct.image}
                alt={promoProduct.name}
                className="w-24 h-28 object-contain rounded-2xl drop-shadow-2xl z-10 transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Close Button Badge (Top Right White Circle) */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white text-stone-900 shadow-md flex items-center justify-center hover:scale-110 hover:bg-stone-100 transition-all cursor-pointer"
              title="Đóng thông báo"
            >
              <FiX className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Product Customizer Option Modal */}
      {selectedProduct && (
        <ProductOptionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, size, sugar, ice, options, qty, note) => {
            addItem(prod, size, sugar, ice, options, qty, note);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
};
