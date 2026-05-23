import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import {
  getAllCategories,
  getAllProducts,
  getPrimaryImage,
  searchProducts,
} from '../services/productData';

const FALLBACK_CATEGORY_IMAGE =
  'https://res.cloudinary.com/dt4zsrqho/image/upload/v1761494203/logo_u6rctw.jpg';

export function ProductsPage() {
  const navigate = useNavigate();
  const categories = useMemo(getAllCategories, []);
  const allProducts = useMemo(getAllProducts, []);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    const searched = query.trim() ? searchProducts(query) : allProducts;
    return activeCategory === 'all'
      ? searched
      : searched.filter((p) => p.metadata.category_slug === activeCategory);
  }, [query, activeCategory, allProducts]);

  // Pick a representative image per category from the products
  const categoryImage = useMemo(() => {
    const map: Record<string, string> = {};
    for (const product of allProducts) {
      const slug = product.metadata.category_slug;
      if (!map[slug]) {
        const img = getPrimaryImage(product);
        if (img) map[slug] = img;
      }
    }
    return map;
  }, [allProducts]);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F9FAFB] to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[#1F2937] mb-6">Danh mục Sản phẩm</h1>
            <p className="text-[#374151]">
              Khám phá các giải pháp in ấn đa dạng của Công ty In N&T.
              Mỗi sản phẩm đều có thể tùy chỉnh theo yêu cầu của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-[#1F2937] mb-8 text-center">Theo danh mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products/${category.slug}`}
                className="group block"
              >
                <ProductCard
                  title={`${category.name_vi} (${category.product_count})`}
                  image={categoryImage[category.slug] || FALLBACK_CATEGORY_IMAGE}
                  onClick={() => navigate(`/products/${category.slug}`)}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search + product grid */}
      <section className="py-12 md:py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-[#1F2937] mb-6 text-center">Tất cả sản phẩm</h2>

          {/* Search + filter controls */}
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-lg focus-within:border-[#E62026] focus-within:ring-2 focus-within:ring-[#E62026]/20">
              <Search size={20} className="ml-4 shrink-0 text-[#9CA3AF]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm sản phẩm theo tên, mô tả, công dụng…"
                className="flex-1 pl-4 pr-3 py-3 bg-transparent outline-none text-[#1F2937] placeholder:text-[#9CA3AF]"
                aria-label="Tìm kiếm sản phẩm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mr-3 p-1 text-[#9CA3AF] hover:text-[#374151]"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 pl-[10px]">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#E62026] text-white'
                    : 'bg-white text-[#374151] border border-[#D1D5DB] hover:border-[#E62026] hover:text-[#E62026]'
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActiveCategory(category.slug)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeCategory === category.slug
                      ? 'bg-[#E62026] text-white'
                      : 'bg-white text-[#374151] border border-[#D1D5DB] hover:border-[#E62026] hover:text-[#E62026]'
                  }`}
                >
                  {category.name_vi}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#374151] mb-4">
                Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('all');
                }}
                className="text-[#E62026] hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.embedding_data.product_name}
                  image={getPrimaryImage(product) || FALLBACK_CATEGORY_IMAGE}
                  onClick={() => navigate(`/products/${product.metadata.category_slug}#${product.id}`)}
                />
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <p className="text-center text-[#9CA3AF] mt-8">
              Hiển thị {filteredProducts.length} / {allProducts.length} sản phẩm
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[#1F2937] mb-4">Không tìm thấy sản phẩm phù hợp?</h2>
          <p className="text-[#374151] mb-8 max-w-2xl mx-auto">
            Chúng tôi có thể tùy chỉnh và sản xuất theo yêu cầu riêng của bạn.
            Hãy liên hệ để được tư vấn chi tiết.
          </p>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="bg-[#E62026] hover:bg-[#c71d23] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Liên hệ tư vấn
          </button>
        </div>
      </section>
    </div>
  );
}
