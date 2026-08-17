import { Check } from 'lucide-react';

export const PricingSection = () => {
  return (
    <section className="py-24 bg-[#F5F0E8] font-sans" id="pricing">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-[#E8F5E0] text-[#3D5226] px-4 py-1.5 rounded-full text-sm font-bold tracking-wider font-sans mb-4 uppercase border border-[#3D5226]/10">
            CHỌN GÓI PHÙ HỢP
          </div>
          <h2 className="text-4xl text-[#2B3A1A] font-serif mb-6" style={{ fontFamily: 'Lora, serif' }}>Bảng giá Dịch vụ</h2>
          <p className="text-[#7A7060] text-lg max-w-2xl mx-auto">Bắt đầu miễn phí, nâng cấp khi cần. Chọn gói phù hợp với nhu cầu đầu tư của bạn.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8EDE0] shadow-sm">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#2B3A1A] mb-2">Miễn phí (Standard)</h3>
              <p className="text-[#7A7060]">Dành cho học sinh, sinh viên & F0 mới tìm hiểu.</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-[#2B3A1A]">0 VNĐ</span>
              <span className="text-[#7A7060]"> / tháng</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-[#2B3A1A]">
                <Check className="text-[#7A9B58] mt-0.5" size={20} />
                <span>Tóm tắt tin tức tự động hàng ngày</span>
              </li>
              <li className="flex items-start gap-3 text-[#2B3A1A]">
                <Check className="text-[#7A9B58] mt-0.5" size={20} />
                <span>Tra cứu từ điển tài chính cơ bản</span>
              </li>
              <li className="flex items-start gap-3 text-[#2B3A1A]">
                <Check className="text-[#7A9B58] mt-0.5" size={20} />
                <span>Theo dõi bảng giá thời gian thực</span>
              </li>
              <li className="flex items-start gap-3 text-[#7A7060]/50 line-through">
                <Check className="text-[#7A7060]/30 mt-0.5" size={20} />
                <span>Cảnh báo rủi ro danh mục cá nhân</span>
              </li>
              <li className="flex items-start gap-3 text-[#7A7060]/50 line-through">
                <Check className="text-[#7A7060]/30 mt-0.5" size={20} />
                <span>AI Tutor & Phân tích 4 biểu đồ chuyên sâu</span>
              </li>
            </ul>

            <button className="w-full py-3.5 rounded-full font-bold bg-[#E8EDE0] text-[#2B3A1A] hover:bg-[#E0DDD6] transition-colors">
              Dùng ngay
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#2B3A1A] rounded-3xl p-8 border border-[#3D5226] shadow-xl relative overflow-hidden md:scale-105 z-10">
            <div className="absolute top-0 right-0 bg-[#9CB953] text-[#2B3A1A] text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Gói Pro
            </div>
            
            <div className="mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Gói Pro (AI Portfolio)</h3>
              <p className="text-white/70">Cảnh báo rủi ro danh mục cá nhân hóa & AI Tutor.</p>
            </div>
            <div className="mb-8 relative z-10">
              <span className="text-4xl font-bold text-white">49,000 VNĐ</span>
              <span className="text-white/70"> / tháng</span>
            </div>
            
            <ul className="space-y-4 mb-8 relative z-10">
              <li className="flex items-start gap-3 text-white">
                <Check className="text-[#9CB953] mt-0.5" size={20} />
                <span>Tóm tắt tin tức <strong>không giới hạn</strong></span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="text-[#9CB953] mt-0.5" size={20} />
                <span>Giải thích thuật ngữ chuyên sâu tức thì</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="text-[#9CB953] mt-0.5" size={20} />
                <span>Cảnh báo rủi ro danh mục cá nhân hóa</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="text-[#9CB953] mt-0.5" size={20} />
                <span>Đánh giá Sentiment chuyên sâu (MultiInsight)</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="text-[#9CB953] mt-0.5" size={20} />
                <span>Kế hoạch giao dịch 3 tầng (T+, Trung hạn, Dài hạn)</span>
              </li>
            </ul>

            <button className="w-full py-3.5 rounded-full font-bold bg-white text-[#2B3A1A] hover:bg-[#F5F0E8] transition-colors relative z-10">
              Nâng cấp Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;