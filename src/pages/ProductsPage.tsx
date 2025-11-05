import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  onNavigate: (page: string, categoryId?: string) => void;
}

const allProducts = [
  {
    id: 'boxes',
    title: 'Hộp cứng cao cấp',
    image: 'https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'notebooks',
    title: 'Sổ tay & Catalogue',
    image: 'https://images.unsplash.com/photo-1758608631036-7a2370684905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHByaW50aW5nfGVufDF8fHx8MTc2MjM1NDYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'envelopes',
    title: 'Phong bì cao cấp',
    image: 'https://images.unsplash.com/photo-1627618998627-70a92a874cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGVudmVsb3BlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NjIzNTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'bags',
    title: 'Túi giấy & Bao bì quà tặng',
    image: 'https://images.unsplash.com/photo-1673257042269-439bef5e9002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYmFnJTIwcGFwZXJ8ZW58MXx8fHwxNzYyMzU0NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'calendars',
    title: 'Lịch để bàn & Lịch treo tường',
    image: 'https://images.unsplash.com/photo-1719404364279-43785807f531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMGRlc2lnbnxlbnwxfHx8fDE3NjIyNzUxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'other',
    title: 'Các sản phẩm khác',
    image: 'https://images.unsplash.com/photo-1585313736187-2d481f3c3969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBzYW1wbGVzfGVufDF8fHx8MTc2MjM1NDYwNnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function ProductsPage({ onNavigate }: ProductsPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F9FAFB] to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[#1F2937] mb-6">Danh mục Sản phẩm</h1>
            <p className="text-[#374151]">
              Khám phá các giải pháp bao bì đa dạng của Công ty In N&T. 
              Mỗi sản phẩm đều có thể tùy chỉnh theo yêu cầu của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                image={product.image}
                onClick={() => onNavigate('product-detail', product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[#1F2937] mb-4">Không tìm thấy sản phẩm phù hợp?</h2>
          <p className="text-[#374151] mb-8 max-w-2xl mx-auto">
            Chúng tôi có thể tùy chỉnh và sản xuất theo yêu cầu riêng của bạn. 
            Hãy liên hệ để được tư vấn chi tiết.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-[#E62026] hover:bg-[#c71d23] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Liên hệ tư vấn
          </button>
        </div>
      </section>
    </div>
  );
}
