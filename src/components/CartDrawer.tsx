import React, { useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { formatVND } from '../utils/formatters';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiEdit2, FiShield } from 'react-icons/fi';
import { ProductOptionModal } from './ProductOptionModal';
import type { CartItem } from '../types';

interface CartDrawerProps {
  onCheckout: () => void;
  onRequestOverride?: (
    title: string,
    details: string,
    type: 'ITEM_CANCEL' | 'DISCOUNT_OVERRIDE',
    targetId: string,
    onSuccess: () => void
  ) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onRequestOverride }) => {
  const {
    items,
    selectedTableName,
    isTakeaway,
    discount,
    setDiscount,
    updateQuantity,
    updateItem,
    removeItem,
    clearCart,
    getSubtotal,
    getTotal,
  } = useCartStore();

  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const subtotal = getSubtotal();
  const total = getTotal();

  const handleRemoveItemWithOverride = (item: CartItem) => {
    if (onRequestOverride) {
      onRequestOverride(
        'Hủy món khỏi đơn hàng POS',
        `Xóa món "${item.product.name}" (${formatVND(item.itemTotalPrice)})`,
        'ITEM_CANCEL',
        item.product.name,
        () => removeItem(item.cartItemId)
      );
    } else {
      removeItem(item.cartItemId);
    }
  };

  const handleDiscountChange = (newDiscount: number) => {
    const isOverTenPercent = newDiscount > subtotal * 0.1;
    if (isOverTenPercent && onRequestOverride) {
      onRequestOverride(
        'Duyệt chiết khấu lớn (> 10%)',
        `Giảm giá ${formatVND(newDiscount)} trên tổng đơn ${formatVND(subtotal)}`,
        'DISCOUNT_OVERRIDE',
        'Chiết khấu đơn POS',
        () => setDiscount(newDiscount)
      );
    } else {
      setDiscount(newDiscount);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-amber-900/10 flex flex-col h-full shrink-0 shadow-lg">
      {/* Drawer Header */}
      <div className="p-4 border-b border-amber-900/10 flex items-center justify-between bg-amber-50/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
            <FiShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 text-sm">Đơn Hàng Hiện Tại</h2>
            <p className="text-xs text-amber-800 font-bold">
              {isTakeaway ? '🥤 Mang về (Takeaway)' : `🪑 ${selectedTableName || 'Chưa chọn bàn'}`}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              if (onRequestOverride) {
                onRequestOverride(
                  'Hủy toàn bộ đơn hàng POS',
                  `Hủy đơn hàng gồm ${items.length} món (${formatVND(total)})`,
                  'ITEM_CANCEL',
                  'Toàn bộ giỏ hàng',
                  clearCart
                );
              } else {
                clearCart();
              }
            }}
            className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors font-semibold cursor-pointer"
          >
            <FiTrash2 className="w-3.5 h-3.5" /> Xóa đơn
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 space-y-3 py-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-xs">
              ☕
            </div>
            <p className="text-sm font-bold text-stone-700">Giỏ hàng đang trống</p>
            <p className="text-xs text-stone-500 max-w-[200px]">
              Vui lòng chọn bàn và nhấp vào món trong thực đơn để bắt đầu tạo đơn hàng.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white border border-amber-200/80 rounded-2xl p-3 space-y-2 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs line-clamp-1">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-amber-800 font-semibold mt-0.5">
                    <span>Size {item.size}</span>
                    <span>•</span>
                    <span>Đường {item.sugarLevel}</span>
                    <span>•</span>
                    <span>{item.iceLevel}</span>
                  </div>
                </div>

                <span className="font-extrabold text-amber-900 text-xs">
                  {formatVND(item.itemTotalPrice)}
                </span>
              </div>

              {/* Selected Toppings */}
              {item.selectedOptions.length > 0 && (
                <div className="text-[11px] text-stone-600 space-y-0.5 pl-2 border-l-2 border-amber-400">
                  {item.selectedOptions.map((opt) => (
                    <div key={opt.optionId} className="flex justify-between">
                      <span>+ {opt.optionName}</span>
                      <span>{formatVND(opt.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Note */}
              {item.note && (
                <p className="text-[11px] text-stone-500 italic">
                  Ghi chú: {item.note}
                </p>
              )}

              {/* Quantity Controls, Edit & Remove */}
              <div className="flex items-center justify-between pt-1 border-t border-amber-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveItemWithOverride(item)}
                    className="text-stone-400 hover:text-rose-600 text-xs p-1 transition-colors cursor-pointer flex items-center gap-0.5"
                    title="Xóa món (Cần Quản lý duyệt)"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <FiShield className="w-2.5 h-2.5 text-amber-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-amber-300 shadow-2xs"
                    title="Chỉnh sửa tùy chọn món"
                  >
                    <FiEdit2 className="w-3 h-3" /> Sửa
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-0.5">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="w-6 h-6 rounded text-stone-600 hover:text-amber-900 hover:bg-amber-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-extrabold text-amber-950 text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="w-6 h-6 rounded text-stone-600 hover:text-amber-900 hover:bg-amber-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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

      {/* Cart Summary & Checkout Button */}
      {items.length > 0 && (
        <div className="p-4 border-t border-amber-900/10 bg-white space-y-3 shadow-md">
          {/* Subtotal & Discount */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} món)</span>
              <span className="font-bold text-stone-900">{formatVND(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-600">
              <span className="flex items-center gap-1">
                <FiTag className="w-3 h-3 text-amber-700" /> Giảm giá:
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={discount || ''}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  placeholder="0"
                  className="w-20 bg-amber-50/60 border border-amber-200 rounded px-2 py-0.5 text-right text-xs text-amber-900 font-bold focus:outline-none focus:border-amber-600"
                />
                <span className="font-semibold text-stone-700">đ</span>
              </div>
            </div>

            <div className="flex justify-between text-stone-900 text-base font-extrabold pt-2 border-t border-amber-100">
              <span>Tổng thanh toán</span>
              <span className="text-amber-800 font-extrabold">{formatVND(total)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3.5 rounded-xl shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Thanh Toán & In Hóa Đơn</span>
          </button>
        </div>
      )}
    </div>
  );
};
