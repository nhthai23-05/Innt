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
                Nổi bật
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Latest Tech at
                <span className="text-primary"> Amazing Prices</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover cutting-edge electronics, from smartphones to gaming gear. 
                Premium quality, competitive prices, fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => onNavigate('products')}
                >
                  Xem ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758186386318-42f7fb10f465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTA2NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Latest Technology"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                20% OFF
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
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">Free delivery on orders over $100</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2 Year Warranty</h3>
              <p className="text-gray-600 text-sm">Comprehensive warranty coverage</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock customer service</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Quality</h3>
              <p className="text-gray-600 text-sm">Premium products from top brands</p>
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
              Shop by Category
            </h2>
            <p className="text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
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
                Your trusted destination for the latest technology and electronics.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  Facebook
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  Twitter
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  Instagram
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Phím tắt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Trang chủ</button></li>
                <li><button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">Sản phẩm</button></li>
                <li><button className="hover:text-white transition-colors">Về chúng tôi</button></li>
                <li><button className="hover:text-white transition-colors">Liên hệ</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 {config.phoneNumber}</li>
                <li>✉️ {config.email}</li>
                <li>📍 {config.address}</li>
                <li>🕒 Mon-Sat: 8AM-5PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 1995 INNT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}