import React from 'react';

export const Membership: React.FC = () => {
  const images = [
    { src: '/images/membership/policy1.jpg', alt: 'Chính sách tích điểm & đổi quà' },
    { src: '/images/membership/policy2.jpg', alt: 'Định mức chi tiêu xét lại hạng' },
    { src: '/images/membership/policy3.jpg', alt: 'Chính sách ưu đãi Về Một Nhà' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex flex-col items-center gap-8">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="w-full rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-white"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-auto object-cover block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
