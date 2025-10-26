import { useState } from 'react';
import { ArrowLeft, Share2, Mail, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { ProductCard } from './ProductCard';
import { products } from '../data/products';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { config } from '../config';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string) => void;
  onProductClick: (productId: string) => void;
}

export function ProductDetail({ productId, onNavigate, onProductClick }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <Button onClick={() => onNavigate('products')}>
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <button onClick={() => onNavigate('home')} className="hover:text-primary">
                Home
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <button onClick={() => onNavigate('products')} className="hover:text-primary">
                Products
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('products')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <ImageWithFallback
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-primary text-white">
                  Sản phẩm nổi bật
                </Badge>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-primary font-medium mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Category */}
              <div className="mb-6">
                <Badge className="bg-gray-100 text-gray-800">
                  {product.category}
                </Badge>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✓ Còn hàng
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Hết hàng
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <Button
                  asChild
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  <a href={config.contactUrl} target="_blank" rel="noopener noreferrer">
                    <Mail className="h-5 w-5 mr-2" />
                    Liên hệ báo giá
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Truck className="h-5 w-5 mr-3 text-primary" />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-5 w-5 mr-3 text-primary" />
                  <span>Sản phẩm chất lượng cao</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <RotateCcw className="h-5 w-5 mr-3 text-primary" />
                  <span>Tùy chỉnh theo yêu cầu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-16">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Sản phẩm cao cấp từ {product.brand} được thiết kế và sản xuất với tiêu chuẩn chất lượng cao nhất. 
                    Chúng tôi cam kết mang đến cho khách hàng những sản phẩm giấy in ấn hoàn hảo, 
                    phù hợp cho mọi nhu cầu từ cá nhân đến doanh nghiệp.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium text-gray-900">{key}:</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}