import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F9FAFB] to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[#1F2937] mb-6">Liên hệ với chúng tôi</h1>
            <p className="text-[#374151]">
              Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn chi tiết và gửi báo giá cho bạn trong thời gian sớm nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[#1F2937] mb-12 text-center">Thông tin liên hệ</h2>
            
            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E62026]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#E62026]" size={24} />
                </div>
                <div>
                  <h4 className="text-[#1F2937] mb-1">Địa chỉ</h4>
                  <p className="text-[#374151]">
                    Số 6, Ngách 180/79 Nam Dư<br />
                    Phường Lĩnh Nam, Hà Nội, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E62026]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[#E62026]" size={24} />
                </div>
                <div>
                  <h4 className="text-[#1F2937] mb-1">Số điện thoại</h4>
                  <p className="text-[#374151]">
                    Hotline: <a href="tel:+84867081781" className="text-[#E62026] hover:underline">+84 867081781</a><br />
                    Kinh doanh: <a href="tel:+84867081781" className="text-[#E62026] hover:underline">+84 867081781</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E62026]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[#E62026]" size={24} />
                </div>
                <div>
                  <h4 className="text-[#1F2937] mb-1">Email</h4>
                  <p className="text-[#374151]">
                    <a href="mailto:innt1995@gmail.com" className="text-[#E62026] hover:underline">
                      innt1995@gmail.com
                    </a><br />
                    <a href="mailto:innt1995@gmail.com" className="text-[#E62026] hover:underline">
                      innt1995@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E62026]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-[#E62026]" size={24} />
                </div>
                <div>
                  <h4 className="text-[#1F2937] mb-1">Giờ làm việc</h4>
                  <p className="text-[#374151]">
                    Thứ 2 - Thứ 6: 8:00 - 17:30<br />
                    Thứ 7 - Chủ Nhật: Nghỉ
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#F9FAFB] rounded-lg p-12 text-center border-2 border-dashed border-[#E5E7EB]">
              <MapPin className="mx-auto text-[#E62026] mb-4" size={48} />
              <p className="text-[#374151]">
                Google Maps Integration<br />
                <span className="text-[#9CA3AF]">[Embed your Google Maps here]</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional CTA */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-[#1F2937] mb-4">Cần tư vấn ngay?</h3>
            <p className="text-[#374151] mb-6">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7 qua điện thoại hoặc tin nhắn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('tel:+84123456789')}
                className="bg-[#E62026] hover:bg-[#c71d23] text-white"
              >
                <Phone className="mr-2" size={20} />
                Gọi ngay
              </Button>
              <Button
                onClick={() => window.open('[YOUR_ZALO_OR_MESSENGER_LINK_HERE]', '_blank')}
                variant="outline"
                className="border-[#E62026] text-[#E62026] hover:bg-[#E62026] hover:text-white"
              >
                Chat với chúng tôi
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
