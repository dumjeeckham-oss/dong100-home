import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: Array<{ image: any; alt?: string }>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // 단일 이미지인 경우
  if (images.length === 1) {
    const img = images[0];
    return (
      <figure className="my-6">
        <img
          src={urlFor(img.image).width(1200).url()}
          alt={img.alt || ''}
          className="rounded-lg w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
        />
      </figure>
    );
  }

  // 다중 이미지인 경우 - 그리드 레이아웃
  return (
    <div className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, index) => (
          <figure
            key={index}
            className={`relative group cursor-pointer overflow-hidden rounded-lg ${
              index === 0 && images.length > 2 ? 'sm:col-span-2' : ''
            }`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={urlFor(img.image).width(800).url()}
              alt={img.alt || ''}
              className="w-full h-auto object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm transition-opacity">
                {index + 1} / {images.length}
              </span>
            </div>
          </figure>
        ))}
      </div>

      {/* 라이트박스 */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[210]"
            aria-label="닫기"
          >
            <X size={32} />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-[210]"
            aria-label="이전 이미지"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-[90vh] relative">
            <img
              src={urlFor(images[currentIndex].image).width(1600).url()}
              alt={images[currentIndex].alt || ''}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-[210]"
            aria-label="다음 이미지"
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
