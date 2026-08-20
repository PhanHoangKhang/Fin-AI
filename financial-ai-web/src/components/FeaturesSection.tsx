import { motion } from 'framer-motion';
import background2Img from '../assets/background2.svg';

const FEATURES_DATA = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Tóm tắt tin tức tự động",
    desc: "Trích xuất ngay những ý chính quan trọng nhất từ các bài báo dài, giúp bạn nắm bắt cốt lõi vấn đề trong 30 giây mà không cần đọc hết bài.",
    badge: "Tiết kiệm 80% thời gian",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Dịch thuật ngữ bình dân",
    desc: "Các thuật ngữ chuyên ngành tài chính (như P/E, ROE, Margin) được AI giải thích tự động sang ngôn ngữ đời thường, phù hợp cho người mới F0.",
    badge: "26+ Thuật ngữ F0",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Đánh giá Sentiment chuẩn xác",
    desc: "AI chấm điểm sắc thái của tin tức (Tích cực/Tiêu cực/Trung lập) và liên kết trực tiếp để dự báo mức độ tác động lên giá cổ phiếu liên quan.",
    badge: "Độ chính xác 94.2%",
  },
];

export const FeaturesSection = () => {
  return (
    <section 
      id="features" 
      className="py-24 border-y border-[#E0DDD6] bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${background2Img})` }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div 
            className="text-[#7A9B58] text-[34px] sm:text-[40px] font-bold mb-2 tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Sức mạnh AI
          </div>
          <h2 className="text-4xl text-[#2B3A1A] font-serif mb-6" style={{ fontFamily: 'Lora, serif' }}>
            Trải nghiệm đọc tin nâng tầm kiến thức tài chính của bạn.
          </h2>
          <p className="text-[#7A7060] text-lg font-sans">
            Mọi bài báo phức tạp đều được xử lý để mang lại thông tin súc tích, dễ hiểu và có tính ứng dụng trực tiếp cho danh mục đầu tư của bạn.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 35px -10px rgba(61, 82, 38, 0.12)",
                borderColor: "rgba(156, 185, 83, 0.6)"
              }}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl border border-[#E8EDE0] shadow-sm font-sans flex flex-col justify-between relative group cursor-pointer transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-14 h-14 rounded-2xl bg-[#F5F8F0] border border-[#E8EDE0] flex items-center justify-center text-[#3D5226] group-hover:bg-[#3D5226] group-hover:text-white transition-colors duration-300 shadow-2xs"
                  >
                    {feature.icon}
                  </motion.div>
                  <span className="text-[11px] font-bold text-[#7A9B58] bg-[#F5F8F0] px-3 py-1 rounded-full border border-[#E8EDE0]/60">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#2B3A1A] mb-3 group-hover:text-[#3D5226] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#7A7060] leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F5F2EC] flex items-center text-xs font-bold text-[#3D5226] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Khám phá ngay &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;