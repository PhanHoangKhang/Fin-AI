import { Check, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import background4Img from '../assets/background4.svg';

export const PricingSection = () => {
  return (
    <section 
      className="py-24 bg-cover bg-center bg-no-repeat relative font-sans overflow-hidden" 
      id="pricing"
      style={{ backgroundImage: `url(${background4Img})` }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div 
            className="text-white text-[34px] sm:text-[40px] font-bold tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Chọn gói phù hợp
          </div>
          <h2 className="text-3xl sm:text-4xl text-white font-serif leading-snug" style={{ fontFamily: 'Lora, serif' }}>
            Bảng giá Dịch vụ Minh bạch & Linh hoạt
          </h2>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto">
            Bắt đầu hoàn toàn miễn phí, nâng cấp khi cần tính năng cá nhân hóa danh mục chuyên sâu.
          </p>
        </div>

        {/* 2-Card Value Matrix */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-stretch mb-12">
          
          {/* FREE PLAN (STANDARD) */}
          <div className="bg-[#FAF7F0]/95 backdrop-blur-md rounded-[10px] p-8 border border-[#DDD5C7] shadow-[0_4px_24px_rgba(43,58,26,0.08)] flex flex-col justify-between group relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div>
              <div className="mb-6 pb-6 border-b border-[#E8EDE0]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-[#2B3A1A] font-serif">Gói Miễn phí</h3>
                  <span className="text-xs font-bold text-[#2B3A1A] bg-[#EFE8DA] px-2.5 py-1 rounded-[6px] uppercase tracking-wider border border-[#DDD3C0]">
                    Standard
                  </span>
                </div>
                <p className="text-[#5A5248] text-sm">Dành cho học sinh, sinh viên & nhà đầu tư F0 mới tìm hiểu.</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#2B3A1A] font-mono">0 VNĐ</span>
                  <span className="text-[#7A7060] text-sm"> / vĩnh viễn</span>
                </div>
              </div>
              
              <div className="text-xs font-bold text-[#2B3A1A] uppercase tracking-wider mb-4">
                Tính năng bao gồm:
              </div>

              <ul className="space-y-3.5 mb-8 text-sm">
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={18} />
                  <span>Tóm tắt tin tức tự động hàng ngày</span>
                </li>
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={18} />
                  <span>Tra cứu từ điển tài chính cơ bản</span>
                </li>
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={18} />
                  <span>Tra cứu thuật ngữ chuyên ngành <strong>5 lần / ngày</strong></span>
                </li>
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={18} />
                  <span>Theo dõi bảng giá thời gian thực</span>
                </li>
                <li className="flex items-start gap-3 text-[#7A7060]/50 line-through">
                  <Check className="text-[#7A7060]/30 mt-0.5 shrink-0" size={18} />
                  <span>Cảnh báo rủi ro danh mục cá nhân</span>
                </li>
              </ul>
            </div>

            <Link 
              to="/dashboard"
              className="w-full py-3.5 px-6 rounded-[10px] font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 bg-[#2B3A1A] hover:bg-[#1E2B12] text-white border border-[#4A6330] shadow-sm hover:shadow-md"
            >
              <span>Thử ngay miễn phí</span>
              <ArrowRight size={16} className="text-[#9CB953] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* PRO PLAN (AI PORTFOLIO) */}
          <div className="bg-[#1F2B13]/95 backdrop-blur-md rounded-[10px] p-8 border border-[#4A6330] shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between relative overflow-hidden group transition-all duration-200 hover:-translate-y-1">
            
            {/* Top Badge */}
            <div className="absolute top-0 right-0 bg-[#9CB953] text-[#1E2B12] text-xs font-bold px-4 py-1.5 rounded-bl-[10px] uppercase tracking-wider z-20 flex items-center gap-1 shadow-sm">
              <Sparkles size={12} />
              <span>Khuyên dùng cho F0</span>
            </div>
            
            <div>
              <div className="mb-6 pb-6 border-b border-[#3D5226]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white font-serif">Gói Pro AI</h3>
                  <span className="text-xs font-bold text-[#9CB953] bg-[#2B3A1A] px-2.5 py-1 rounded-[6px] uppercase tracking-wider border border-[#4A6330]">
                    AI Portfolio
                  </span>
                </div>
                <p className="text-white/75 text-sm">Cảnh báo rủi ro danh mục cá nhân hóa & AI trợ lý đầu tư.</p>
                
                <div className="mt-6 flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-lg text-white/40 line-through font-semibold font-mono">149,000 VNĐ</span>
                  <span className="text-4xl font-bold text-[#9CB953] font-mono">79,000 VNĐ</span>
                  <span className="text-white/70 text-sm"> / tháng</span>
                </div>
              </div>
              
              <div className="text-xs font-bold text-[#9CB953] uppercase tracking-wider mb-4">
                Toàn bộ quyền lợi Standard kèm nâng cấp:
              </div>

              <ul className="space-y-3.5 mb-8 text-sm">
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={18} />
                  <span>Tóm tắt tin tức <strong>không giới hạn</strong></span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={18} />
                  <span>Tra cứu từ điển tài chính nâng cao</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={18} />
                  <span>Tra cứu thuật ngữ chuyên ngành <strong>không giới hạn</strong></span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={18} />
                  <span>Theo dõi bảng giá thời gian thực</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={18} />
                  <span><strong>Cảnh báo rủi ro danh mục cá nhân hóa tức thời</strong></span>
                </li>
              </ul>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-3.5 px-6 rounded-[10px] font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 relative z-10 bg-[#9CB953] hover:bg-[#8AA842] text-[#1E2B12] shadow-[0_4px_18px_rgba(156,185,83,0.35)]"
            >
              <span>Nâng cấp ngay</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

        {/* Guarantee Banner */}
        <div className="max-w-2xl mx-auto text-center text-xs text-white/75 flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-[#9CB953]" />
          <span>Cam kết không tự động gia hạn khi chưa có sự đồng ý. Hỗ trợ huỷ gói bất kỳ lúc nào.</span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;