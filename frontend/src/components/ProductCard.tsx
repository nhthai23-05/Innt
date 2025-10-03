import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Product } from '../data/products';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
              {discountPercentage > 0 && (
                <Badge className="bg-primary text-white">
                  -{discountPercentage}%
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

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              {!product.inStock && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}