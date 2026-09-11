import React, { useState, useEffect } from 'react';
import type { CartItem, Product, SelectedOption } from '../types';
import { formatVND } from '../utils/formatters';
import { FiX, FiMinus, FiPlus, FiCheck, FiEdit2 } from 'react-icons/fi';
import { ProductVoucherSection } from './ProductVoucherSection';
import type { Coupon } from '../api/coupon.api';

interface ProductOptionModalProps {
  product: Product | null;
  editingCartItem?: CartItem | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    size: 'S' | 'M' | 'L',
    sugarLevel: '0%' | '30%' | '50%' | '100%',
    iceLevel: 'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá',
    selectedOptions: SelectedOption[],
    quantity: number,
    note: string,
    discountAmount?: number
  ) => void;
  onUpdateItem?: (
    oldCartItemId: string,
    product: Product,
    size: 'S' | 'M' | 'L',
    sugarLevel: '0%' | '30%' | '50%' | '100%',
    iceLevel: 'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá',
    selectedOptions: SelectedOption[],
    quantity: number,
    note: string,
    discountAmount?: number
  ) => void;
}

export const ProductOptionModal: React.FC<ProductOptionModalProps> = ({
  product,
  editingCartItem,
  onClose,
  onAddToCart,
  onUpdateItem,
}) => {
  if (!product) return null;

  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [sugarLevel, setSugarLevel] = useState<'0%' | '30%' | '50%' | '100%'>('100%');
  const [iceLevel, setIceLevel] = useState<'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá'>('Vừa đá');
  const [selectedToppings, setSelectedToppings] = useState<SelectedOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  // Voucher State
  const [appliedVoucher, setAppliedVoucher] = useState<Coupon | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);

  useEffect(() => {
    if (editingCartItem) {
      setSize(editingCartItem.size);
      setSugarLevel(editingCartItem.sugarLevel);
      setIceLevel(editingCartItem.iceLevel);
      setSelectedToppings(editingCartItem.selectedOptions || []);
      setQuantity(editingCartItem.quantity);
      setNote(editingCartItem.note || '');
    }
  }, [editingCartItem]);

  // Tính toán tổng giá tạm tính
  let sizeAddon = 0;
  if (size === 'M') sizeAddon = 6000;
  if (size === 'L') sizeAddon = 10000;

  const toppingsAddon = selectedToppings.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = product.price + sizeAddon + toppingsAddon;
  const rawTotalPrice = unitPrice * quantity;
  const totalPrice = Math.max(0, rawTotalPrice - voucherDiscount);

  const handleToggleTopping = (groupId: string, groupName: string, optionId: string, optionName: string, price: number) => {
    const exists = selectedToppings.some((t) => t.optionId === optionId);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.optionId !== optionId));
    } else {
      setSelectedToppings([...selectedToppings, { groupId, groupName, optionId, optionName, price }]);
    }
  };

  const handleConfirm = () => {
    const finalNote = appliedVoucher
      ? `${note ? note + ' | ' : ''}Mã Voucher: ${appliedVoucher.code} (Giảm ${formatVND(voucherDiscount)})`
      : note;

    if (editingCartItem && onUpdateItem) {
      onUpdateItem(editingCartItem.cartItemId, product, size, sugarLevel, iceLevel, selectedToppings, quantity, finalNote, voucherDiscount);
    } else {
      onAddToCart(product, size, sugarLevel, iceLevel, selectedToppings, quantity, finalNote, voucherDiscount);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-stone-900">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#8eb7d8] flex items-center justify-between bg-gradient-to-r from-[#a3c7e4] via-[#b6d5ed] to-[#c7e0f2]">
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-white/60 shadow-sm" />
            <div>
              <h2 className="font-bold text-stone-950 text-lg font-product tracking-wide flex items-center gap-1.5">
                {editingCartItem && <FiEdit2 className="text-amber-800" />}
                <span>{editingCartItem ? `Chỉnh Sửa: ${product.name}` : product.name}</span>
              </h2>
              <p className="text-[#1c4d79] font-extrabold text-sm">{formatVND(product.price)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/product/${product.id}`}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                window.location.href = `/product/${product.id}`;
              }}
              className="text-xs text-amber-900 font-bold hover:underline bg-white/60 hover:bg-white px-2.5 py-1.5 rounded-lg border border-amber-900/20 transition-all"
            >
              Xem chi tiết →
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-800 hover:text-stone-950 hover:bg-white/50 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Size Choice */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              Kích thước (Size)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'Size S (Vừa)', val: 'S', price: 0 },
                { label: 'Size M (+6.000đ)', val: 'M', price: 6000 },
                { label: 'Size L (+10.000đ)', val: 'L', price: 10000 },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setSize(item.val as 'S' | 'M' | 'L')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${size === item.val
                    ? 'bg-[#a3c7e4] border-[#8eb7d8] text-stone-900 font-bold shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sugar Level */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              Mức đường
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['0%', '30%', '50%', '100%'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSugarLevel(s)}
                  className={`py-2 rounded-xl border text-xs font-medium transition-all ${sugarLevel === s
                    ? 'bg-[#a3c7e4] border-[#8eb7d8] text-stone-900 font-bold shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              Mức đá
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Không đá', 'Ít đá', 'Vừa đá', 'Nhiều đá'] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setIceLevel(i)}
                  className={`py-2 rounded-xl border text-xs font-medium transition-all ${iceLevel === i
                    ? 'bg-[#a3c7e4] border-[#8eb7d8] text-stone-900 font-bold shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Option */}
          {product.optionGroups && product.optionGroups.length > 0 && (
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Topping Thêm (Tùy chọn)
              </label>
              <div className="space-y-2">
                {product.optionGroups[0].options.map((opt) => {
                  const isChecked = selectedToppings.some((t) => t.optionId === opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() =>
                        handleToggleTopping(
                          product.optionGroups![0].id,
                          product.optionGroups![0].name,
                          opt.id,
                          opt.name,
                          opt.price
                        )
                      }
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isChecked
                        ? 'bg-[#e3eff8] border-[#8eb7d8] text-stone-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${isChecked
                            ? 'bg-[#2b6ba4] border-[#1c4d79] text-white'
                            : 'border-stone-300 bg-white'
                            }`}
                        >
                          {isChecked && <FiCheck className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{opt.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#2b6ba4]">+{formatVND(opt.price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note Input */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
              Ghi chú món
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Nhiều sữa dừa, mang đi..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#2b6ba4]"
            />
          </div>

          {/* Member Tier Voucher Section */}
          <div className="pt-2">
            <ProductVoucherSection
              productPrice={rawTotalPrice}
              appliedVoucher={appliedVoucher}
              onApplyVoucher={(voucher, discountAmt) => {
                setAppliedVoucher(voucher);
                setVoucherDiscount(discountAmt);
              }}
              compactMode={true}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white border border-stone-300 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-stone-900 text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-between transition-all shadow-md cursor-pointer"
          >
            <span>{editingCartItem ? 'Lưu Cập Nhật Món' : 'Thêm Vào Đơn'}</span>
            <span className="text-sm font-extrabold">{formatVND(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
