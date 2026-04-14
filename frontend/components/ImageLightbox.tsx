import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: ImageLightboxProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-[#E62026] transition-colors"
      >
        <X size={32} />
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 text-white hover:text-[#E62026] transition-colors"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* Image */}
      <div className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
        <ImageWithFallback
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 text-white hover:text-[#E62026] transition-colors"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
