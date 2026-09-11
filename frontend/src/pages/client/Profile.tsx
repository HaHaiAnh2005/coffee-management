import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { INITIAL_CUSTOMERS } from '../../api/customer.api';
import type { Customer } from '../../types/customer';
import { formatCurrency } from '../../utils/formatCurrency';
import { ImageDropzone } from '../../components/common/ImageDropzone';
import {
  FiUser,
  FiStar,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiLogOut,
  FiShield,
  FiEdit3,
  FiMapPin,
  FiCalendar,
  FiCheck,
  FiX,
  FiCamera,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'coffee_admin_customers_data';

const PRESET_AVATARS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', label: 'Nam 1' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', label: 'Nữ 1' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', label: 'Nữ 2' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', label: 'Nam 2' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', label: 'Nam 3' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', label: 'Nữ 3' },
  { id: 'av-7', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80', label: 'Coffee Accent' },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editGender, setEditGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [editBirthday, setEditBirthday] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-stone-200 rounded-3xl p-8 text-center space-y-4 shadow-md">
        <FiUser className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Chưa Đăng Nhập</h2>
        <p className="text-xs text-stone-500">Vui lòng đăng nhập để xem thông tin hồ sơ và điểm thưởng của bạn.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Đăng Nhập Ngay
        </button>
      </div>
    );
  }

  // Load customer details from LocalStorage or INITIAL_CUSTOMERS matching logged in user
  let customersData: Customer[] = INITIAL_CUSTOMERS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) customersData = JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse customers data', e);
  }

  const matchedCustomer = customersData.find(
    (c) => c.phone === user.phone || c.email.toLowerCase() === user.email.toLowerCase() || c.id === user.id
  );

  const rewardPoints = matchedCustomer ? matchedCustomer.rewardPoints : 240;
  const totalSpent = matchedCustomer ? matchedCustomer.totalSpent : 2400000;
  const tier = matchedCustomer ? matchedCustomer.tier : 'Vàng';

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleOpenEditModal = () => {
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditAvatar(user.avatar || '');
    setEditAddress(user.address || '');
    setEditGender(user.gender || 'Nam');
    setEditBirthday(user.birthday || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim()) {
      alert('Vui lòng nhập Họ và tên');
      return;
    }

    const updatedUserFields = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      avatar: editAvatar.trim(),
      address: editAddress.trim(),
      gender: editGender,
      birthday: editBirthday,
    };

    // 1. Update user state in auth store
    updateUser(updatedUserFields);

    // 2. Sync with localStorage coffee_admin_customers_data if user is customer or matched in list
    try {
      let savedList: Customer[] = INITIAL_CUSTOMERS;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) savedList = JSON.parse(raw);

      const targetIdx = savedList.findIndex(
        (c) => c.id === user.id || c.phone === user.phone || c.email.toLowerCase() === user.email.toLowerCase()
      );

      if (targetIdx !== -1) {
        savedList[targetIdx] = {
          ...savedList[targetIdx],
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
        };
      } else {
        // If not present in list, push new item
        savedList.push({
          id: user.id || `CUS-${Date.now().toString().slice(-4)}`,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          rewardPoints: rewardPoints,
          totalSpent: totalSpent,
          tier: tier,
          createdAt: new Date().toISOString().split('T')[0],
        });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList));
    } catch (err) {
      console.error('Error syncing edited customer profile to localStorage:', err);
    }

    setIsEditModalOpen(false);
    setSuccessMessage('Cập nhật hồ sơ cá nhân thành công!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-stone-900 py-4">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiUser className="text-amber-800" /> Hồ Sơ Cá Nhân
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Thông tin tài khoản và điểm thưởng thành viên Bồng Biêng</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEditModal}
            className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
          >
            <FiEdit3 className="w-3.5 h-3.5" /> Chỉnh sửa hồ sơ
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
          >
            <FiLogOut /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
              <FiCheck />
            </div>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
            <FiX />
          </button>
        </div>
      )}

      <div className="bg-white border border-amber-900/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden">
        {/* Top Header Profile Summary */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left border-b border-stone-100 pb-6">
          <div className="relative group cursor-pointer" onClick={handleOpenEditModal} title="Đổi ảnh đại diện">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-100 shadow-md group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-amber-800 text-white font-black text-3xl flex items-center justify-center border-4 border-amber-100 shadow-md">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <FiCamera className="w-6 h-6" />
            </div>
            <span
              className={`absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border ${
                tier === 'Kim Cương'
                  ? 'bg-cyan-500 text-white border-cyan-400'
                  : tier === 'Vàng'
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-slate-500 text-white border-slate-400'
              }`}
            >
              {tier}
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="font-extrabold text-stone-950 text-xl font-product tracking-wide">{user.name}</h2>
              {user.role === 'ADMIN' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-800 text-white text-[10px] font-bold flex items-center gap-1">
                  <FiShield /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {user.role === 'ADMIN' ? 'Tài Khoản Quản Lý Hệ Thống' : 'Khách Hàng Thành Viên 88 Bồng Biêng'}
            </p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                <FiStar className="fill-amber-500 text-amber-500 stroke-[2]" />
                <span>{rewardPoints} điểm tích lũy</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                <FiDollarSign className="text-emerald-700 stroke-[2.5]" />
                <span>Tổng chi: {formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Account Information */}
        <div className="space-y-4 text-xs text-stone-700">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Thông Tin Cá Nhân & Liên Hệ</h3>
            <button
              onClick={handleOpenEditModal}
              className="text-xs text-amber-800 hover:underline font-bold flex items-center gap-1"
            >
              <FiEdit3 /> Chỉnh sửa
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                <FiMail />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Địa chỉ Email</p>
                <p className="font-bold text-stone-900 truncate">{user.email || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                <FiPhone />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Số điện thoại</p>
                <p className="font-bold text-stone-900">{user.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                <FiMapPin />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Địa chỉ nhận hàng</p>
                <p className="font-bold text-stone-900 truncate">{user.address || 'Chưa cập nhật địa chỉ'}</p>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                <FiCalendar />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Giới tính / Ngày sinh</p>
                <p className="font-bold text-stone-900">
                  {user.gender || 'Nam'} {user.birthday ? `• ${user.birthday}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => navigate('/order-history')}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
          >
            📜 Xem Lịch Sử Đơn Hàng
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            ☕ Thưởng Thức Thực Đơn Ngay
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-fadeIn my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <FiEdit3 />
                </div>
                <h3 className="text-lg font-extrabold text-stone-900">Chỉnh Sửa Hồ Sơ Cá Nhân</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">Ảnh đại diện (Avatar):</label>

                {/* Preset Avatars Grid */}
                <div className="space-y-1">
                  <p className="text-[11px] text-stone-500 font-semibold">Chọn nhanh avatar có sẵn:</p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setEditAvatar(av.url)}
                        className={`relative rounded-full p-0.5 transition-all shrink-0 cursor-pointer ${
                          editAvatar === av.url ? 'ring-3 ring-amber-800 scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-11 h-11 rounded-full object-cover" />
                        {editAvatar === av.url && (
                          <div className="absolute -top-1 -right-1 bg-amber-800 text-white rounded-full p-0.5 text-[9px]">
                            <FiCheck />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload or Dropzone Component */}
                <ImageDropzone
                  value={editAvatar}
                  onChange={(val) => setEditAvatar(val)}
                  label="Hoặc tải ảnh mới từ máy tính / nhập URL"
                />
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Nhập số điện thoại..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Địa chỉ Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="vi-du@gmail.com..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Địa chỉ nhận hàng mặc định</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Ví dụ: 128 Nguyễn Huệ, Quận 1, TP.HCM..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Giới tính</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white font-medium"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Ngày sinh</label>
                  <input
                    type="date"
                    value={editBirthday}
                    onChange={(e) => setEditBirthday(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-800 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck className="stroke-[3]" /> Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
