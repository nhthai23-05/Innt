import { MapPin, Mail, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'about', label: 'Giới thiệu' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'process', label: 'Quy trình' },
    { id: 'contact', label: 'Liên hệ' },
  ];

  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <ImageWithFallback
                src="https://res.cloudinary.com/dt4zsrqho/image/upload/v1761494203/logo_u6rctw.jpg"
                alt="Công ty In N&T Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Giải pháp sản xuất & in ấn bao bì tùy chỉnh hàng đầu tại Việt Nam. 
              Chất lượng cao, giao hàng đúng hẹn, dịch vụ chuyên nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-gray-300 hover:text-[#E62026] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#E62026] flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#E62026] flex-shrink-0" />
                <a href="tel:+84123456789" className="text-gray-300 hover:text-[#E62026] transition-colors">
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#E62026] flex-shrink-0" />
                <a href="mailto:contact@nt-packaging.vn" className="text-gray-300 hover:text-[#E62026] transition-colors">
                  contact@nt-packaging.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Công ty In N&T. Bản quyền thuộc về N&T.</p>
        </div>
      </div>
    </footer>
  );
}
