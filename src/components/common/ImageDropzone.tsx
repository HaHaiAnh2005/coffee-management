import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiLink } from 'react-icons/fi';

interface ImageDropzoneProps {
  value: string; // URL or Data URL
  onChange: (value: string) => void;
  label?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  value,
  onChange,
  label = 'Hình ảnh sản phẩm',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, WEBP, GIF...)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-stone-600 font-bold">{label}:</label>
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-200 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              activeTab === 'upload'
                ? 'bg-amber-700 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Kéo thả / Tải tệp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              activeTab === 'url'
                ? 'bg-amber-700 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dùng URL
          </button>
        </div>
      </div>

      {/* Live Image Preview if available */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-amber-200 bg-amber-50/50 p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-xl border border-white shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate">Hình ảnh đã chọn</p>
            <p className="text-[11px] text-stone-500 truncate">
              {value.startsWith('data:') ? 'Tệp ảnh tải từ máy tính' : value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-600 transition-colors"
            title="Đổi ảnh khác"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : activeTab === 'upload' ? (
        /* Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-amber-600 bg-amber-100/70 scale-[1.01]'
              : 'border-amber-200/90 bg-amber-50/40 hover:bg-amber-100/50 hover:border-amber-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
            <FiUploadCloud className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div>
            <p className="text-xs font-bold text-stone-800">
              Kéo & thả ảnh từ máy tính vào đây
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              hoặc <span className="text-amber-800 underline font-semibold">nhấp để chọn ảnh</span> từ thư mục
            </p>
          </div>
          <span className="text-[10px] text-stone-400">Hỗ trợ PNG, JPG, WEBP, GIF...</span>
        </div>
      ) : (
        /* Direct URL Input */
        <div className="relative">
          <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Dán đường dẫn URL hình ảnh (https://...)"
            className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600"
          />
        </div>
      )}
    </div>
  );
};
