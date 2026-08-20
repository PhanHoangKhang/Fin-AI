import { motion } from 'framer-motion';
import background3Img from '../assets/background3.svg';

const STEPS = [
  {
    num: "1",
    step: "Bước 1",
    title: "Cập nhật tin tức",
    desc: "Hệ thống liên tục thu thập hàng nghìn bài báo và báo cáo tài chính từ các nguồn chính thống và uy tín nhất trên thị trường.",
    delayClass: "mt-0",
  },
  {
    num: "2",
    step: "Bước 2",
    title: "AI Phân tích",
    desc: "Mô hình ngôn ngữ tự nhiên tiến hành đọc hiểu, tóm tắt ý chính và giải thích các thuật ngữ khó thành ngôn ngữ thường ngày.",
    delayClass: "mt-0 md:mt-8",
  },
  {
    num: "3",
    step: "Bước 3",
    title: "Đánh giá Tác động",
    desc: "Đưa ra thang điểm Sentiment và cảnh báo tác động trực tiếp của bản tin đến các mã cổ phiếu liên quan giúp bạn ra quyết định.",
    delayClass: "mt-0 md:mt-16",
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
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div 
            className="text-[#7A9B58] text-[34px] sm:text-[40px] font-bold mb-3 tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Cách thức hoạt động
          </div>
          <p className="text-[#3D5226] text-lg max-w-2xl mx-auto font-sans font-medium">
            Đơn giản hóa hành trình đầu tư của bạn với 3 bước dễ dàng.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 font-sans">
          {STEPS.map((stepItem, idx) => (
            <motion.div
              key={stepItem.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ 
                y: -6, 
                scale: 1.02,
                borderColor: "rgba(156, 185, 83, 0.8)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
              }}
              className={`bg-[#2B3A1A]/85 backdrop-blur-md border border-[#3D5226] rounded-[10px] p-8 relative overflow-hidden group shadow-lg transition-colors cursor-pointer ${stepItem.delayClass}`}
            >
              {/* Watermark number */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="absolute -right-4 -top-4 text-8xl font-bold text-[#3D5226]/30 group-hover:text-[#9CB953]/30 transition-colors pointer-events-none select-none font-mono"
              >
                {stepItem.num}
              </motion.div>

              <div className="inline-block px-3 py-1 bg-[#3D5226]/80 text-[#9CB953] font-bold text-xs rounded-[10px] mb-4 relative z-10 border border-[#9CB953]/30">
                {stepItem.step}
              </div>

              <h3 className="text-white text-xl font-bold mb-3 relative z-10 group-hover:text-[#9CB953] transition-colors">
                {stepItem.title}
              </h3>

              <p className="text-white/70 relative z-10 leading-relaxed text-sm">
                {stepItem.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;