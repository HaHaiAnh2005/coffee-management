import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const stores = [
    { name: 'Cơ sở Phạm Ngọc Thạch', address: 'B4 Phạm Ngọc Thạch, Đống Đa, Hà Nội' },
    { name: 'Cơ sở Đội Cấn', address: '115 Đội Cấn, Ba Đình, Hà Nội' },
    { name: 'Cơ sở Duy Tân', address: '14 Duy Tân, Cầu Giấy, Hà Nội' },
    { name: 'Cơ sở Phố Huế', address: '96 Phố Huế, Hai Bà Trưng, Hà Nội' },
    { name: 'Cơ sở Nguyễn Văn Lộc', address: '149 Nguyễn Văn Lộc, Hà Đông, Hà Nội' },
    { name: 'Cơ sở Lê Văn Lương', address: 'Tòa 18T1 Lê Văn Lương, Thanh Xuân, Hà Nội' },
    { name: 'Cơ sở Linh Đàm', address: 'Tòa 7TT3B Khu Biệt Thự Tây Nam Linh Đàm, Hoàng Mai, Hà Nội' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto text-stone-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#a3c7e4] via-[#b8d6ed] to-[#c7e0f2] rounded-3xl p-8 text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-800">
          ❀ LIÊN HỆ & HỆ THỐNG CỬA HÀNG 88 BỒNG BIÊNG
        </span>
        <h1 className="text-3xl font-bold text-stone-900">Kết Nối Với Chúng Mình</h1>
        <p className="text-xs text-stone-700">Mọi thắc mắc, góp ý hoặc đăng ký nhượng quyền hãy gửi tin nhắn cho Bông Biêng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info & Stores List */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-2">Thông Tin Trụ Sở</h3>
            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-center gap-3">
                <FiPhone className="text-[#2b6ba4] w-4 h-4" />
                <span>Hotline: <strong>1900 888 999</strong> (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-[#2b6ba4] w-4 h-4" />
                <span>Email: <strong>lienhe@bongbieng.com</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-2">Danh Sách Cửa Hàng ({stores.length})</h3>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {stores.map((s, idx) => (
                <div key={idx} className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-xs space-y-0.5">
                  <p className="font-bold text-stone-900">{s.name}</p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <FiMapPin className="text-[#2b6ba4] shrink-0" /> {s.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-2">Gửi Lời Nhắn Đến Bông Biêng</h3>

          {sent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 space-y-2">
              <p className="font-bold text-sm">Gửi tin nhắn thành công!</p>
              <p className="text-xs">Đội ngũ Bông Biêng đã nhận được lời nhắn của bạn và sẽ phản hồi sớm nhất.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#2b6ba4]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Số điện thoại:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0988..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#2b6ba4]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#2b6ba4]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nội dung tin nhắn:</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Góp ý sản phẩm, hỏi thông tin nhượng quyền..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3.5 text-stone-900 focus:outline-none focus:border-[#2b6ba4]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <FiSend /> Gửi Lời Nhắn
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
