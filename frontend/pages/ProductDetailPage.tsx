import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageLightbox } from '../components/ImageLightbox';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  getCategoryBySlug,
  getProductsByCategory,
} from '../services/productData';
import type { Product } from '../types/product';

interface LightboxState {
  images: string[];
  index: number;
}

function formatSpecLabel(key: string): string {
  const labels: Record<string, string> = {
    dimensions: 'Kích thước',
    dimensions_unfolded: 'Kích thước khi trải',
    dimensions_finished: 'Kích thước thành phẩm',
    dimensions_3d: 'Kích thước 3D',
    thickness_gsm: 'Định lượng giấy',
    quantity: 'Số lượng',
    material: 'Chất liệu',
    colors: 'Màu in',
    load_capacity: 'Khả năng chịu tải',
  };
  return labels[key] || key;
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const category = useMemo(() => (slug ? getCategoryBySlug(slug) : undefined), [slug]);
  const products = useMemo(() => (slug ? getProductsByCategory(slug) : []), [slug]);

  // Scroll to product anchor (#product-id) when arriving from ProductsPage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    // Wait a tick so the DOM has rendered the products
    const id = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => window.clearTimeout(id);
  }, [products]);

  if (!category) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-[#1F2937] mb-4">Không tìm thấy danh mục</h1>
          <p className="text-[#374151] mb-8">
            Danh mục bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-[#E62026] hover:bg-[#c71d23] text-white"
          >
            <ArrowLeft className="mr-2" size={20} />
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </section>
    );
  }

  const openLightbox = (images: string[], index: number) => {
    if (images.length === 0) return;
    setLightbox({ images, index });
  };

  const closeLightbox = () => setLightbox(null);
  const previousImage = () =>
    setLightbox((s) => (s ? { ...s, index: s.index === 0 ? s.images.length - 1 : s.index - 1 } : null));
  const nextImage = () =>
    setLightbox((s) => (s ? { ...s, index: s.index === s.images.length - 1 ? 0 : s.index + 1 } : null));

  return (
    <div>
      {/* Back Button */}
      <section className="py-6 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-[#374151] hover:text-[#E62026] transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </section>

      {/* Category Header */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-[#1F2937] mb-4">{category.name_vi}</h1>
            <p className="text-[#374151]">
              {category.description ||
                `Khám phá ${products.length} sản phẩm trong danh mục ${category.name_vi}.`}
            </p>
          </div>
        </div>
      </section>

      {/* Product list */}
      <section className="pb-12 md:pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
            {products.map((product, index) => (
              <ProductDetailCard
                key={product.id}
                product={product}
                onOpenImage={openLightbox}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[#1F2937] mb-4">Bạn có ý tưởng tương tự?</h2>
          <p className="text-[#374151] mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn chi tiết về chất liệu,
            kỹ thuật in ấn và nhận báo giá chính xác nhất.
          </p>
          <Button
            onClick={() => navigate('/contact')}
            className="bg-[#E62026] hover:bg-[#c71d23] text-white"
          >
            Liên hệ tư vấn
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onPrevious={previousImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}

interface ProductDetailCardProps {
  product: Product;
  onOpenImage: (images: string[], index: number) => void;
  reverse: boolean;
}

function ProductDetailCard({ product, onOpenImage, reverse }: ProductDetailCardProps) {
  const images = product.generation_enhancers.image_url;
  const specs = product.metadata.technical_specs || {};

  return (
    <article
      id={product.id}
      className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm scroll-mt-24"
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        {/* Gallery */}
        <div className={`bg-[#F9FAFB] p-4 md:p-6 ${reverse ? 'md:order-2' : ''}`}>
          {images.length > 0 ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onOpenImage(images, 0)}
                className="block w-full aspect-[4/3] overflow-hidden rounded-lg bg-white group"
              >
                <ImageWithFallback
                  src={images[0]}
                  alt={product.embedding_data.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(1, 4).map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => onOpenImage(images, i + 1)}
                      className="aspect-square overflow-hidden rounded-md bg-white group"
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${product.embedding_data.product_name} - ${i + 2}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[4/3] flex items-center justify-center text-[#9CA3AF] bg-white rounded-lg">
              Chưa có hình ảnh
            </div>
          )}
        </div>

        {/* Info */}
        <div className={`p-6 md:p-8 ${reverse ? 'md:order-1' : ''}`}>
          <h2 className="text-[#1F2937] mb-3">{product.embedding_data.product_name}</h2>
          <p className="text-[#374151] mb-6">{product.embedding_data.detailed_description}</p>

          {product.embedding_data.use_cases?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[#1F2937] mb-3">Công dụng</h3>
              <ul className="space-y-2">
                {product.embedding_data.use_cases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#E62026] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-[#374151]">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Object.keys(specs).length > 0 && (
            <div className="mb-6">
              <h3 className="text-[#1F2937] mb-3">Thông số kỹ thuật</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(specs).map(([key, value]) =>
                  value ? (
                    <div key={key} className="flex flex-col">
                      <dt className="text-sm text-[#9CA3AF]">{formatSpecLabel(key)}</dt>
                      <dd className="text-[#374151]">{value}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </div>
          )}

          {product.embedding_data.finishing_options &&
            product.embedding_data.finishing_options.length > 0 && (
              <div>
                <h3 className="text-[#1F2937] mb-3">Gia công hoàn thiện</h3>
                <ul className="flex flex-wrap gap-2">
                  {product.embedding_data.finishing_options.map((opt) => (
                    <li
                      key={opt}
                      className="px-3 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm text-[#374151]"
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </article>
  );
}
