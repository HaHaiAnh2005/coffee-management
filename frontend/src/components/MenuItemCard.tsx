import React from 'react';
import type { Product } from '../types';
import { formatVND } from '../utils/formatters';
import { FiPlus, FiAlertTriangle, FiStar } from 'react-icons/fi';

interface MenuItemCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ product, onSelect }) => {
  return (
    <div
      onClick={() => product.isAvailable && onSelect(product)}
      className={`group relative bg-white border border-amber-900/10 rounded-3xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 ${
        product.isAvailable
          ? 'cursor-pointer'
          : 'opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-amber-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur border border-amber-200 text-[10px] font-bold text-amber-800 flex items-center gap-1 shadow-xs">
          <FiStar className="text-amber-500 fill-amber-500" /> 5.0
        </div>
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center gap-1.5 text-white font-bold text-xs">
            <FiAlertTriangle /> Tạm Hết Món
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 flex-1">
        <h3 className="font-bold text-stone-950 text-base line-clamp-1 group-hover:text-amber-800 transition-colors font-product tracking-wide">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* Price & Action */}
      <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between">
        <span className="font-extrabold text-amber-700 text-sm">
          {formatVND(product.price)}
        </span>

        {product.isAvailable && (
          <button className="w-8 h-8 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center font-bold transition-all shadow-md hover:scale-105">
            <FiPlus className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
