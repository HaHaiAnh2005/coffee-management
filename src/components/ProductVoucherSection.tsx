import React, { useState, useEffect } from 'react';
import { INITIAL_COUPONS, type Coupon, type MembershipTier } from '../api/coupon.api';
import { INITIAL_CUSTOMERS } from '../api/customer.api';
import { useAuthStore } from '../store/auth.store';
import { formatCurrency } from '../utils/formatCurrency';
import { FiTag, FiCheck, FiX, FiGift, FiShield, FiAlertCircle, FiLock } from 'react-icons/fi';

interface ProductVoucherSectionProps {
  productPrice: number;
  appliedVoucher: Coupon | null;
  onApplyVoucher: (voucher: Coupon | null, discountAmount: number) => void;
  compactMode?: boolean;
  userTier?: MembershipTier;
}

const TIER_ORDER: Record<MembershipTier, number> = {
  'Tất cả': 0,
  'Bạc': 1,
  'Vàng': 2,
  'Kim Cương': 3,
};

const TIER_BADGES: Record<MembershipTier, { label: string; bg: string; text: string; border: string; icon: string }> = {
  'Tất cả': { label: 'Tất cả TV', bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300', icon: '🥉' },
  'Bạc': { label: 'Hạng Bạc', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: '🥈' },
  'Vàng': { label: 'Hạng Vàng', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', icon: '🥇' },
  'Kim Cương': { label: 'Kim Cương', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300', icon: '💎' },
};

export const ProductVoucherSection: React.FC<ProductVoucherSectionProps> = ({
  productPrice,
  appliedVoucher,
  onApplyVoucher,
  compactMode = false,
  userTier = 'Bạc',
}) => {
  const currentUser = useAuthStore((state) => state.user);

  // Automatically detect customer tier from logged-in account
  const detectUserTier = (): MembershipTier => {
    if (!currentUser) return userTier;
    const found = INITIAL_CUSTOMERS.find(
      (c) => c.phone === currentUser.phone || c.email?.toLowerCase() === currentUser.email?.toLowerCase()
    );
    if (found?.tier) {
      return found.tier as MembershipTier;
    }
    return userTier;
  };

  const [inputCode, setInputCode] = useState('');
  const [selectedUserTier, setSelectedUserTier] = useState<MembershipTier>(detectUserTier());
  const [activeTab, setActiveTab] = useState<MembershipTier>('Tất cả');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setSelectedUserTier(detectUserTier());
  }, [currentUser, userTier]);

  // Helper function to calculate discount amount
  const calculateDiscount = (voucher: Coupon, basePrice: number): number => {
    if (voucher.discountType === 'fixed') {
      return Math.min(voucher.discountValue, basePrice);
    } else {
      return Math.round((basePrice * voucher.discountValue) / 100);
    }
  };

  // Check tier requirement strictly
  const isTierEligible = (userTier: MembershipTier, voucherTier: MembershipTier = 'Tất cả'): boolean => {
    return TIER_ORDER[userTier] >= TIER_ORDER[voucherTier];
  };

  // Validate and apply code
  const handleApplyCode = (codeToApply: string) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    if (!cleanCode) {
      setFeedbackMessage({ type: 'error', text: 'Vui lòng nhập mã Voucher giảm giá!' });
      return;
    }

    const foundVoucher = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

    if (!foundVoucher) {
      setFeedbackMessage({ type: 'error', text: `Mã Voucher "${cleanCode}" không tồn tại hoặc đã hết hạn!` });
      return;
    }

    if (foundVoucher.status !== 'active') {
      setFeedbackMessage({ type: 'error', text: `Mã Voucher "${cleanCode}" hiện tại đã bị tạm khóa hoặc hết hạn!` });
      return;
    }

    const requiredTier = foundVoucher.minTier || 'Tất cả';

    // Strict tier enforcement
    if (!isTierEligible(selectedUserTier, requiredTier)) {
      setFeedbackMessage({
        type: 'error',
        text: `Từ chối áp dụng! Mã "${foundVoucher.code}" yêu cầu hạng ${requiredTier} trở lên. Hạng hiện tại của bạn là ${selectedUserTier}.`,
      });
      return;
    }

    if (productPrice < foundVoucher.minOrderValue) {
      setFeedbackMessage({
        type: 'error',
        text: `Đơn tối thiểu để dùng mã này là ${formatCurrency(foundVoucher.minOrderValue)} (Giá hiện tại: ${formatCurrency(productPrice)}).`,
      });
      return;
    }

    const discountAmt = calculateDiscount(foundVoucher, productPrice);
    onApplyVoucher(foundVoucher, discountAmt);
    setInputCode(cleanCode);
    setFeedbackMessage({
      type: 'success',
      text: `Áp dụng thành công "${foundVoucher.code}"! Đã giảm ${formatCurrency(discountAmt)}.`,
    });
  };

  const handleRemoveVoucher = () => {
    onApplyVoucher(null, 0);
    setInputCode('');
    setFeedbackMessage(null);
  };

  // Filter vouchers according to active tab
  const tabVouchers = INITIAL_COUPONS.filter((v) => {
    if (activeTab === 'Tất cả') return true;
    return (v.minTier || 'Tất cả') === activeTab;
  });

  return (
    <div className={`bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-3.5 ${compactMode ? 'text-xs' : ''}`}>
      {/* Section Header & Current User Tier Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-700 text-white font-bold shadow-xs">
            <FiTag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span>Mã Giảm Giá Voucher Theo Hạng Thành Viên</span>
            </h4>
            <p className="text-[11px] text-stone-500 font-medium">Nhập mã hoặc chọn Voucher quà tặng theo hạng của bạn</p>
          </div>
        </div>

        {/* Member Tier Switcher */}
        <div className="flex items-center gap-1.5 bg-white border border-amber-300 rounded-xl px-2.5 py-1 text-[11px] font-bold text-stone-800 shadow-2xs">
          <FiShield className="text-amber-700" />
          <span className="text-stone-500">Hạng của bạn:</span>
          <select
            value={selectedUserTier}
            onChange={(e) => {
              const newTier = e.target.value as MembershipTier;
              setSelectedUserTier(newTier);
              setFeedbackMessage(null);
              // Clear applied voucher if no longer eligible
              if (appliedVoucher && !isTierEligible(newTier, appliedVoucher.minTier || 'Tất cả')) {
                onApplyVoucher(null, 0);
              }
            }}
            className="bg-transparent text-amber-900 font-black focus:outline-none cursor-pointer"
          >
            <option value="Bạc">🥈 Hạng Bạc</option>
            <option value="Vàng">🥇 Hạng Vàng</option>
            <option value="Kim Cương">💎 Kim Cương</option>
          </select>
        </div>
      </div>

      {/* Input Code Form */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã Voucher (VD: GOLDVIP20)..."
            className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 uppercase shadow-2xs"
          />
          {inputCode && (
            <button
              onClick={() => setInputCode('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleApplyCode(inputCode)}
          className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
        >
          <FiCheck className="stroke-[3]" /> Áp Dụng
        </button>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start gap-2 animate-fadeIn ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{feedbackMessage.text}</span>
        </div>
      )}

      {/* Applied Voucher Active Banner */}
      {appliedVoucher && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <FiGift className="w-5 h-5 text-emerald-200" />
            <div>
              <div className="font-extrabold text-xs font-mono flex items-center gap-1.5">
                <span>MÃ: {appliedVoucher.code}</span>
                <span className="bg-emerald-700 text-emerald-100 text-[10px] px-2 py-0.2 rounded-md font-sans">
                  {appliedVoucher.minTier || 'Tất cả'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Đã giảm <span className="font-bold underline">{formatCurrency(calculateDiscount(appliedVoucher, productPrice))}</span> cho món này!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveVoucher}
            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
          >
            <FiX /> Hủy
          </button>
        </div>
      )}

      {/* Membership Voucher Tabs & List */}
      <div className="space-y-2 pt-1 border-t border-amber-200/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">
            Voucher Khả Dụng Theo Hạng:
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Click "Dùng ngay" để áp dụng</span>
        </div>

        {/* Tier Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['Tất cả', 'Bạc', 'Vàng', 'Kim Cương'] as MembershipTier[]).map((tier) => {
            const isTabSelected = activeTab === tier;
            const badge = TIER_BADGES[tier];
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTab(tier)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  isTabSelected
                    ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <span>{badge.icon}</span>
                <span>{tier === 'Tất cả' ? 'Tất cả mã' : tier}</span>
              </button>
            );
          })}
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tabVouchers.map((voucher) => {
            const reqTier = voucher.minTier || 'Tất cả';
            const isEligible = isTierEligible(selectedUserTier, reqTier);
            const isCurrentlyApplied = appliedVoucher?.id === voucher.id;
            const badgeInfo = TIER_BADGES[reqTier];

            return (
              <div
                key={voucher.id}
                className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                  isCurrentlyApplied
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                    : isEligible
                    ? 'bg-white border-amber-200/90 hover:border-amber-500/70 hover:shadow-2xs'
                    : 'bg-stone-100/80 border-stone-200 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold font-mono text-amber-900 text-xs tracking-wide">
                        {voucher.code}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}
                      >
                        {badgeInfo.icon} {badgeInfo.label}
                      </span>
                    </div>
                    {voucher.title && (
                      <p className="text-[11px] font-bold text-stone-800 mt-0.5 line-clamp-1">{voucher.title}</p>
                    )}
                    <p className="text-[10px] text-stone-500 line-clamp-1">{voucher.description}</p>
                  </div>

                  <span className="font-black text-xs text-emerald-600 shrink-0">
                    -{voucher.discountType === 'fixed' ? formatCurrency(voucher.discountValue) : `${voucher.discountValue}%`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[10px]">
                  <span className="text-stone-400 font-mono">Đơn từ: {formatCurrency(voucher.minOrderValue)}</span>

                  {isCurrentlyApplied ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                      <FiCheck /> Đã áp dụng
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        // Strict check before applying
                        if (!isEligible) {
                          setFeedbackMessage({
                            type: 'error',
                            text: `Thất bại! Mã "${voucher.code}" yêu cầu hạng ${reqTier} trở lên. Hạng hiện tại của bạn là ${selectedUserTier}.`,
                          });
                          return;
                        }

                        const cleanCode = voucher.code.trim().toUpperCase();
                        if (productPrice < voucher.minOrderValue) {
                          setFeedbackMessage({
                            type: 'error',
                            text: `Đơn tối thiểu để dùng mã này là ${formatCurrency(voucher.minOrderValue)} (Giá hiện tại: ${formatCurrency(productPrice)}).`,
                          });
                          return;
                        }
                        const discountAmt = calculateDiscount(voucher, productPrice);
                        onApplyVoucher(voucher, discountAmt);
                        setInputCode(cleanCode);
                        setFeedbackMessage({
                          type: 'success',
                          text: `Áp dụng thành công "${voucher.code}" (${reqTier})! Đã giảm ${formatCurrency(discountAmt)}.`,
                        });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                        isEligible
                          ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-2xs cursor-pointer'
                          : 'bg-stone-200 text-stone-500 cursor-not-allowed flex items-center gap-1'
                      }`}
                    >
                      {isEligible ? (
                        'Dùng Ngay ➔'
                      ) : (
                        <>
                          <FiLock className="w-3 h-3 text-stone-400" /> Cần Hạng {reqTier}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
