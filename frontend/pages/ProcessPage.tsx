import { FileText, MessageSquare, Palette, Factory, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ProcessPageProps {
  onNavigate: (page: string) => void;
}

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Tiếp nhận Yêu cầu',
    description: 'Khách hàng gửi yêu cầu, brief, ý tưởng về sản phẩm cần sản xuất. Chúng tôi tiếp nhận và phân tích kỹ lưỡng các thông tin.',
    details: [
      'Tiếp nhận thông tin qua email, điện thoại hoặc trực tiếp',
      'Phân tích yêu cầu về chất liệu, kích thước, số lượng',
      'Thời gian xử lý: 1-2 giờ làm việc',
    ],
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Tư vấn & Báo giá',
    description: 'Đội ngũ chuyên gia tư vấn về giải pháp tối ưu nhất, lựa chọn vật liệu phù hợp và gửi báo giá chi tiết cho khách hàng.',
    details: [
      'Tư vấn chất liệu, kỹ thuật in ấn phù hợp',
      'Đề xuất giải pháp tối ưu chi phí',
      'Gửi báo giá chi tiết và timeline dự kiến',
    ],
  },
  {
    number: '03',
    icon: Palette,
    title: 'Thiết kế & Duyệt mẫu',
    description: 'Thiết kế artwork theo yêu cầu, sản xuất mẫu thử (sample) để khách hàng kiểm tra chất lượng trước khi sản xuất hàng loạt.',
    details: [
      'Thiết kế artwork chuyên nghiệp',
      'Làm mẫu thử để khách hàng đánh giá',
      'Điều chỉnh theo phản hồi của khách hàng',
    ],
  },
  {
    number: '04',
    icon: Factory,
    title: 'Sản xuất Hàng loạt',
    description: 'Sau khi duyệt mẫu, chúng tôi tiến hành sản xuất hàng loạt với quy trình chặt chẽ, đảm bảo chất lượng đồng nhất.',
    details: [
      'Sản xuất theo đúng mẫu đã duyệt',
      'Giám sát chất lượng trong từng công đoạn',
      'Cập nhật tiến độ cho khách hàng',
    ],
  },
  {
    number: '05',
    icon: CheckCircle,
    title: 'Kiểm tra & Giao hàng',
    description: 'Kiểm tra chất lượng cuối cùng (QC), đóng gói cẩn thận và giao hàng đúng hẹn đến địa điểm khách hàng yêu cầu.',
    details: [
      'Kiểm tra chất lượng 100% sản phẩm',
      'Đóng gói chuyên nghiệp, an toàn',
      'Giao hàng toàn quốc, đúng deadline',
    ],
  },
];

export function ProcessPage({ onNavigate }: ProcessPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F9FAFB] to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[#1F2937] mb-6">Quy trình Đặt hàng</h1>
            <p className="text-[#374151]">
              Quy trình làm việc chuyên nghiệp, minh bạch từ A đến Z. 
              Chúng tôi đồng hành cùng bạn trong mỗi bước để đảm bảo sản phẩm hoàn hảo nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12 md:space-y-16">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-[60px] top-[120px] w-0.5 h-full bg-[#E5E7EB] -z-10" />
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Icon & Number */}
                    <div className="flex-shrink-0 flex items-center gap-4 md:flex-col md:items-center md:w-[120px]">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E62026] rounded-full flex items-center justify-center shadow-lg">
                        <step.icon className="text-white" size={32} />
                      </div>
                      <div className="text-[#E62026] md:mt-2">{step.number}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-[#F9FAFB] rounded-lg p-6 md:p-8">
                      <h3 className="text-[#1F2937] mb-3">{step.title}</h3>
                      <p className="text-[#374151] mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-[#E62026] rounded-full mt-2 flex-shrink-0" />
                            <span className="text-[#374151]">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Summary */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Thời gian Ước tính</h2>
            <p className="text-[#374151]">
              Thời gian sản xuất có thể thay đổi tùy thuộc vào độ phức tạp và số lượng đơn hàng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-[#E62026] mb-2">1-2 ngày</div>
              <h4 className="text-[#1F2937] mb-2">Tư vấn & Báo giá</h4>
              <p className="text-[#374151]">Phản hồi nhanh chóng</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-[#E62026] mb-2">3-5 ngày</div>
              <h4 className="text-[#1F2937] mb-2">Thiết kế & Mẫu thử</h4>
              <p className="text-[#374151]">Sample chất lượng</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-[#E62026] mb-2">7-15 ngày</div>
              <h4 className="text-[#1F2937] mb-2">Sản xuất & Giao hàng</h4>
              <p className="text-[#374151]">Tùy số lượng đơn hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#E62026] to-[#c71d23] text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Bắt đầu dự án của bạn ngay hôm nay</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn chi tiết và nhận báo giá chính xác nhất.
          </p>
          <Button
            onClick={() => onNavigate('contact')}
            variant="outline"
            className="bg-white text-[#E62026] border-white hover:bg-gray-100"
          >
            Gửi yêu cầu ngay
          </Button>
        </div>
      </section>
    </div>
  );
}
