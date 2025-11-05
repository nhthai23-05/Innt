import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StickyContactButton } from './components/StickyContactButton';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';

type Page = 'home' | 'about' | 'products' | 'product-detail' | 'process' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [categoryId, setCategoryId] = useState<string>('boxes');

  const handleNavigate = (page: string, categoryIdParam?: string) => {
    setCurrentPage(page as Page);
    if (categoryIdParam) {
      setCategoryId(categoryIdParam);
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'products' && <ProductsPage onNavigate={handleNavigate} />}
        {currentPage === 'product-detail' && (
          <ProductDetailPage categoryId={categoryId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'process' && <ProcessPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
      <StickyContactButton />
    </div>
  );
}
