import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Product } from '../data/products';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-0">
        <div onClick={() => onProductClick(product.id)}>
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-t-lg">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3">
              {product.featured && (
                <Badge className="bg-primary text-white">
                  Nổi bật
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-1">{product.category}</p>
              <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>

            {/* Description Preview */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                Xem chi tiết →
              </span>
              
              {!product.inStock && (
                <Badge variant="secondary" className="text-xs">
                  Hết hàng
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}