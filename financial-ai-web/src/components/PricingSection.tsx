import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
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
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div 
            className="text-white text-[34px] sm:text-[40px] font-bold mb-2 tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Chọn gói phù hợp
          </div>
          <h2 className="text-4xl text-white font-serif mb-6" style={{ fontFamily: 'Lora, serif' }}>
            Bảng giá Dịch vụ
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi cần. Chọn gói phù hợp với nhu cầu đầu tư của bạn.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ 
              y: -6, 
              scale: 1.01,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
            }}
            className="bg-white/95 backdrop-blur-md rounded-[10px] p-8 border border-[#E8EDE0] shadow-sm flex flex-col justify-between group relative overflow-hidden cursor-pointer transition-colors"
          >
            {/* Ambient glow on hover */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#9CB953]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#2B3A1A] mb-2 font-serif">Miễn phí (Standard)</h3>
                <p className="text-[#7A7060]">Dành cho học sinh, sinh viên & F0 mới tìm hiểu.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[#2B3A1A] font-mono">0 VNĐ</span>
                <span className="text-[#7A7060]"> / tháng</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={20} />
                  <span>Tóm tắt tin tức tự động hàng ngày</span>
                </li>
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={20} />
                  <span>Tra cứu từ điển tài chính cơ bản</span>
                </li>
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={20} />
                  <span>Tra cứu thuật ngữ chuyên ngành 5 lần / ngày</span>
                </li>
                <li className="flex items-start gap-3 text-[#2B3A1A]">
                  <Check className="text-[#7A9B58] mt-0.5 shrink-0" size={20} />
                  <span>Theo dõi bảng giá thời gian thực</span>
                </li>
                <li className="flex items-start gap-3 text-[#7A7060]/50 line-through">
                  <Check className="text-[#7A7060]/30 mt-0.5 shrink-0" size={20} />
                  <span>Cảnh báo rủi ro danh mục cá nhân</span>
                </li>
              </ul>
            </div>

            <Link 
              to="/dashboard"
              className="w-full py-3.5 px-6 rounded-[10px] font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 bg-[#E8EDE0] text-[#2B3A1A] group-hover:bg-white/90 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:scale-[1.01]"
            >
              <span>Thử ngay</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ 
              y: -6, 
              scale: 1.01,
              boxShadow: "0 20px 45px -12px rgba(156, 185, 83, 0.35)",
              borderColor: "rgba(156, 185, 83, 1)"
            }}
            className="bg-[#2B3A1A]/95 backdrop-blur-md rounded-[10px] p-8 border border-[#3D5226] shadow-xl flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-colors"
          >
            {/* Ambient glow on hover */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#9CB953]/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="absolute top-0 right-0 bg-[#9CB953] text-[#2B3A1A] text-xs font-bold px-4 py-1.5 rounded-bl-[10px] uppercase tracking-wider z-20 flex items-center gap-1">
              <Sparkles size={12} />
              <span>Gói Pro</span>
            </div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2 font-serif">Gói Pro (AI Portfolio)</h3>
                <p className="text-white/70">Cảnh báo rủi ro danh mục cá nhân hóa & AI Tutor.</p>
              </div>
              <div className="mb-8 flex items-baseline gap-2.5 flex-wrap">
                <span className="text-lg text-white/40 line-through font-semibold font-mono">149,000 VNĐ</span>
                <span className="text-4xl font-bold text-white font-mono">79,000 VNĐ</span>
                <span className="text-white/70"> / tháng</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={20} />
                  <span>Tóm tắt tin tức <strong>không giới hạn</strong></span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={20} />
                  <span>Tra cứu từ điển tài chính nâng cao</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={20} />
                  <span>Tra cứu thuật ngữ chuyên ngành <strong>không giới hạn</strong></span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={20} />
                  <span>Theo dõi bảng giá thời gian thực</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="text-[#9CB953] mt-0.5 shrink-0" size={20} />
                  <span>Cảnh báo rủi ro danh mục cá nhân hóa</span>
                </li>
              </ul>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-3.5 px-6 rounded-[10px] font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 relative z-10 bg-white/20 text-white backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-[#2B3A1A] group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] group-hover:scale-[1.01]"
            >
              <span>Thử ngay</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;