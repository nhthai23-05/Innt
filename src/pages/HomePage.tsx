import { ArrowRight, CheckCircle, Sparkles, Award, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, categoryId?: string) => void;
}

const featuredProducts = [
  {
    id: 'boxes',
    title: 'Sản xuất Hộp cứng cao cấp',
    image: 'https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'notebooks',
    title: 'In ấn Sổ tay & Catalogue',
    image: 'https://images.unsplash.com/photo-1758608631036-7a2370684905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHByaW50aW5nfGVufDF8fHx8MTc2MjM1NDYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'envelopes',
    title: 'Phong bì & Túi giấy cao cấp',
    image: 'https://images.unsplash.com/photo-1627618998627-70a92a874cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGVudmVsb3BlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NjIzNTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'bags',
    title: 'Túi giấy & Bao bì quà tặng',
    image: 'https://images.unsplash.com/photo-1673257042269-439bef5e9002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYmFnJTIwcGFwZXJ8ZW58MXx8fHwxNzYyMzU0NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const whyChooseUs = [
  {
    icon: Sparkles,
    title: 'Thiết kế Tùy chỉnh',
    description: 'Đội ngũ thiết kế chuyên nghiệp sẵn sàng biến ý tưởng của bạn thành hiện thực.',
  },
  {
    icon: Award,
    title: 'Chất lượng Vật liệu Cao cấp',
    description: 'Sử dụng nguyên liệu nhập khẩu và công nghệ in ấn hiện đại nhất.',
  },
  {
    icon: Clock,
    title: 'Giao hàng Đúng hẹn',
    description: 'Cam kết thời gian sản xuất rõ ràng và giao hàng đúng deadline.',
  },
  {
    icon: CheckCircle,
    title: 'Dịch vụ Chuyên nghiệp',
    description: 'Tư vấn tận tâm, hỗ trợ 24/7, luôn đặt sự hài lòng của khách hàng lên hàng đầu.',
  },
];

const testimonials = [
  {
    name: 'Nguyễn Văn A',
    company: 'Công ty TNHH ABC',
    content: 'Chất lượng sản phẩm vượt mong đợi. Đội ngũ N&T rất chuyên nghiệp và tận tâm trong từng chi tiết.',
  },
  {
    name: 'Trần Thị B',
    company: 'XYZ Corporation',
    content: 'Đã hợp tác với N&T được 3 năm. Luôn giao hàng đúng hẹn và chất lượng ổn định.',
  },
  {
    name: 'Lê Minh C',
    company: 'DEF Group',
    content: 'Giá cả hợp lý, chất lượng tốt. Đặc biệt là dịch vụ tư vấn rất tốt, giúp chúng tôi tiết kiệm chi phí.',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#F9FAFB] to-white py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-[#1F2937] mb-6">
                Giải pháp Sản xuất & In ấn Bao bì Hàng đầu
              </h1>
              <p className="text-[#374151] mb-8">
                Công ty In N&T - Đối tác tin cậy của hơn 500 doanh nghiệp trên toàn quốc. 
                Chuyên cung cấp giải pháp bao bì cao cấp với chất lượng quốc tế, 
                giá thành cạnh tranh và dịch vụ chuyên nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate('contact')}
                  className="bg-[#E62026] hover:bg-[#c71d23] text-white"
                >
                  Yêu cầu Báo giá
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button
                  onClick={() => onNavigate('products')}
                  variant="outline"
                  className="border-[#E62026] text-[#E62026] hover:bg-[#E62026] hover:text-white"
                >
                  Xem Sản phẩm
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1582190506824-ef3bd95a956e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwbWFudWZhY3R1cmluZ3xlbnwxfHx8fDE3NjIzMzE2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="N&T Factory"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 md:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1670851050245-d861fd433d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjIyMzg5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="N&T Team"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-[#1F2937] mb-4">Về Công ty In N&T</h2>
              <p className="text-[#374151] mb-4">
                Với gần 30 năm kinh nghiệm trong ngành sản xuất và in ấn bao bì, 
                Công ty In N&T tự hào là đối tác tin cậy của nhiều thương hiệu tại Việt Nam.
              </p>
              <p className="text-[#374151] mb-6">
                Chúng tôi không chỉ sản xuất bao bì, mà còn tạo ra những giải pháp đóng gói 
                giúp nâng tầm thương hiệu và tạo ấn tượng tốt với khách hàng của bạn.
              </p>
              <Button
                onClick={() => onNavigate('about')}
                variant="outline"
                className="border-[#E62026] text-[#E62026] hover:bg-[#E62026] hover:text-white"
              >
                Tìm hiểu thêm về chúng tôi
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Sản phẩm Nổi bật</h2>
            <p className="text-[#374151] max-w-2xl mx-auto">
              Khám phá các dòng sản phẩm chính của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                image={product.image}
                onClick={() => onNavigate('product-detail', product.id)}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              onClick={() => onNavigate('products')}
              className="bg-[#E62026] hover:bg-[#c71d23] text-white"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-[#374151] max-w-2xl mx-auto">
              Công ty In N&T cam kết mang đến giá trị tốt nhất cho khách hàng
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E62026]/10 rounded-full mb-4">
                  <item.icon className="text-[#E62026]" size={32} />
                </div>
                <h3 className="text-[#1F2937] mb-2">{item.title}</h3>
                <p className="text-[#374151]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Khách hàng nói gì về chúng tôi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                <p className="text-[#374151] mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-[#1F2937]">{testimonial.name}</p>
                  <p className="text-[#374151]">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
