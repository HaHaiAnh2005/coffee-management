import React, { useState } from 'react';
import { useMenuStore } from '../stores/useMenuStore';
import { useTableStore } from '../stores/useTableStore';
import { useCartStore } from '../stores/useCartStore';
import { useShiftStore } from '../store/shift.store';
import { MenuItemCard } from '../components/MenuItemCard';
import { ProductOptionModal } from '../components/ProductOptionModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { BannerCarousel } from '../components/common/BannerCarousel';
import { OpenShiftModal } from '../components/shift/OpenShiftModal';
import { CloseShiftModal } from '../components/shift/CloseShiftModal';
import { ManagerOverrideModal } from '../components/common/ManagerOverrideModal';
import type { Product, Table, CategoryId } from '../types';
import {
  FiCoffee,
  FiFeather,
  FiZap,
  FiPieChart,
  FiGift,
  FiLayers,
  FiCheck,
  FiClock,
  FiLock,
  FiUnlock,
  FiShield,
  FiAlertCircle,
} from 'react-icons/fi';

export const POSPage: React.FC = () => {
  const { products, categories, selectedCategoryId, setSelectedCategoryId, searchQuery } =
    useMenuStore();
  const { tables, areas } = useTableStore();
  const { selectedTableId, setSelectedTable, addItem } = useCartStore();
  const { currentShift, isShiftOpen } = useShiftStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'tables'>('menu');

  // Modals state for Shift & Anti-Fraud
  const [isOpenShiftModal, setIsOpenShiftModal] = useState<boolean>(false);
  const [isCloseShiftModal, setIsCloseShiftModal] = useState<boolean>(false);
  const [overrideModal, setOverrideModal] = useState<{
    isOpen: boolean;
    title: string;
    details: string;
    type: 'ITEM_CANCEL' | 'BILL_CANCEL' | 'DISCOUNT_OVERRIDE';
    targetId: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    title: '',
    details: '',
    type: 'ITEM_CANCEL',
    targetId: '',
    onSuccess: () => {},
  });

  const shiftActive = isShiftOpen();

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FiCoffee':
        return <FiCoffee className="w-4 h-4" />;
      case 'FiFeather':
        return <FiFeather className="w-4 h-4" />;
      case 'FiZap':
        return <FiZap className="w-4 h-4" />;
      case 'FiPieChart':
        return <FiPieChart className="w-4 h-4" />;
      default:
        return <FiGift className="w-4 h-4" />;
    }
  };

  const handleSelectTable = (table: Table | null) => {
    if (table) {
      setSelectedTable(table.id, table.name);
    } else {
      setSelectedTable(null, null); // Takeaway
    }
  };

  const handleSelectProductById = (productId: string) => {
    if (!shiftActive) {
      setIsOpenShiftModal(true);
      return;
    }
    const p = products.find((item) => item.id === productId);
    if (p && p.isAvailable) {
      setSelectedProduct(p);
    }
  };

  const handleSelectProduct = (p: Product) => {
    if (!shiftActive) {
      setIsOpenShiftModal(true);
      return;
    }
    setSelectedProduct(p);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Shift Status & Anti-Fraud Bar */}
      <div className="mb-3 p-3 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
              shiftActive
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {shiftActive ? <FiUnlock /> : <FiLock />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  shiftActive ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}
              >
                {shiftActive ? 'Ca POS Đang Mở' : 'Ca POS Đang Khóa'}
              </span>
              {shiftActive && (
                <span className="text-[11px] text-stone-500 font-mono">
                  {currentShift?.id} ({currentShift?.openedAt})
                </span>
              )}
            </div>
            <p className="text-xs text-stone-700 font-bold">
              {shiftActive
                ? `Thu ngân: ${currentShift?.cashierName} • Tiền thối đầu ca: ${currentShift?.initialCash.toLocaleString('vi-VN')}đ`
                : 'Vui lòng thực hiện Mở Ca làm việc để bắt đầu bán hàng.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {shiftActive ? (
            <button
              onClick={() => setIsCloseShiftModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FiLock /> Kết toán & Đóng ca
            </button>
          ) : (
            <button
              onClick={() => setIsOpenShiftModal(true)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 animate-bounce"
            >
              <FiClock /> Khai báo Mở ca mới
            </button>
          )}
        </div>
      </div>

      {/* Main POS Content */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Left Main Content (Menu or Tables) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Control Header */}
          <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
            {/* Mode Tabs */}
            <div className="flex items-center gap-2 bg-amber-100/80 border border-amber-200/80 p-1.5 rounded-2xl shadow-xs">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'menu'
                    ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20'
                    : 'text-stone-600 hover:text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <FiCoffee /> Thực Đơn Món
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'tables'
                    ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20'
                    : 'text-stone-600 hover:text-amber-950 hover:bg-amber-200/50'
                }`}
              >
                <FiLayers /> Sơ Đồ Bàn ({tables.filter((t) => t.status === 'occupied').length}/{tables.length})
              </button>
            </div>

            {/* Quick Table Selection Indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectTable(null)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                  selectedTableId === null
                    ? 'bg-amber-700 border-amber-700 text-white shadow-md'
                    : 'bg-white border-amber-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                🥤 Mang Về (Takeaway)
              </button>
            </div>
          </div>

          {!shiftActive && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-bold">
              <span className="flex items-center gap-2">
                <FiAlertCircle className="text-amber-600 text-base" /> Ca bán hàng đang khóa. Vui lòng Mở Ca trước khi thêm món.
              </span>
              <button
                onClick={() => setIsOpenShiftModal(true)}
                className="px-3 py-1 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800 transition-all"
              >
                Mở Ca Ngay
              </button>
            </div>
          )}

          {activeTab === 'menu' ? (
            <>
              {/* Sliding Banner Carousel */}
              <div className="mb-4 shrink-0">
                <BannerCarousel onSelectProduct={handleSelectProductById} />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-2 shrink-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategoryId('all')}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                    selectedCategoryId === 'all'
                      ? 'bg-amber-700 border-amber-700 text-white shadow-md'
                      : 'bg-white border-amber-200/80 text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900'
                  }`}
                >
                  Tất Cả Món ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id as CategoryId)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all shadow-xs ${
                      selectedCategoryId === cat.id
                        ? 'bg-amber-700 border-amber-700 text-white shadow-md'
                        : 'bg-white border-amber-200/80 text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900'
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
                  {filteredProducts.map((product) => (
                    <MenuItemCard
                      key={product.id}
                      product={product}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Table Selection Grid */
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-6">
              {areas.map((area) => {
                const areaTables = tables.filter((t) => t.areaId === area.id);
                return (
                  <div key={area.id} className="space-y-3">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {area.name} ({areaTables.length} bàn)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {areaTables.map((tbl) => (
                        <div
                          key={tbl.id}
                          onClick={() => handleSelectTable(tbl)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedTableId === tbl.id
                              ? 'bg-amber-100 border-amber-600 ring-2 ring-amber-500/30'
                              : tbl.status === 'occupied'
                              ? 'bg-amber-50 border-amber-300'
                              : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-md'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-stone-900 text-sm">{tbl.name}</span>
                            {selectedTableId === tbl.id && (
                              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                                <FiCheck className="stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">
                            Trạng thái:{' '}
                            <span className="text-stone-800 font-semibold">
                              {tbl.status === 'available' ? 'Trống' : tbl.status === 'occupied' ? 'Có khách' : tbl.status}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right POS Cart Drawer */}
        <CartDrawer
          onCheckout={() => {
            if (!shiftActive) {
              setIsOpenShiftModal(true);
              return;
            }
            setIsCheckoutOpen(true);
          }}
          onRequestOverride={(title, details, type, targetId, onSuccess) => {
            setOverrideModal({
              isOpen: true,
              title,
              details,
              type,
              targetId,
              onSuccess,
            });
          }}
        />
      </div>

      {/* Option Modal */}
      <ProductOptionModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, size, sugar, ice, options, qty, note, discountAmt) => {
          addItem(p, size, sugar, ice, options, qty, note, discountAmt);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Shift Modals */}
      <OpenShiftModal isOpen={isOpenShiftModal} onClose={() => setIsOpenShiftModal(false)} />
      <CloseShiftModal isOpen={isCloseShiftModal} onClose={() => setIsCloseShiftModal(false)} />

      {/* Manager Override Anti-Fraud Modal */}
      <ManagerOverrideModal
        isOpen={overrideModal.isOpen}
        onClose={() => setOverrideModal((prev) => ({ ...prev, isOpen: false }))}
        actionTitle={overrideModal.title}
        actionDetails={overrideModal.details}
        actionType={overrideModal.type}
        targetId={overrideModal.targetId}
        onApproved={() => {
          overrideModal.onSuccess();
        }}
      />
    </div>
  );
};
