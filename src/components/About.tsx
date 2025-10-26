import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { config } from '../config';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Sứ mệnh của chúng tôi',
      description: 'Cung cấp sản phẩm giấy in ấn chất lượng cao nhất, đáp ứng mọi nhu cầu của khách hàng từ cá nhân đến doanh nghiệp.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Khách hàng là trung tâm',
      description: 'Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu, với dịch vụ tư vấn và hỗ trợ tận tình.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Chất lượng đảm bảo',
      description: 'Mọi sản phẩm đều được kiểm soát chất lượng nghiêm ngặt, đảm bảo độ bền và tính thẩm mỹ cao.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Đổi mới không ngừng',
      description: 'Luôn cập nhật xu hướng thiết kế và công nghệ in ấn hiện đại nhất để phục vụ khách hàng tốt nhất.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về INNT
            </h1>
            <p className="text-xl text-gray-300">
              Đối tác tin cậy trong sản xuất sản phẩm giấy từ năm 1995
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Được thành lập từ năm 1995, INNT bắt đầu với tầm nhìn đơn giản: mang đến những sản phẩm 
                  giấy in ấn chất lượng cao cho mọi người. Từ một xưởng in nhỏ, chúng tôi đã phát triển 
                  thành một trong những đơn vị sản xuất phong bì, hộp quà, thiệp cưới hàng đầu.
                </p>
                <p>
                  Qua nhiều năm, chúng tôi đã xây dựng được mối quan hệ vững chắc với khách hàng và đối tác, 
                  cho phép chúng tôi cung cấp sản phẩm chất lượng với giá cả cạnh tranh. Cam kết về sự hài lòng 
                  của khách hàng đã giúp chúng tôi có được cộng đồng khách hàng trung thành.
                </p>
                <p>
                  Hôm nay, INNT là minh chứng cho sự tận tâm của chúng tôi với chất lượng, đổi mới và dịch vụ 
                  xuất sắc. Chúng tôi tiếp tục phát triển, mang đến những sản phẩm in ấn hiện đại nhất, 
                  từ phong bì văn phòng đến thiệp cưới cao cấp và hộp quà sang trọng.
                </p>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                alt="Đội ngũ của chúng tôi"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Products</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-gray-600">Top Brands</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">TechStore</h3>
              <p className="text-gray-400 mb-4">
                Your trusted destination for the latest technology and electronics.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 {config.phoneNumber}</li>
                <li>✉️ {config.email}</li>
                <li>📍 {config.address}</li>
                <li>🕒 Mon-Fri: 9AM-6PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
