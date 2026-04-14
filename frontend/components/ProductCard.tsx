import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

export function ProductCard({ title, image, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg bg-white border border-[#E5E7EB] hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-[#1F2937] group-hover:text-[#E62026] transition-colors">
          {title}
        </h3>
      </div>
    </button>
  );
}
