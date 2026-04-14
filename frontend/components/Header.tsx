import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'about', label: 'Giới thiệu' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'process', label: 'Quy trình' },
    { id: 'contact', label: 'Liên hệ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <ImageWithFallback
              src="https://res.cloudinary.com/dt4zsrqho/image/upload/v1761494203/logo_u6rctw.jpg"
              alt="Công ty In N&T Logo"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors ${
                  currentPage === item.id
                    ? 'text-[#E62026]'
                    : 'text-[#374151] hover:text-[#E62026]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#374151] hover:text-[#E62026] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#E5E7EB]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 transition-colors ${
                  currentPage === item.id
                    ? 'text-[#E62026] bg-[#F9FAFB]'
                    : 'text-[#374151] hover:bg-[#F9FAFB] hover:text-[#E62026]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
