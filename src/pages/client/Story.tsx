import React from 'react';

export const Story: React.FC = () => {
  const personalities = [
    {
      keyword: 'SÁNG TẠO',
      english: 'CREATIVE',
      image: '/images/story/story1.png',
      description:
        'Bông Biêng không ngừng khai phá những công thức trà ướp hoa tươi tự nhiên độc bản, tự hào kết hợp tinh hoa trà đạo truyền thống cùng kỹ thuật chế biến hiện đại.',
    },
    {
      keyword: 'TRUYỀN CẢM HƯỚNG',
      english: 'INSPIRING',
      image: '/images/story/story2.jpg',
      description:
        'Mỗi ly trà là một tác phẩm chứa đựng niềm đam mê và nguồn năng lượng tích cực, truyền cảm hứng sống tinh tế, thư thái đến từng giác quan người thưởng thức.',
    },
    {
      keyword: 'HỢP THỜI',
      english: 'TRENDY & MODERN',
      image: '/images/story/story3.png',
      description:
        'Nắm bắt xu hướng sống xanh, ưu tiên thành phần thiên nhiên lành mạnh cùng gu thẩm mỹ thanh lịch, định hình phong cách thưởng trà hiện đại của thế hệ trẻ.',
    },
  ];

  const brandGallery = [
    {
      image: '/images/brand/brand1.jpg',
      title: 'Cùng Chúng Mình Kể Chuyện Mùa Đông Với Ly Bông',
      subtitle: 'Modern Oriental Tea • Thanh Trà Dệt Hương',
      tag: 'Bao Bì Mới 2026',
    },
    {
      image: '/images/brand/brand6.jpg',
      title: 'Phong Cách Sống Đô Thị Thanh Lịch & Sang Trọng',
      subtitle: 'Sự kết hợp hoàn hảo giữa thời trang và nghệ thuật thưởng trà',
      tag: 'Urban Lifestyle',
    },
    {
      image: '/images/brand/brand7.jpg',
      title: 'Trà Sữa Nhãn Lồng Dừa Nướng Bông Biêng Thượng Hạng',
      subtitle: 'Trái nhãn tươi mọng nước kết hợp cơm dừa sấy giòn béo ngậy',
      tag: 'Signature Tea',
    },
    {
      image: '/images/brand/brand8.jpg',
      title: 'Thưởng Trà Matcha Kem Mây & Bánh Nướng Croissant',
      subtitle: 'Combo trà bánh hoàn hảo cho buổi chiều thư thái',
      tag: 'Tea & Bakery',
    },
    {
      image: '/images/brand/brand2.jpg',
      title: 'Trà Nho Tươi Bông Biêng & Khoảnh Khắc Dã Ngoại',
      subtitle: 'Hương vị hoa quả tự nhiên ngọt thanh dịu mát',
      tag: 'Outdoor Picnic',
    },
    {
      image: '/images/brand/brand3.jpg',
      title: 'Bộ Ly Bông Trắng Họa Tiết Hoa Nhài Dệt Tinh Tế',
      subtitle: 'Thiết kế nhận diện thương hiệu độc quyền 88 Bông Biêng',
      tag: 'Packaging Design',
    },
    {
      image: '/images/brand/brand4.jpg',
      title: 'Nghệ Thuật Chế Biến Series Trà Sữa Kem Mây Phô Mai',
      subtitle: 'Lớp kem béo ngậy phủ topping dừa nướng thơm lừng',
      tag: 'Artisan Craft',
    },
    {
      image: '/images/brand/brand5.jpg',
      title: 'Trà Trái Cây Bông Biêng - Người Bạn Đồng Hành Thanh Lịch',
      subtitle: 'Gu sống tinh tế, hiện đại cho mỗi ngày mới',
      tag: 'Modern Living',
    },
  ];

  return (
    <div className="space-y-14 py-6 max-w-5xl mx-auto text-stone-900">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#a3c7e4] via-[#b8d6ed] to-[#c7e0f2] border border-[#8eb7d8] rounded-3xl p-8 md:p-14 text-center space-y-4 shadow-sm">
        <span className="text-xs font-extrabold uppercase tracking-widest text-stone-800">
          ❀ CÂU CHUYỆN THƯƠNG HIỆU 88 BỒNG BIÊNG
        </span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900">
          Chuyện Bông Biêng - Thanh Trà Dệt Hương
        </h1>
        <p className="text-xs md:text-sm text-stone-700 max-w-2xl mx-auto leading-relaxed font-medium">
          Chúng tôi sáng tạo nên một câu chuyện mới mẻ về sự mê hoặc của từng lớp hương hoa phương Đông. Nơi mỗi ly trà Bông Biêng là một tác phẩm được thêu dệt tinh tế từ hoa tươi chọn lọc.
        </p>
      </section>

      {/* Brand Personality Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2b6ba4]">
            ❀ DNA THƯƠNG HIỆU
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
            Tính Cách Thương Hiệu 88 Bông Biêng
          </h2>
          <p className="text-xs text-stone-600 max-w-xl mx-auto">
            3 Giá trị cốt lõi định hình nên tâm hồn và bản sắc nghệ thuật thưởng trà Bông Biêng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalities.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-96 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.keyword}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/40">
                    {item.english}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-wide mt-2 text-white shadow-sm">
                    {item.keyword}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Gallery Section (8 Hình Ảnh Thương Hiệu Bông Biêng) */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2b6ba4]">
            ❀ BỘ SƯU TẬP HÌNH ẢNH THƯƠNG HIỆU (8 IMAGES)
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
            Hình Ảnh Thương Hiệu & Phong Cách Sống 88 Bông Biêng
          </h2>
          <p className="text-xs text-stone-600 max-w-xl mx-auto">
            Những khoảnh khắc thanh lịch, nghệ thuật bao bì Ly Bông và câu chuyện phong cách sống hiện đại
          </p>
        </div>

        {/* Featured Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Large Card 1 */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-md group relative">
            <div className="h-[480px] w-full overflow-hidden">
              <img
                src={brandGallery[0].image}
                alt={brandGallery[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-8 text-white space-y-2">
              <span className="self-start text-[10px] font-extrabold uppercase tracking-widest bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
                {brandGallery[0].tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif-title font-bold leading-tight">
                {brandGallery[0].title}
              </h3>
              <p className="text-xs text-stone-200 font-medium">{brandGallery[0].subtitle}</p>
            </div>
          </div>

          {/* 7 Cards Grid */}
          {brandGallery.slice(1).map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-80 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-stone-900/80 text-white backdrop-blur-md px-3 py-1 rounded-full border border-stone-700">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-1">
                <h4 className="font-bold text-stone-900 text-base leading-snug group-hover:text-[#2b6ba4] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 font-medium">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Story Content Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2b6ba4]">
            01. CẢM HỨNG SÁNG TẠO
          </span>
          <h2 className="text-2xl font-bold text-stone-900">Hương Hoa Tinh Khôi Giữa Lòng Đô Thị</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Bông Biêng khởi nguồn từ khát khao mang hương vị hoa tự nhiên Việt Nam kết hợp cùng kỹ thuật ủ trà truyền thống. Không sử dụng hương liệu hóa học nhân tạo, chúng tôi kiên trì lựa chọn những nụ hoa nhài tươi chín mọng lúc hừng sáng và hoa mộc vàng ngát hương.
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            Mỗi ngụm trà khi thưởng thức mang theo sự êm dịu thanh mát, đượm thấu thắt lòng người như chính cái tên gọi Bông Biêng đằm thắm.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-md h-80 bg-stone-200 border border-stone-200">
          <img
            src="/images/brand/brand3.jpg"
            alt="Ủ Trà Hương Hoa Bông Biêng"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
        <div className="rounded-3xl overflow-hidden shadow-md h-80 bg-stone-200 border border-stone-200 order-2 md:order-1">
          <img
            src="/images/brand/brand4.jpg"
            alt="Nghệ Thuật Trà Bông Biêng"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 order-1 md:order-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2b6ba4]">
            02. QUY TRÌNH KỲ CÔNG
          </span>
          <h2 className="text-2xl font-bold text-stone-900">6 Tiếng Ủ Nhiệt Thấu Đêm</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Cốt trà Bông Biêng không nấu ép vội vã. Lá trà Sơn La ngát vị được ướp xếp lớp cùng hoa tươi và ủ lạnh thấu đêm kéo dài 6 tiếng đồng hồ. Sự kiên nhẫn ấy giúp từng tinh chất hoa ngấm sâu vào từng sợi trà mà không sinh vị gắt chát.
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            Lớp kem mây phô mai mềm mịn phủ trên cùng là sự hoàn hảo cuối cùng, tôn lên vị béo ngậy thanh nhã dịu dàng.
          </p>
        </div>
      </section>
    </div>
  );
};
