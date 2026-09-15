import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/product.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiArrowRight } from 'react-icons/fi';
import { BannerCarousel } from '../../components/common/BannerCarousel';

export const Home: React.FC = () => {
  const allProducts = useProductStore((state) => state.products);
  const products = Array.isArray(allProducts) ? allProducts.slice(0, 4) : [];

  return (
    <div className="space-y-12 py-4">
      {/* Sliding Banner Carousel */}
      <BannerCarousel />

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-stone-900">
              Sản Phẩm Bông Biêng Nổi Bật
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Những thức uống hương hoa được yêu thích nhất</p>
          </div>
          <Link to="/menu" className="text-xs font-bold text-stone-900 hover:underline flex items-center gap-1">
            Xem tất cả <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative rounded-xl overflow-hidden h-48 bg-amber-50">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1">
                <Link
                  to={`/product/${p.id}`}
                  className="font-bold text-stone-950 text-base line-clamp-1 hover:text-amber-800 transition-colors block font-product tracking-wide"
                >
                  {p.name}
                </Link>
                <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-amber-100">
                <span className="font-extrabold text-amber-800 text-sm">{formatCurrency(p.price)}</span>
                <Link
                  to={`/product/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105"
                >
                  Xem món
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#a3c7e4]/30 text-stone-900 flex items-center justify-center font-bold text-xl">
            ❀
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Hoa Tươi Tự Nhiên</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Hoa nhài & hoa mộc được hái sáng sớm lúc ngát hương nhất để ướp cùng cốt trà Sơn La.
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#a3c7e4]/30 text-stone-900 flex items-center justify-center font-bold text-xl">
            🍵
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Ủ Trà Thấu Đêm</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Cốt trà ủ nhiệt 6 tiếng thấu đêm để hương hoa đượm sâu không gắt chát.
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#a3c7e4]/30 text-stone-900 flex items-center justify-center font-bold text-xl">
            🧋
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Kem Mây Thượng Hạng</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Lớp kem phô mai béo ngậy mềm mịn tạo sự cân bằng hoàn hảo cho ngụm trà.
          </p>
        </div>
      </section>
    </div>
  );
};
