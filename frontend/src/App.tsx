import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';

type Page = 'home' | 'products' | 'product-detail' | 'cart' | 'auth' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
          />
        );
      case 'products':
        return (
          <ProductListing
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
            searchQuery={searchQuery}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
          />
        );
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'auth':
        return <Auth onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onSearch={handleSearch}
      />
      <main>{renderPage()}</main>
    </div>
  );
}