import {
  Globe,
  Sparkles,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import background3Img from '../assets/background3.svg';

const PIPELINE_STEPS = [
  {
    num: "01",
    stepBadge: "Bước 1 · Thu thập & Lọc nhiễu",
    icon: <Globe size={22} className="text-[#9CB953] group-hover:text-white transition-colors duration-200" />,
    title: "Tổng hợp Đa nguồn Realtime",
    desc: "Hệ thống liên tục thu thập hàng trăm bài báo và công bố thông tin từ VnExpress, CafeF, Vietstock và VnEconomy, tự động loại bỏ tin đồn và các bài viết trùng lặp.",
    highlightTag: "Lọc nhiễu thông tin",
  },
  {
    num: "02",
    stepBadge: "Bước 2 · AI Bóc tách & Phiên dịch",
    icon: <Sparkles size={22} className="text-[#9CB953] group-hover:text-white transition-colors duration-200" />,
    title: "Tóm lược 30s & Dịch Thuật ngữ",
    desc: "Mô hình ngôn ngữ tự nhiên rút gọn nội dung thành 3 trọng tâm chính, đồng thời dịch tức thời các chỉ số kỹ thuật phức tạp (P/E, ROE, NIM...) sang ngôn ngữ bình dân.",
    highlightTag: "Ngôn ngữ đời thường",
  },
  {
    num: "03",
    stepBadge: "Bước 3 · Đánh giá & Ra quyết định",
    icon: <Target size={22} className="text-[#9CB953] group-hover:text-white transition-colors duration-200" />,
    title: "Chấm điểm Sắc thái & Cảnh báo",
    desc: "Đưa ra thang điểm Sentiment từ 0-100% và liên kết trực tiếp tới mã cổ phiếu trong danh mục của bạn để bạn nắm bắt rủi ro và cơ hội ngay lập tức.",
    highlightTag: "Tác động danh mục",
  },
];

export const HowItWorks = () => {
  return (
    <section 
      id="how-it-works" 
      className="py-24 bg-cover bg-bottom bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${background3Img})`, backgroundPosition: 'center bottom' }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div 
            className="text-[#7A9B58] text-[34px] sm:text-[40px] font-bold tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Cách thức hoạt động
          </div>
          <h2 className="text-3xl sm:text-4xl text-[#3D5226] font-serif leading-snug" style={{ fontFamily: 'Lora, serif' }}>
            Quy trình 3 bước biến tin tức phức tạp thành hành động rõ ràng.
          </h2>
          <p className="text-[#3D5226] text-base sm:text-lg max-w-2xl mx-auto font-sans font-medium">
            Được thiết kế tối giản để nhà đầu tư mới có thể tự tin đọc hiểu mọi diễn biến thị trường mỗi ngày.
          </p>
        </div>

        {/* Connected 3-Step Financial Pipeline Timeline */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 font-sans items-stretch">
          {PIPELINE_STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-[#233015]/95 backdrop-blur-md border border-[#3E5325] rounded-[10px] p-7 sm:p-8 relative overflow-hidden group hover:border-[#9CB953] transition-all duration-200 shadow-xl flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              {/* Watermark Step Number */}
              <div className="absolute -right-3 -top-3 text-7xl font-bold text-[#3D5226]/40 group-hover:text-[#9CB953]/25 transition-colors pointer-events-none select-none font-mono">
                {step.num}
              </div>

              <div className="relative z-10 space-y-4">
                {/* Header icon & badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[10px] bg-[#2B3A1A] border border-[#4A6330] flex items-center justify-center shadow-2xs group-hover:bg-[#9CB953] group-hover:border-[#9CB953] transition-colors duration-200">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#9CB953] bg-[#2B3A1A]/80 px-2.5 py-1 rounded-[6px] border border-[#9CB953]/30">
                    {step.highlightTag}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CB953] block mb-1">
                    {step.stepBadge}
                  </span>
                  <h3 className="text-white text-xl font-bold font-serif group-hover:text-[#9CB953] transition-colors">
                    {step.title}
                  </h3>
                </div>

                <p className="text-white/80 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2.5 text-sm font-bold text-white bg-[#2B3A1A] hover:bg-[#1E2B12] px-8 py-3.5 rounded-[10px] border border-[#4A6330] shadow-[0_4px_20px_rgba(43,58,26,0.3)] hover:shadow-[0_6px_25px_rgba(43,58,26,0.4)] transition-all"
          >
            <span>Trải nghiệm trực tiếp toàn bộ quy trình</span>
            <ArrowRight size={16} className="text-[#9CB953]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;