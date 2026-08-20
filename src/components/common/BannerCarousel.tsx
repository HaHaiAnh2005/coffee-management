import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export interface BannerSlide {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  price: string;
  image: string;
  badgeBg: string;
  ctaText?: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 'b1',
    productId: 'M101',
    title: 'Thanh Nhài (Bồng Biêng)',
    subtitle: 'Signature 88 Bồng Biêng',
    description: 'Trà sữa hoa nhài đậm vị hoa nhài tươi tự nhiên kết hợp sữa thơm béo dịu nhẹ.',
    tag: 'BEST SELLER #1',
    price: '55.000 đ',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
    badgeBg: 'bg-amber-700 text-white',
    ctaText: 'Đặt Ngay Món Này 🧋',
  },
  {
    id: 'b2',
    productId: 'M102',
    title: 'Song Nhài (Bồng Lai) ❀',
    subtitle: 'Trà Hương Hoa Đặc Sản',
    description: 'Cốt trà nhài ủ thấu đêm cùng hoa nhài tươi tự nhiên 6 tiếng. Thanh mát, dịu ngọt, thơm hương thiên nhiên.',
    tag: 'ĐẶC BIỆT THỦ CÔNG',
    price: '55.000 đ',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=80',
    badgeBg: 'bg-emerald-700 text-white',
    ctaText: 'Thưởng Thức Trà Nhài 🌸',
  },
  {
    id: 'b3',
    productId: 'M201',
    title: 'Đào Mây (Bồng Bềnh)',
    subtitle: 'Series Kem Mây Thượng Hạng',
    description: 'Ô long đào sữa phủ ngọn kem mây mềm mịn bồng bềnh tan chảy béo ngậy ngát hương.',
    tag: 'KEM MÂY MÁT LẠNH',
    price: '65.000 đ',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80',
    badgeBg: 'bg-amber-800 text-white',
    ctaText: 'Dùng Thử Đào Mây ☁️',
  },
  {
    id: 'b4',
    productId: 'M301',
    title: 'Nhài Cheese Kem Phô Mai',
    subtitle: 'Hương Vị Béo Mặn Sánh Mịn',
    description: 'Trà nhài tươi kết hợp màng kem phô mai béo mặn sánh mịn thơm bùi ngây ngất.',
    tag: 'MÓN PHÔ MAI HOT',
    price: '60.000 đ',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80',
    badgeBg: 'bg-orange-600 text-white',
    ctaText: 'Thử Nhài Cheese 🧀',
  },
];

interface BannerCarouselProps {
  slides?: BannerSlide[];
  autoPlayInterval?: number; // milliseconds
  className?: string;
  onSelectProduct?: (productId: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 4500,
  className = '',
  onSelectProduct,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [handleNext, isPaused, autoPlayInterval]);

  const currentSlide = slides[currentIndex];

  const handleBannerClick = () => {
    if (onSelectProduct) {
      onSelectProduct(currentSlide.productId);
    } else {
      navigate(`/product/${currentSlide.productId}`);
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-lg border border-amber-200/80 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 transition-all ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Main Banner Slide Container */}
      <div className="relative min-h-[340px] md:min-h-[380px] p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
        {/* Left Text Content */}
        <div
          onClick={handleBannerClick}
          className="space-y-4 max-w-xl text-stone-900 flex-1 cursor-pointer group/bannerText"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase shadow-xs ${currentSlide.badgeBg}`}
            >
              <FiStar className="inline mr-1" /> {currentSlide.tag}
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full border border-amber-300">
              {currentSlide.subtitle}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 leading-tight group-hover/bannerText:text-amber-800 transition-colors">
            {currentSlide.title}
          </h2>

          <p className="text-xs md:text-sm text-stone-700 font-medium leading-relaxed">
            {currentSlide.description}
          </p>

          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-stone-500 font-semibold">Giá ưu đãi:</span>
              <span className="text-xl md:text-2xl font-black text-amber-800">
                {currentSlide.price}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBannerClick();
              }}
              className="px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-900/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <FiShoppingBag className="w-4 h-4" /> {currentSlide.ctaText || 'Xem Chi Tiết Món'}
            </button>
          </div>
        </div>

        {/* Right Image Showcase Card */}
        <div
          onClick={handleBannerClick}
          className="relative w-full max-w-xs md:max-w-sm h-64 md:h-72 rounded-2xl overflow-hidden border-4 border-white shadow-xl shrink-0 group cursor-pointer"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-900 truncate">{currentSlide.title}</p>
                <p className="text-[10px] text-amber-800 font-semibold">{currentSlide.subtitle}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-700 text-white font-extrabold text-xs shadow-xs">
                {currentSlide.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons (Left / Right Chevron) */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 border border-amber-200/80 flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-110"
        title="Slide trước"
      >
        <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 border border-amber-200/80 flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-110"
        title="Slide tiếp"
      >
        <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Slide Indicators (Dots at bottom) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-200/60 shadow-xs">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${idx === currentIndex
                ? 'w-6 h-2 bg-amber-700'
                : 'w-2 h-2 bg-stone-300 hover:bg-amber-400'
              }`}
            title={`Chuyển tới slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
