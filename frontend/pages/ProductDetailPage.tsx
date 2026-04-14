import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageLightbox } from '../components/ImageLightbox';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ProductDetailPageProps {
  categoryId: string;
  onNavigate: (page: string) => void;
}

const productData: Record<string, {
  title: string;
  description: string;
  features: string[];
  samples: string[];
}> = {
  boxes: {
    title: 'Hộp cứng cao cấp',
    description: 'Chuyên sản xuất các loại hộp cứng cao cấp cho mỹ phẩm, nước hoa, đồng hồ, trang sức và quà tặng doanh nghiệp. Sử dụng chất liệu giấy duplex, ivory cao cấp kết hợp với kỹ thuật ép kim, ép nhiệt, UV spot.',
    features: [
      'Chất liệu: Giấy duplex, ivory, kraft cao cấp',
      'Kỹ thuật: Ép kim, ép nhiệt, UV spot, silk',
      'Tùy chỉnh: Kích thước, màu sắc, kiểu dáng',
      'Ứng dụng: Mỹ phẩm, nước hoa, quà tặng cao cấp',
    ],
    samples: [
      'https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1585313736187-2d481f3c3969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBzYW1wbGVzfGVufDF8fHx8MTc2MjM1NDYwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  notebooks: {
    title: 'Sổ tay & Catalogue',
    description: 'In ấn sổ tay, catalogue, brochure chuyên nghiệp với chất lượng cao. Đa dạng về kiểu dáng, khổ giấy và hoàn thiện. Phù hợp cho sự kiện, quà tặng doanh nghiệp và marketing.',
    features: [
      'Chất liệu: Giấy couche, giấy mỹ thuật, giấy kraft',
      'Kỹ thuật: In offset 4 màu, ép kim, bồi format',
      'Tùy chỉnh: Khổ giấy, số trang, bìa cứng/mềm',
      'Ứng dụng: Catalogue sản phẩm, sổ tay doanh nghiệp',
    ],
    samples: [
      'https://images.unsplash.com/photo-1758608631036-7a2370684905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHByaW50aW5nfGVufDF8fHx8MTc2MjM1NDYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1670851050245-d861fd433d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjIyMzg5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758608631036-7a2370684905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHByaW50aW5nfGVufDF8fHx8MTc2MjM1NDYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  envelopes: {
    title: 'Phong bì cao cấp',
    description: 'Sản xuất phong bì cao cấp nhiều kích thước và màu sắc. Phù hợp cho thiệp mời, thư cảm ơn, thư doanh nghiệp và các dịp đặc biệt.',
    features: [
      'Chất liệu: Giấy couche, ivory, kraft, giấy mỹ thuật',
      'Kỹ thuật: In offset, silk, ép kim',
      'Tùy chỉnh: Kích thước, màu sắc, logo',
      'Ứng dụng: Thiệp mời, thư doanh nghiệp, sự kiện',
    ],
    samples: [
      'https://images.unsplash.com/photo-1627618998627-70a92a874cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGVudmVsb3BlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NjIzNTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1585313736187-2d481f3c3969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBzYW1wbGVzfGVufDF8fHx8MTc2MjM1NDYwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1627618998627-70a92a874cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGVudmVsb3BlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NjIzNTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  bags: {
    title: 'Túi giấy & Bao bì quà tặng',
    description: 'Túi giấy kraft cao cấp với nhiều kích thước và kiểu dáng. Thân thiện với môi trường, in ấn sắc nét, phù hợp cho shop thời trang, mỹ phẩm, F&B.',
    features: [
      'Chất liệu: Giấy kraft, couche, ivory',
      'Quai túi: Giấy xoắn, dây PP, dây cotton',
      'Tùy chỉnh: Kích thước, in ấn, gia công',
      'Ứng dụng: Shop, sự kiện, quà tặng doanh nghiệp',
    ],
    samples: [
      'https://images.unsplash.com/photo-1673257042269-439bef5e9002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYmFnJTIwcGFwZXJ8ZW58MXx8fHwxNzYyMzU0NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1673257042269-439bef5e9002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYmFnJTIwcGFwZXJ8ZW58MXx8fHwxNzYyMzU0NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  calendars: {
    title: 'Lịch để bàn & Lịch treo tường',
    description: 'In lịch để bàn, lịch treo tường với thiết kế đẹp mắt. Phù hợp làm quà tặng cuối năm cho khách hàng và đối tác.',
    features: [
      'Chất liệu: Giấy couche 250gsm, 300gsm',
      'Kỹ thuật: In offset 4 màu, phủ bóng',
      'Tùy chỉnh: Thiết kế, kích thước, số trang',
      'Ứng dụng: Quà tặng doanh nghiệp, marketing',
    ],
    samples: [
      'https://images.unsplash.com/photo-1719404364279-43785807f531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMGRlc2lnbnxlbnwxfHx8fDE3NjIyNzUxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1670851050245-d861fd433d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjIyMzg5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1719404364279-43785807f531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMGRlc2lnbnxlbnwxfHx8fDE3NjIyNzUxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  other: {
    title: 'Các sản phẩm khác',
    description: 'Chúng tôi cung cấp nhiều loại sản phẩm bao bì và in ấn khác như tem nhãn, decal, standee, backdrop và nhiều sản phẩm tùy chỉnh theo yêu cầu.',
    features: [
      'Chất liệu: Đa dạng theo yêu cầu',
      'Kỹ thuật: In offset, in kỹ thuật số, cắt laser',
      'Tùy chỉnh: Hoàn toàn theo thiết kế riêng',
      'Ứng dụng: Marketing, sự kiện, văn phòng phẩm',
    ],
    samples: [
      'https://images.unsplash.com/photo-1585313736187-2d481f3c3969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBzYW1wbGVzfGVufDF8fHx8MTc2MjM1NDYwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1585313736187-2d481f3c3969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBzYW1wbGVzfGVufDF8fHx8MTc2MjM1NDYwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
};

export function ProductDetailPage({ categoryId, onNavigate }: ProductDetailPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = productData[categoryId] || productData.boxes;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.samples.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === product.samples.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div>
      {/* Back Button */}
      <section className="py-6 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-2 text-[#374151] hover:text-[#E62026] transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </section>

      {/* Product Info */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-[#1F2937] mb-6">{product.title}</h1>
            <p className="text-[#374151] mb-8">{product.description}</p>
            
            <div className="bg-[#F9FAFB] rounded-lg p-6 md:p-8">
              <h3 className="text-[#1F2937] mb-4">Đặc điểm nổi bật</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E62026] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-[#374151]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Gallery */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Thư viện Mẫu</h2>
            <p className="text-[#374151]">
              Các mẫu sản phẩm chúng tôi đã thực hiện cho khách hàng
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {product.samples.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={image}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem chi tiết
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-[#1F2937] mb-4">Bạn có ý tưởng tương tự?</h2>
          <p className="text-[#374151] mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn chi tiết về chất liệu, 
            kỹ thuật in ấn và nhận báo giá chính xác nhất.
          </p>
          <Button
            onClick={() => onNavigate('contact')}
            className="bg-[#E62026] hover:bg-[#c71d23] text-white"
          >
            Liên hệ tư vấn
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={product.samples}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
