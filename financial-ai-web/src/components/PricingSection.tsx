import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  return (
    <section className="py-24 bg-[#F5F0E8] font-sans" id="pricing">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <div 
            className="text-[#7A9B58] text-[34px] sm:text-[40px] font-bold mb-2 tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Chọn gói phù hợp
          </div>
          <h2 className="text-4xl text-[#2B3A1A] font-serif mb-6" style={{ fontFamily: 'Lora, serif' }}>Bảng giá Dịch vụ</h2>
          <p className="text-[#7A7060] text-lg max-w-2xl mx-auto">Bắt đầu miễn phí, nâng cấp khi cần. Chọn gói phù hợp với nhu cầu đầu tư của bạn.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8EDE0] shadow-sm flex flex-col justify-between transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-2xl hover:border-[#9CB953]/60 group relative overflow-hidden cursor-pointer">
            {/* Ambient glow on hover */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#9CB953]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
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
              </ul>
            </div>

            <Link 
              to="/dashboard"
              className="w-full py-3.5 px-6 rounded-full font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 bg-[#E8EDE0] text-[#2B3A1A] group-hover:bg-white/85 group-hover:backdrop-blur-md group-hover:border group-hover:border-white group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:scale-[1.02]"
            >
              <span>Thử ngay</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#2B3A1A] rounded-3xl p-8 border border-[#3D5226] shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-2xl hover:border-[#9CB953] group cursor-pointer">
            {/* Ambient glow on hover */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#9CB953]/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="absolute top-0 right-0 bg-[#9CB953] text-[#2B3A1A] text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider z-20">
              Gói Pro
            </div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Gói Pro (AI Portfolio)</h3>
                <p className="text-white/70">Cảnh báo rủi ro danh mục cá nhân hóa & AI Tutor.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">49,000 VNĐ</span>
                <span className="text-white/70"> / tháng</span>
              </div>
              
              <ul className="space-y-4 mb-8">
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
              </ul>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-3.5 px-6 rounded-full font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 relative z-10 bg-white/20 text-white backdrop-blur-sm border border-white/20 group-hover:bg-white/90 group-hover:text-[#2B3A1A] group-hover:backdrop-blur-md group-hover:border-white group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] group-hover:scale-[1.02]"
            >
              <span>Thử ngay</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;