import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateSubtotal } from '../../utils/calculateTotal';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiEdit2 } from 'react-icons/fi';
import { ProductOptionModal } from '../../components/ProductOptionModal';
import type { CartItem } from '../../types/order';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, updateItem, removeItem, clearCart, discount } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const subtotal = calculateSubtotal(items);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-stone-900 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <FiShoppingBag className="text-amber-800" /> Giỏ Hàng Của Bạn
        </h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer">
            <FiTrash2 /> Xóa tất cả
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-amber-200/80 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl mx-auto text-amber-800 border border-amber-200">
            ☕
          </div>
          <p className="text-sm font-bold text-stone-900">Giỏ hàng của bạn đang trống</p>
          <p className="text-xs text-stone-500">Khám phá thực đơn trà hương hoa Bồng Biêng và chọn món ngay!</p>
          <Link to="/menu" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all">
            <span>Xem Thực Đơn</span> <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.cartItemId} className="bg-white border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover border border-amber-200 shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-extrabold text-stone-900 text-sm truncate font-product tracking-wide">{item.product.name}</h3>
                    <p className="text-amber-800 text-xs font-semibold">
                      Size {item.size} • Đường {item.sugarLevel} • {item.iceLevel}
                    </p>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="text-[11px] text-stone-600 flex flex-wrap gap-1">
                        <span className="font-bold text-stone-700">Topping:</span>
                        {item.selectedOptions.map((opt) => (
                          <span key={opt.optionId} className="bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-medium text-[10px]">
                            +{opt.optionName}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.note && <p className="text-[11px] text-stone-500 italic line-clamp-1">Ghi chú: {item.note}</p>}
                    <p className="text-amber-900 text-sm font-black mt-1">{formatCurrency(item.itemTotalPrice)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-100">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-amber-300 shadow-2xs"
                    title="Chỉnh sửa size, đường, đá, topping..."
                  >
                    <FiEdit2 className="w-3.5 h-3.5" /> <span>Sửa</span>
                  </button>

                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-7 h-7 rounded text-stone-700 bg-white hover:bg-amber-100 flex items-center justify-center font-bold cursor-pointer">
                      <FiMinus />
                    </button>
                    <span className="w-6 text-center font-bold text-xs text-stone-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-7 h-7 rounded text-stone-700 bg-white hover:bg-amber-100 flex items-center justify-center font-bold cursor-pointer">
                      <FiPlus />
                    </button>
                  </div>

                  <button onClick={() => removeItem(item.cartItemId)} className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer" title="Xóa món">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-amber-200/80 rounded-2xl p-5 space-y-4 h-fit shadow-xs">
            <h3 className="font-extrabold text-stone-900 text-sm border-b border-amber-100 pb-2">Tóm Tắt Đơn Hàng</h3>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="text-stone-900 font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-amber-100 pt-2 font-black text-stone-900 text-sm">
                <span>Tổng cộng:</span>
                <span className="text-amber-800 text-base">{formatCurrency(total)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer">
              <span>Tiến Hành Đặt Hàng & Thanh Toán</span> <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <ProductOptionModal
          product={editingItem.product}
          editingCartItem={editingItem}
          onClose={() => setEditingItem(null)}
          onAddToCart={() => {}}
          onUpdateItem={(oldId, p, size, sugar, ice, options, qty, note, discountAmt) => {
            updateItem(oldId, p, size, sugar, ice, options, qty, note, discountAmt);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};
