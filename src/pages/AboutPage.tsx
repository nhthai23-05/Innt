import { Target, Users, Trophy, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const values = [
  {
    icon: Target,
    title: 'Sứ mệnh',
    description: 'Cung cấp giải pháp bao bì tùy chỉnh chất lượng cao, giúp doanh nghiệp nâng tầm thương hiệu và tạo ấn tượng với khách hàng.',
  },
  {
    icon: Users,
    title: 'Tầm nhìn',
    description: 'Trở thành nhà sản xuất bao bì hàng đầu Việt Nam, được khách hàng tin tựng và đối tác quốc tế công nhận.',
  },
  {
    icon: Trophy,
    title: 'Giá trị cốt lõi',
    description: 'Chất lượng - Uy tín - Sáng tạo - Khách hàng là trung tâm.',
  },
  {
    icon: Heart,
    title: 'Cam kết',
    description: 'Luôn đặt lợi ích khách hàng lên hàng đầu, không ngừng cải tiến và đổi mới để mang đến sản phẩm tốt nhất.',
  },
];

const milestones = [
  { year: '2015', title: 'Thành lập công ty', description: 'Khởi đầu với 10 nhân viên và một xưởng nhỏ' },
  { year: '2017', title: 'Mở rộng quy mô', description: 'Đầu tư máy móc hiện đại, tăng công suất gấp 5 lần' },
  { year: '2020', title: 'Đạt chứng nhận ISO', description: 'Đạt chứng nhận ISO 9001:2015 về hệ thống quản lý chất lượng' },
  { year: '2025', title: 'Hơn 500 khách hàng', description: 'Phục vụ hơn 500 doanh nghiệp trên toàn quốc' },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-[#F9FAFB] to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[#1F2937] mb-6">Về Công ty In N&T</h1>
            <p className="text-[#374151]">
              Đối tác tin cậy của hơn 500 doanh nghiệp trên toàn quốc, 
              chuyên cung cấp giải pháp bao bì cao cấp với chất lượng quốc tế.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-[#1F2937] mb-6">Câu chuyện của chúng tôi</h2>
              <p className="text-[#374151] mb-4">
                Công ty In N&T được thành lập vào năm 2015 với mục tiêu cung cấp giải pháp bao bì 
                chất lượng cao cho các doanh nghiệp Việt Nam. Bắt đầu từ một xưởng nhỏ với 10 nhân viên, 
                chúng tôi đã không ngừng nỗ lực và phát triển.
              </p>
              <p className="text-[#374151] mb-4">
                Qua hơn 10 năm hoạt động, N&T đã trở thành một trong những nhà sản xuất bao bì 
                uy tín hàng đầu tại Việt Nam. Chúng tôi tự hào đã phục vụ hơn 500 khách hàng 
                từ nhiều lĩnh vực khác nhau: mỹ phẩm, thực phẩm, điện tử, thời trang...
              </p>
              <p className="text-[#374151] mb-6">
                Với đội ngũ hơn 100 nhân viên có tay nghề cao, máy móc thiết bị hiện đại 
                và quy trình sản xuất được kiểm soát chặt chẽ, chúng tôi cam kết mang đến 
                những sản phẩm bao bì tốt nhất cho khách hàng.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1582190506824-ef3bd95a956e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwbWFudWZhY3R1cmluZ3xlbnwxfHx8fDE3NjIzMzE2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Factory"
                className="rounded-lg shadow-lg"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1670851050245-d861fd433d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjIyMzg5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team"
                className="rounded-lg shadow-lg mt-8"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1585313736187-2d481f3c3969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBzYW1wbGVzfGVufDF8fHx8MTc2MjM1NDYwNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Products"
                className="rounded-lg shadow-lg"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBib3hlc3xlbnwxfHx8fDE3NjIzNTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Packaging"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Giá trị cốt lõi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E62026]/10 rounded-full mb-4">
                  <value.icon className="text-[#E62026]" size={32} />
                </div>
                <h3 className="text-[#1F2937] mb-3">{value.title}</h3>
                <p className="text-[#374151]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2937] mb-4">Hành trình phát triển</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-24 pt-1">
                    <div className="inline-block bg-[#E62026] text-white px-4 py-2 rounded-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 border-l-4 border-[#E5E7EB] pl-6 pb-8">
                    <h3 className="text-[#1F2937] mb-2">{milestone.title}</h3>
                    <p className="text-[#374151]">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#E62026] to-[#c71d23] text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Sẵn sàng hợp tác với chúng tôi?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Hãy để Công ty In N&T đồng hành cùng bạn tạo nên những sản phẩm bao bì độc đáo và chất lượng.
          </p>
          <Button
            onClick={() => onNavigate('contact')}
            variant="outline"
            className="bg-white text-[#E62026] border-white hover:bg-gray-100"
          >
            Liên hệ ngay
          </Button>
        </div>
      </section>
    </div>
  );
}
