import { useState } from 'react';
import { Search, Menu, X, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { config } from '../config';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onSearch: (query: string) => void;
}

export function Header({ onNavigate, currentPage, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('products');
  };

  const navigation = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'products' },
    { name: 'About', page: 'about' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              TechStore
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className={`${
                  currentPage === item.page
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                } pb-1 transition-colors duration-200`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button className="lg:hidden p-2 text-gray-600 hover:text-primary">
              <Search className="h-5 w-5" />
            </button>

            {/* Contact Button */}
            <Button
              asChild
              className="hidden sm:flex bg-primary hover:bg-primary/90 text-white"
            >
              <a href={config.contactUrl} target="_blank" rel="noopener noreferrer">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </a>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white absolute left-0 right-0 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.page);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2 px-3 rounded-md ${
                      currentPage === item.page
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <a
                  href={config.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}