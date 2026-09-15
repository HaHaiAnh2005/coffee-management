import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProductStore } from '../../store/product.store';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  FiArrowLeft,
  FiPlus,
  FiShoppingBag,
  FiCheckCircle,
  FiCheck,
  FiInfo,
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { getProductStoryDetail } from '../../utils/productStories';
import { ProductVoucherSection } from '../../components/ProductVoucherSection';
import type { Coupon } from '../../api/coupon.api';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);

  const product = products.find((p) => p.id === id);

  // Customization Form State
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [sugar, setSugar] = useState<string>('100%');
  const [ice, setIce] = useState<string>('Vừa đá');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [isAddedToast, setIsAddedToast] = useState<boolean>(false);

  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState<Coupon | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);


  if (!product) {
    return (
      <div className="p-12 text-center text-stone-600 space-y-4">
        <p className="text-base font-bold text-stone-800">Không tìm thấy thông tin sản phẩm yêu cầu.</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          Quay lại Thực đơn
        </button>
      </div>
    );
  }

  const storyDetail = getProductStoryDetail(product);

  // Calculate Size Price Adjustment
  const getSizeAdjustment = () => {
    if (size === 'S') return -4000;
    if (size === 'L') return 8000;
    return 0;
  };

  // Sample Toppings
  const AVAILABLE_TOPPINGS = [
    { id: 'top-1', name: 'Kem Mây Phô Mai Nhài', price: 12000 },
    { id: 'top-2', name: 'Trân Châu Tuyết Hoa', price: 10000 },
    { id: 'top-3', name: 'Thạch Tuyết Đào Sen', price: 10000 },
    { id: 'top-4', name: 'Sốt Caramel Thủ Công', price: 8000 },
  ];

  const getToppingTotal = () => {
    return selectedToppings.reduce((total, topId) => {
      const item = AVAILABLE_TOPPINGS.find((t) => t.id === topId);
      return total + (item ? item.price : 0);
    }, 0);
  };

  const finalUnitPrice = Math.max(0, product.price + getSizeAdjustment() + getToppingTotal());
  const rawTotalPrice = finalUnitPrice * quantity;
  const totalPrice = Math.max(0, rawTotalPrice - voucherDiscount);

  const handleApplyVoucher = (voucher: Coupon | null, discountAmt: number) => {
    setAppliedVoucher(voucher);
    setVoucherDiscount(discountAmt);
  };

  const toggleTopping = (topId: string) => {
    if (selectedToppings.includes(topId)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topId));
    } else {
      setSelectedToppings([...selectedToppings, topId]);
    }
  };

  const getFormattedOptions = () => {
    return selectedToppings.map((topId) => {
      const top = AVAILABLE_TOPPINGS.find((t) => t.id === topId);
      return {
        groupId: 'topping',
        groupName: 'Topping Chọn Thêm',
        optionId: topId,
        optionName: top ? top.name : topId,
        price: top ? top.price : 0,
      };
    });
  };

  const finalNote = appliedVoucher
    ? `${note ? note + ' | ' : ''}Mã Voucher: ${appliedVoucher.code} (Giảm ${formatCurrency(voucherDiscount)})`
    : note;

  const handleAddToCart = () => {
    addItem(product, size, sugar as any, ice as any, getFormattedOptions(), quantity, finalNote);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 3000);
  };

  const handleOrderNow = () => {
    addItem(product, size, sugar as any, ice as any, getFormattedOptions(), quantity, finalNote);
    navigate('/checkout');
  };

  // Related Products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {isAddedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce font-bold text-xs">
          <FiCheckCircle className="w-5 h-5 text-emerald-200" />
          <span>Đã thêm "{product.name}" vào giỏ hàng thành công!</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-800 text-xs font-bold transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4 stroke-[2.5]" /> Quay lại Thực Đơn
        </button>
        <span className="text-[11px] font-semibold text-stone-400">
          Mã món: <code className="text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md font-mono">{product.id}</code>
        </span>
      </div>

      {/* Main Product Section: Left Image & Story / Right Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Showcase & Story (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Large Image Box */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-amber-50 group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-700 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                <BsStars /> ĐẶC SẢN SIGNATURE
              </span>
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 text-amber-900 font-bold text-[10px]">
                🌿 100% Nguyên Liệu Tự Nhiên
              </span>
            </div>
          </div>

          {/* Product Story Card */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-800 border-b border-amber-100 pb-2.5">
              <FiInfo className="w-4 h-4" /> 📖 Câu Chuyện Hương Vị & Nghệ Thuật Chế Biến
            </h3>

            {/* Long Prose Story Paragraphs */}
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed font-medium">
              {storyDetail.story.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="first-letter:text-sm first-letter:font-bold first-letter:text-amber-900">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Aroma Notes Badges */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {storyDetail.aromaNotes.map((noteItem, nIdx) => (
                <span
                  key={nIdx}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-200"
                >
                  ✦ {noteItem}
                </span>
              ))}
            </div>

            {/* Origin & Serving Suggestion Box */}
            <div className="space-y-2 pt-2 border-t border-amber-100/80">
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 space-y-1">
                <p className="text-[11px] font-extrabold text-amber-900 flex items-center gap-1">
                  🌾 Nguồn Gốc Nguyên Liệu Tuyển Chọn:
                </p>
                <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                  {storyDetail.origin}
                </p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 space-y-1">
                <p className="text-[11px] font-extrabold text-amber-900 flex items-center gap-1">
                  ☕ Gợi Ý Thưởng Thức Chuẩn Gu:
                </p>
                <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                  {storyDetail.servingSuggestion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Pricing & Customization Order Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-amber-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          {/* Header Info */}
          <div className="space-y-2 border-b border-amber-100 pb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
              Món Ăn / Thức Uống Độc Quyền
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight font-product tracking-wide">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-amber-800">
                {formatCurrency(totalPrice)}
              </span>
              {voucherDiscount > 0 && (
                <span className="text-sm font-bold text-stone-400 line-through">
                  {formatCurrency(rawTotalPrice)}
                </span>
              )}
              <span className="text-xs text-stone-400 font-medium">
                (Đã gồm size, topping {voucherDiscount > 0 ? '& giảm giá voucher' : ''})
              </span>
            </div>
          </div>

          {/* Customizer Form Options */}
          <div className="space-y-5">
            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                <span>1. Chọn Kích Cỡ (Size):</span>
                <span className="text-[11px] font-semibold text-amber-800">Bắt buộc</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'S', label: 'Size S (Nhỏ)', note: '-4.000đ' },
                  { key: 'M', label: 'Size M (Vừa)', note: 'Chuẩn vị' },
                  { key: 'L', label: 'Size L (Lớn)', note: '+8.000đ' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => setSize(item.key as any)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${size === item.key
                        ? 'bg-amber-700 text-white border-amber-700 shadow-md scale-[1.02]'
                        : 'bg-amber-50/40 border-amber-200/90 text-stone-700 hover:bg-amber-100/60'
                      }`}
                  >
                    <div>{item.label}</div>
                    <div className={`text-[10px] ${size === item.key ? 'text-amber-200' : 'text-stone-400'}`}>
                      {item.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sugar Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800">2. Mức Đường (Sugar Level):</label>
              <div className="flex flex-wrap gap-2">
                {['100%', '70%', '50%', '30%', '0%'].map((sg) => (
                  <button
                    type="button"
                    key={sg}
                    onClick={() => setSugar(sg)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${sugar === sg
                        ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                        : 'bg-white border-amber-200 text-stone-700 hover:bg-amber-50'
                      }`}
                  >
                    {sg} {sg === '100%' && '(Mặc định)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800">3. Mức Đá (Ice Level):</label>
              <div className="flex flex-wrap gap-2">
                {['Vừa đá', 'Ít đá', 'Không đá', 'Đá riêng'].map((ic) => (
                  <button
                    type="button"
                    key={ic}
                    onClick={() => setIce(ic)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${ice === ic
                        ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                        : 'bg-white border-amber-200 text-stone-700 hover:bg-amber-50'
                      }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Topping Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800">4. Topping Chọn Thêm:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_TOPPINGS.map((top) => {
                  const isChecked = selectedToppings.includes(top.id);
                  return (
                    <button
                      type="button"
                      key={top.id}
                      onClick={() => toggleTopping(top.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${isChecked
                          ? 'bg-amber-100/90 border-amber-600 text-amber-950 font-bold shadow-xs'
                          : 'bg-white border-amber-200 text-stone-700 hover:bg-amber-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${isChecked ? 'bg-amber-700 border-amber-700 text-white' : 'border-stone-300'
                            }`}
                        >
                          {isChecked && <FiCheck className="stroke-[3]" />}
                        </div>
                        <span>{top.name}</span>
                      </div>
                      <span className="text-amber-800 font-bold text-[11px]">+{formatCurrency(top.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">5. Ghi Chú Đặc Biệt (Gửi Barista):</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Không lấy ống hút nhựa, cho nhiều ống đá..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-bold text-stone-800">Số Lượng:</label>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg text-stone-700 bg-white border border-amber-200 hover:bg-amber-100 font-bold cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-stone-900 text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg text-stone-700 bg-white border border-amber-200 hover:bg-amber-100 font-bold cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Voucher Section per Membership Tier */}
            <div className="pt-3 border-t border-amber-100">
              <ProductVoucherSection
                productPrice={rawTotalPrice}
                appliedVoucher={appliedVoucher}
                onApplyVoucher={handleApplyVoucher}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-amber-100">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-300 shadow-xs"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" /> Thêm Vào Giỏ Hàng
            </button>

            <button
              type="button"
              onClick={handleOrderNow}
              className="flex-1 py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-900/20 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <FiShoppingBag className="w-4 h-4" /> ĐẶT MÓN NGAY & THANH TOÁN
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5 pt-8 border-t border-amber-200/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">Món Cùng Danh Mục Đang Hot 🌸</h3>
              <p className="text-xs text-stone-500">Gợi ý thức uống thơm ngon tương tự bạn có thể thích</p>
            </div>
            <Link to="/menu" className="text-xs font-bold text-amber-800 hover:underline">
              Xem tất cả menu
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relP) => (
              <div
                key={relP.id}
                onClick={() => {
                  navigate(`/product/${relP.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative rounded-xl overflow-hidden h-44 bg-amber-50">
                  <img
                    src={relP.image}
                    alt={relP.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {relP.name}
                  </h4>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">{relP.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                  <span className="font-extrabold text-amber-800 text-sm">{formatCurrency(relP.price)}</span>
                  <span className="text-[11px] font-bold text-stone-600 group-hover:text-amber-800 underline">
                    Xem Chi Tiết ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
