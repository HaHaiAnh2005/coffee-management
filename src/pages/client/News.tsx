import React from 'react';
import { formatDate } from '../../utils/formatDate';

export const News: React.FC = () => {
  const newsList = [
    {
      id: 1,
      title: 'Bông Biêng Khai Trương Cơ Sở Mới Tại Phố Huế & Phạm Ngọc Thạch',
      date: '2026-07-20',
      category: 'Tin Tin Tức & Khuyến Mãi',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      summary: 'Hệ thống trà sữa hương hoa Bông Biêng chính thức mở rộng thêm 2 cơ sở mới với không gian sang trọng và nhiều phần quà tặng voucher 20k hấp dẫn.',
    },
    {
      id: 2,
      title: 'Bí Quyết Tạo Nên Dòng Trà Nhài Ủ Nhiệt 6 Tiếng Độc Bản Bông Biêng',
      date: '2026-07-15',
      category: 'Góc Trà Hương Hoa',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      summary: 'Khám phá quy trình chọn lựa từng nụ hoa nhài chín mọng lúc hừng sáng và nghệ thuật ủ trà lạnh không gắt chát độc quyền của Bông Biêng.',
    },
    {
      id: 3,
      title: 'Chương Trình Ngày Hội Thành Viên 15 Hằng Tháng - Free Upsize',
      date: '2026-07-10',
      category: 'Chính Sách Ưu Đãi',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
      summary: 'Tất cả thành viên khi đặt mua series Trà sữa hương hoa trực tiếp vào ngày 15 hằng tháng sẽ nhận ngay ưu đãi Free Upsize ly size L hoàn toàn miễn phí.',
    },
    {
      id: 4,
      title: 'Ra Mắt Dòng Sản Phẩm Cà Phê Muối Bông Biêng Thượng Hạng',
      date: '2026-07-01',
      category: 'Sản Phẩm Mới',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
      summary: 'Sự kết hợp hoàn hảo giữa Espresso đậm đà Robusta Đắk Lắk và lớp màng kem muối béo ngậy mặn nhẹ độc đáo.',
    },
  ];

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto text-stone-900">
      <div className="bg-gradient-to-r from-[#a3c7e4] via-[#b8d6ed] to-[#c7e0f2] rounded-3xl p-8 text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-800">
          ❀ TIN TỨC & SỰ KIỆN 88 BỒNG BIÊNG
        </span>
        <h1 className="text-3xl font-bold text-stone-900">Cập Nhật Thông Tin Mới Nhất</h1>
        <p className="text-xs text-stone-700">Khám phá các ưu đãi, cửa hàng mới và câu chuyện sản phẩm Bông Biêng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsList.map((item) => (
          <div key={item.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                <span className="text-[#2b6ba4]">{item.category}</span>
                <span>{formatDate(item.date, 'DD/MM/YYYY')}</span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm hover:text-[#2b6ba4] cursor-pointer">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
