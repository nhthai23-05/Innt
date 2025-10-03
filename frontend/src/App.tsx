import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { About } from './components/About';

type Page = 'home' | 'products' | 'product-detail' | 'about';

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
      case 'about':
        return <About onNavigate={handleNavigate} />;
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