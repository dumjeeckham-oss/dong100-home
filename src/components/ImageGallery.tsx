import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';

interface ImageGalleryProps {
  images: Array<{ image: any; alt?: string }>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  if (!images || images.length === 0) return null;

  const handlePrevious = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleLightboxPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleLightboxNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // 키보드 네비게이션
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleLightboxPrevious();
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleLightboxPrevious, handleLightboxNext]);

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

  // 다중 이미지인 경우 - 슬라이더 레이아웃
  return (
    <div className="my-6">
      <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((img, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <figure className="relative cursor-pointer" onClick={() => openLightbox(index)}>
                  <img
                    src={urlFor(img.image).width(1200).url()}
                    alt={img.alt || ''}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {index + 1} / {images.length}
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* 슬라이더 네비게이션 버튼 */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
          aria-label="이전 이미지"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
          aria-label="다음 이미지"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 썸네일 네비게이션 */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              index === selectedIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={urlFor(img.image).width(100).url()}
              alt={img.alt || ''}
              className="w-full h-full object-cover"
            />
          </button>
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
            onClick={handleLightboxPrevious}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-[210]"
            aria-label="이전 이미지"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-[90vh] relative">
            <img
              src={urlFor(images[selectedIndex].image).width(1600).url()}
              alt={images[selectedIndex].alt || ''}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          <button
            onClick={handleLightboxNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-[210]"
            aria-label="다음 이미지"
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
