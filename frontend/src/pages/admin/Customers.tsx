import React, { useState, useEffect } from 'react';
import { INITIAL_CUSTOMERS, calculateCustomerTier, customerApi } from '../../api/customer.api';
import type { Customer, CustomerTier } from '../../types/customer';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  FiUsers,
  FiUserPlus,
  FiStar,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiX,
  FiCheck,
  FiAward,
  FiGift,
  FiSliders,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiInfo,
} from 'react-icons/fi';

const STORAGE_KEY = 'coffee_admin_customers_data';

export const Customers: React.FC = () => {
  // Load initial state from LocalStorage if available
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse customers from localStorage', e);
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Fetch live customers from MongoDB API on load
  useEffect(() => {
    const fetchLiveCustomers = async () => {
      const liveData = await customerApi.getAll();
      if (Array.isArray(liveData) && liveData.length > 0) {
        setCustomers(liveData);
      }
    };
    fetchLiveCustomers();
  }, []);

  // Filter & Search & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'points-desc' | 'spent-desc' | 'newest'>('points-desc');

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<Customer | null>(null);
  const [pointsChangeType, setPointsChangeType] = useState<'add' | 'subtract'>('add');
  const [pointsAmount, setPointsAmount] = useState<number>(50);
  const [pointsReason, setPointsReason] = useState<string>('');

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to LocalStorage whenever customers array updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Form State for Customer Add/Edit
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: '',
    email: '',
    tier: 'Bạc' as CustomerTier,
    rewardPoints: 0,
    totalSpent: 0,
    notes: '',
  });

  // Handle Open Add Customer Modal
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      code: `CUS-${Date.now().toString().slice(-4)}`,
      name: '',
      phone: '',
      email: '',
      tier: 'Bạc',
      rewardPoints: 0,
      totalSpent: 0,
      notes: '',
    });
    setIsCustomerModalOpen(true);
  };

  // Handle Open Edit Customer Modal
  const handleOpenEditModal = (cus: Customer) => {
    setEditingCustomer(cus);
    setFormData({
      code: cus.id,
      name: cus.name,
      phone: cus.phone,
      email: cus.email,
      tier: cus.tier,
      rewardPoints: cus.rewardPoints,
      totalSpent: cus.totalSpent,
      notes: cus.notes || '',
    });
    setIsCustomerModalOpen(true);
  };

  // Delete Customer
  const handleDeleteCustomer = async (cus: Customer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${cus.name}" (${cus.phone}) không?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== cus.id));
      await customerApi.delete(cus.id);
      showToast(`Đã xóa khách hàng ${cus.name}`);
    }
  };

  // Save Customer (Create or Update)
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }

    if (editingCustomer) {
      // Update
      const autoTier = calculateCustomerTier(formData.totalSpent);
      const updatedData: Partial<Customer> = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        tier: formData.tier || autoTier,
        rewardPoints: Number(formData.rewardPoints) || 0,
        totalSpent: Number(formData.totalSpent) || 0,
        notes: formData.notes.trim(),
      };
      const updatedList = customers.map((c) =>
        c.id === editingCustomer.id
          ? {
              ...c,
              ...updatedData,
            }
          : c
      );
      setCustomers(updatedList);
      await customerApi.update(editingCustomer.id, updatedData);
      showToast(`Đã cập nhật thông tin khách hàng ${formData.name}`);
    } else {
      // Create new
      const autoTier = calculateCustomerTier(Number(formData.totalSpent) || 0);
      const newCustomer: Customer = {
        id: formData.code.trim() || `CUS-${Date.now().toString().slice(-4)}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        rewardPoints: Number(formData.rewardPoints) || 0,
        totalSpent: Number(formData.totalSpent) || 0,
        tier: formData.tier || autoTier,
        createdAt: new Date().toISOString().split('T')[0],
        notes: formData.notes.trim(),
      };
      setCustomers([...customers, newCustomer]);
      await customerApi.create(newCustomer);
      showToast(`Đã thêm mới khách hàng ${formData.name}`);
    }

    setIsCustomerModalOpen(false);
  };

  // Open Points Adjustment Modal
  const handleOpenPointsModal = (cus: Customer) => {
    setSelectedCustomerForPoints(cus);
    setPointsChangeType('add');
    setPointsAmount(50);
    setPointsReason('Tích điểm mua hàng');
    setIsPointsModalOpen(true);
  };

  // Save Points Change
  const handleSavePoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForPoints || pointsAmount <= 0) return;

    const changeVal = pointsChangeType === 'add' ? pointsAmount : -pointsAmount;
    let newPoints = 0;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === selectedCustomerForPoints.id) {
          newPoints = Math.max(0, c.rewardPoints + changeVal);
          return {
            ...c,
            rewardPoints: newPoints,
          };
        }
        return c;
      })
    );

    await customerApi.update(selectedCustomerForPoints.id, { rewardPoints: newPoints });

    showToast(
      pointsChangeType === 'add'
        ? `Đã cộng +${pointsAmount} điểm cho ${selectedCustomerForPoints.name}`
        : `Đã trừ -${pointsAmount} điểm của ${selectedCustomerForPoints.name}`
    );

    setIsPointsModalOpen(false);
  };

  // Quick Inline Adjust Points (+/- 10 points shortcut)
  const handleQuickAdjustPoints = async (cusId: string, amount: number) => {
    let updatedPoints = 0;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === cusId) {
          updatedPoints = Math.max(0, c.rewardPoints + amount);
          return { ...c, rewardPoints: updatedPoints };
        }
        return c;
      })
    );
    await customerApi.update(cusId, { rewardPoints: updatedPoints });
    const cus = customers.find((c) => c.id === cusId);
    if (cus) {
      showToast(`${amount > 0 ? `+${amount}` : amount} điểm cho ${cus.name}`);
    }
  };

  // Filtered & Sorted Customer List
  let filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;

    return matchesSearch && matchesTier;
  });

  if (sortBy === 'points-desc') {
    filteredCustomers = [...filteredCustomers].sort((a, b) => b.rewardPoints - a.rewardPoints);
  } else if (sortBy === 'spent-desc') {
    filteredCustomers = [...filteredCustomers].sort((a, b) => b.totalSpent - a.totalSpent);
  } else if (sortBy === 'name') {
    filteredCustomers = [...filteredCustomers].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } else if (sortBy === 'newest') {
    filteredCustomers = [...filteredCustomers].sort((a, b) => (b.id > a.id ? 1 : -1));
  }

  // Aggregate KPI Stats
  const totalCustomersCount = customers.length;
  const vipCount = customers.filter((c) => c.tier === 'Vàng' || c.tier === 'Kim Cương').length;
  const totalPointsSum = customers.reduce((sum, c) => sum + c.rewardPoints, 0);
  const totalRevenueSum = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6 pb-12 text-stone-900">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-sky-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-sky-300 animate-in fade-in slide-in-from-top-4">
          <FiCheck className="w-5 h-5 stroke-[3]" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2.5">
            <FiUsers className="text-sky-600 w-7 h-7" /> Quản Lý Khách Hàng & Điểm Thưởng
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý danh sách khách hàng thành viên, phân hạng tự động và điều chỉnh điểm tích lũy
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <FiUserPlus className="w-4 h-4 stroke-[2.5]" /> Thêm Khách Hàng Mới
        </button>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
            <FiUsers />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Tổng Khách Hàng</p>
            <p className="text-2xl font-black text-stone-900 mt-0.5">{totalCustomersCount}</p>
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl">
            <FiAward />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Thành Viên VIP</p>
            <p className="text-2xl font-black text-sky-800 mt-0.5">
              {vipCount} <span className="text-xs font-normal text-stone-500">khách</span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xl">
            <FiStar />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Điểm Tích Lũy Đang Có</p>
            <p className="text-2xl font-black text-cyan-800 mt-0.5">
              {totalPointsSum.toLocaleString('vi-VN')} <span className="text-xs font-normal text-stone-500">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            <FiDollarSign />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Tổng Doanh Thu</p>
            <p className="text-xl font-black text-emerald-800 mt-0.5">{formatCurrency(totalRevenueSum)}</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Tier Filters, Sorting */}
      <div className="bg-white border border-sky-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, SĐT, Email, Mã..."
            className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Bạc', label: 'Bạc' },
            { id: 'Vàng', label: 'Vàng 🌟' },
            { id: 'Kim Cương', label: 'Kim Cương 💎' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTier === t.id
                  ? 'bg-sky-600 text-white shadow-md font-extrabold'
                  : 'bg-sky-50/50 text-stone-700 hover:bg-sky-100 border border-sky-200/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-700">
            <FiSliders className="text-sky-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="points-desc" className="bg-white text-stone-900">Xếp: Điểm cao → thấp</option>
              <option value="spent-desc" className="bg-white text-stone-900">Xếp: Chi tiêu nhiều nhất</option>
              <option value="name" className="bg-white text-stone-900">Xếp: Tên A-Z</option>
              <option value="newest" className="bg-white text-stone-900">Xếp: Mới nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-sky-50/80 text-stone-700 uppercase tracking-wider border-b border-sky-100 text-[11px] font-bold">
                <th className="p-4">Mã KH / Khách Hàng</th>
                <th className="p-4">Thông tin liên hệ</th>
                <th className="p-4">Hạng thành viên</th>
                <th className="p-4">Điểm tích lũy</th>
                <th className="p-4 text-right">Tổng chi tiêu</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/60 text-stone-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-500">
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cus) => {
                  const initials = cus.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={cus.id} className="hover:bg-sky-50/40 transition-colors">
                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-stone-900 text-sm leading-snug">{cus.name}</p>
                            <p className="text-[10px] text-stone-500 font-mono tracking-tight">{cus.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                          <FiPhone className="text-sky-600 w-3 h-3" /> {cus.phone}
                        </div>
                        {cus.email && (
                          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                            <FiMail className="text-stone-400 w-3 h-3" /> {cus.email}
                          </div>
                        )}
                      </td>

                      {/* Tier Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs ${
                            cus.tier === 'Kim Cương'
                              ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                              : cus.tier === 'Vàng'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          <FiAward className="w-3.5 h-3.5" /> {cus.tier}
                        </span>
                      </td>

                      {/* Reward Points */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sky-700 font-black text-sm">
                            <FiStar className="fill-sky-500 text-sky-600 w-3.5 h-3.5" />
                            <span>{cus.rewardPoints} đ</span>
                          </div>
                          {/* Quick Adjust Buttons */}
                          <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleQuickAdjustPoints(cus.id, 10)}
                              className="w-5 h-5 rounded bg-sky-100 text-sky-800 hover:bg-sky-600 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
                              title="+10 điểm tích lũy"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleQuickAdjustPoints(cus.id, -10)}
                              className="w-5 h-5 rounded bg-rose-100 text-rose-800 hover:bg-rose-600 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
                              title="-10 điểm"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Total Spent */}
                      <td className="p-4 text-right font-extrabold text-stone-900">
                        {formatCurrency(cus.totalSpent)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenPointsModal(cus)}
                            className="p-1.5 rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors"
                            title="Đổi / Cộng điểm thưởng"
                          >
                            <FiGift className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(cus)}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            title="Sửa thông tin"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(cus)}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-500 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Xóa khách hàng"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <FiUserPlus className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-stone-900 text-base">
                  {editingCustomer ? 'Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới'}
                </h2>
              </div>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCustomer} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-bold mb-1">Mã Khách Hàng</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: CUS-006"
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912..."
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Hạng Thành Viên</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as CustomerTier })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Bạc">Bạc (Silver)</option>
                    <option value="Vàng">Vàng (Gold)</option>
                    <option value="Kim Cương">Kim Cương (Diamond)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Điểm Thưởng Tích Lũy</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.rewardPoints}
                    onChange={(e) => setFormData({ ...formData, rewardPoints: Number(e.target.value) })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Tổng Chi Tiêu (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.totalSpent}
                  onChange={(e) => setFormData({ ...formData, totalSpent: Number(e.target.value) })}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thói quen đồ uống, voucher ưu đãi..."
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black cursor-pointer shadow-md transition-all"
                >
                  {editingCustomer ? 'Cập Nhật' : 'Tạo Khách Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {isPointsModalOpen && selectedCustomerForPoints && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            {/* Points Modal Header */}
            <div className="p-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <FiGift className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-stone-900 text-base">Điều Chỉnh Điểm Thưởng</h2>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {selectedCustomerForPoints.name} ({selectedCustomerForPoints.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPointsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSavePoints} className="p-5 space-y-4 text-xs">
              {/* Current Points Banner */}
              <div className="bg-sky-50/50 border border-sky-200 p-3.5 rounded-xl flex items-center justify-between">
                <span className="text-stone-600 font-bold">Điểm thưởng hiện tại:</span>
                <span className="text-lg font-black text-sky-700 flex items-center gap-1">
                  <FiStar className="fill-sky-500 text-sky-600 w-4 h-4" />
                  {selectedCustomerForPoints.rewardPoints} đ
                </span>
              </div>

              {/* Mode Toggle (Cộng / Trừ) */}
              <div>
                <label className="block text-stone-600 font-bold mb-1.5">Loại thao tác</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPointsChangeType('add')}
                    className={`py-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      pointsChangeType === 'add'
                        ? 'bg-sky-600 border-sky-600 text-white font-black shadow-md'
                        : 'bg-sky-50/40 border-sky-200 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <FiPlus /> Cộng Điểm (Tích lũy)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointsChangeType('subtract')}
                    className={`py-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      pointsChangeType === 'subtract'
                        ? 'bg-rose-600 border-rose-500 text-white font-black shadow-md'
                        : 'bg-sky-50/40 border-sky-200 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <FiMinus /> Trừ Điểm (Quy đổi)
                  </button>
                </div>
              </div>

              {/* Quick Amount Selector */}
              <div>
                <label className="block text-stone-600 font-bold mb-1.5">Chọn nhanh số điểm</label>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPointsAmount(amt)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        pointsAmount === amt
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-sky-50/40 border-sky-200 text-stone-700 hover:border-sky-400'
                      }`}
                    >
                      {pointsChangeType === 'add' ? `+${amt}` : `-${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Points Amount */}
              <div>
                <label className="block text-stone-600 font-bold mb-1">Số điểm điều chỉnh</label>
                <input
                  type="number"
                  min="1"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-sky-500 font-bold text-sm"
                />
              </div>

              {/* Reason / Note */}
              <div>
                <label className="block text-stone-600 font-bold mb-1">Lý do điều chỉnh</label>
                <input
                  type="text"
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  placeholder="VD: Thưởng mua hàng hóa đơn #1024, Đổi voucher 50k..."
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setIsPointsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-black cursor-pointer shadow-md transition-all ${
                    pointsChangeType === 'add'
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  Xác Nhận {pointsChangeType === 'add' ? 'Cộng Điểm' : 'Trừ Điểm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
