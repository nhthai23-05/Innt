import { ArrowRight, Star, Truck, Shield, Headphones, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ProductCard } from './ProductCard';
import { products, categories } from '../data/products';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { config } from '../config';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onProductClick: (productId: string) => void;
}

export function HomePage({ onNavigate, onProductClick }: HomePageProps) {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary text-white">
                Chuyên nghiệp - Uy tín - Chất lượng
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sản xuất sản phẩm giấy
                <span className="text-primary"> chất lượng cao</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Chuyên sản xuất phong bì, hộp quà, thiệp cưới và các sản phẩm in ấn cao cấp. 
                Phục vụ nhu cầu cá nhân và doanh nghiệp trên toàn quốc.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => onNavigate('products')}
                >
                  Xem sản phẩm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                  onClick={() => onNavigate('about')}
                >
                  Về chúng tôi
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://res.cloudinary.com/dt4zsrqho/image/upload/v1761494203/logo_u6rctw.jpg"
                alt="Sản phẩm giấy chất lượng cao"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                Từ 1995
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Giao hàng toàn quốc</h3>
              <p className="text-gray-600 text-sm">Giao hàng nhanh chóng khắp Việt Nam</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600 text-sm">Cam kết sản phẩm chất lượng cao</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600 text-sm">Tư vấn và hỗ trợ khách hàng liên tục</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Kinh nghiệm 30 năm</h3>
              <p className="text-gray-600 text-sm">Uy tín được khẳng định từ 1995</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Các sản phẩm nổi bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các sản phẩm nổi bật của công ty chúng tôi ngay tại đây
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('products')}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Danh mục sản phẩm
            </h2>
            <p className="text-gray-600">
              Khám phá đa dạng sản phẩm của chúng tôi
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => onNavigate('products')}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.count} sản phẩm</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">INNT</h3>
              <p className="text-gray-400 mb-4">
                Công ty sản xuất sản phẩm giấy chất lượng cao, phục vụ nhu cầu in ấn của khách hàng từ 1995.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  Facebook
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  Zalo
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Trang chủ</button></li>
                <li><button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">Sản phẩm</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Về chúng tôi</button></li>
                <li><a href={config.contactUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 {config.phoneNumber}</li>
                <li>✉️ {config.email}</li>
                <li>📍 {config.address}</li>
                <li>🕒 Thứ 2 - Thứ 7: 8h - 17h</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 1995-2025 INNT. Bản quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}