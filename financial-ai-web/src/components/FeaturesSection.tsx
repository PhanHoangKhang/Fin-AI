import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  BookOpen,
  TrendingUp,
  Layers,
  ArrowRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import background2Img from '../assets/background2.svg';

interface FeatureItem {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  icon: typeof FileText;
  longDesc: string;
  highlights: string[];
  ctaText: string;
  ctaLink: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "summary",
    title: "Tóm tắt tin tức tự động trong 30 giây",
    badge: "Tiết kiệm 80% thời gian",
    shortDesc: "Bóc tách luận điểm then chốt từ bài báo nghìn chữ thành 3 ý chính cốt lõi.",
    icon: FileText,
    longDesc: "Thuật toán đọc hiểu và bóc tách các luận điểm then chốt từ các bài phân tích tài chính dài hàng nghìn chữ, giúp bạn nắm bắt ngay diễn biến thị trường mà không bị ngợp thông tin phức tạp.",
    highlights: [
      "Trích xuất 3 luận điểm tài chính quan trọng nhất",
      "Ước tính thời gian đọc giảm từ 8 phút xuống còn 30 giây",
      "Tự động phát hiện số liệu doanh thu, lợi nhuận và cổ tức",
    ],
    ctaText: "Thử đọc tin tóm tắt ngay",
    ctaLink: "/dashboard",
  },
  {
    id: "dictionary",
    title: "Dịch thuật ngữ bình dân cho nhà đầu tư F0",
    badge: "26+ Thuật ngữ F0",
    shortDesc: "Biến các chỉ số P/E, EBITDA, NIM, Margin Call thành ví dụ đời thường dễ hiểu.",
    icon: BookOpen,
    longDesc: "Không cần tra cứu Google hay bối rối trước các từ ngữ tài chính chuyên môn. AI sẽ tự động phân tích ngữ cảnh và phiên dịch sang ngôn ngữ đời thường, kèm ví dụ thực tế cực kỳ dễ nhớ.",
    highlights: [
      "Tra cứu tức thì bằng cách click hoặc bôi đen từ khóa",
      "Ví dụ thực tế sinh động, loại bỏ công thức khô khan",
      "Bổ sung liên tục các thuật ngữ và tiếng lóng chứng khoán",
    ],
    ctaText: "Khám phá từ điển F0",
    ctaLink: "/dashboard/dictionary",
  },
  {
    id: "sentiment",
    title: "Chấm điểm Sắc thái (Sentiment) & Tác động",
    badge: "Độ chính xác 94.2%",
    shortDesc: "Đo lường mức độ Tích cực/Tiêu cực và dự báo tác động trực tiếp tới giá cổ phiếu.",
    icon: TrendingUp,
    longDesc: "Hệ thống AI phân tích sắc thái cảm xúc của bài báo qua thang điểm 0-100% (Tích cực, Tiêu cực, Trung lập) và đối chiếu trực tiếp để cảnh báo rủi ro hoặc cơ hội tới mã cổ phiếu của bạn.",
    highlights: [
      "Thang đo Sentiment thời gian thực cho từng mã cổ phiếu",
      "Cảnh báo rủi ro trước các tin tức biến động mạnh",
      "Tự động liên kết tin tức tới danh mục cổ phiếu cá nhân",
    ],
    ctaText: "Xem bảng tin & Sắc thái",
    ctaLink: "/dashboard",
  },
  {
    id: "multisource",
    title: "Tổng hợp 4 nguồn báo tài chính hàng đầu",
    badge: "Realtime Multi-Source",
    shortDesc: "Khử trùng lặp tin tức từ VnExpress, CafeF, Vietstock, VnEconomy thời gian thực.",
    icon: Layers,
    longDesc: "Tự động thu thập, sàng lọc, khử trùng lặp và phân loại tin tức tức thời từ 4 tờ báo tài chính uy tín nhất Việt Nam thành một dòng chảy thông tin thống nhất, mạch lạc và sạch sẽ.",
    highlights: [
      "Cập nhật liên tục 24/7 từ 4 đầu báo chính thống",
      "Thuật toán AI tự động gộp các bài viết cùng chung một sự kiện",
      "Lọc bỏ tin tức rác và tin đồn chưa được kiểm chứng",
    ],
    ctaText: "Xem luồng tin tổng hợp",
    ctaLink: "/dashboard",
  },
];

export const FeaturesSection = () => {
  // Quản lý tab đang mở (mặc định mở tab đầu tiên)
  const [activeTab, setActiveTab] = useState<string>("summary");

  // State tương tác demo tra cứu thuật ngữ trong tab 2
  const [selectedTerm, setSelectedTerm] = useState<string>("pe");

  // State tương tác chọn cổ phiếu trong tab 3
  const [selectedStock, setSelectedStock] = useState<string>("HPG");

  const toggleTab = (id: string) => {
    setActiveTab(prev => (prev === id ? "" : id));
  };

  return (
    <section 
      id="features" 
      className="py-24 border-y border-[#DDD5C7] bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${background2Img})` }}
    >
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div 
            className="text-[#7A9B58] text-[34px] sm:text-[40px] font-bold tracking-wide select-none"
            style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
          >
            Sức mạnh AI
          </div>
          <h2 className="text-3xl sm:text-4xl text-[#2B3A1A] font-serif leading-snug" style={{ fontFamily: 'Lora, serif' }}>
            Trải nghiệm đọc tin nâng tầm kiến thức tài chính của bạn.
          </h2>
          <p className="text-[#5A5248] text-base sm:text-lg font-sans leading-relaxed">
            Click vào từng tính năng bên dưới để xem trực tiếp cách AI xử lý và phân tích thông tin cho bạn.
          </p>
        </motion.div>

        {/* ================= INTERACTIVE EXPANDABLE FEATURE LIST WITH FRAMER MOTION ================= */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {FEATURES.map((feature, index) => {
            const isOpen = activeTab === feature.id;
            const IconComponent = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                layout
                className={`bg-[#FAF7F0]/95 backdrop-blur-xs rounded-[10px] border transition-colors duration-300 overflow-hidden shadow-xs ${
                  isOpen
                    ? "border-[#7A9B58] shadow-[0_8px_30px_rgba(43,58,26,0.08)] ring-1 ring-[#7A9B58]/30"
                    : "border-[#DDD5C7] hover:border-[#7A9B58]/60 hover:bg-white/80"
                }`}
              >
                {/* ACCORDION HEADER BAR */}
                <motion.button
                  type="button"
                  onClick={() => toggleTab(feature.id)}
                  whileHover={{ scale: 1.003 }}
                  whileTap={{ scale: 0.995 }}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none transition-colors"
                >
                  <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                    {/* Icon Box with gentle hover animation */}
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`w-12 h-12 rounded-[10px] shrink-0 flex items-center justify-center transition-colors duration-200 ${
                        isOpen
                          ? "bg-[#2B3A1A] text-[#9CB953] border border-[#4A6330] shadow-2xs"
                          : "bg-transparent border border-[#DDD5C7] text-[#2B3A1A]"
                      }`}
                    >
                      <IconComponent size={22} />
                    </motion.div>

                    {/* Title & Short Desc */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#7A9B58]">
                          0{index + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[#2B3A1A] font-serif truncate">
                          {feature.title}
                        </h3>
                        <span className="hidden sm:inline-block text-[11px] font-bold text-[#2B3A1A] bg-[#EFE8DA] px-2.5 py-0.5 rounded-[6px] border border-[#DDD3C0]">
                          {feature.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#5A5248] truncate mt-0.5">
                        {feature.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Expand / Collapse Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#7A9B58] hidden md:inline">
                      {isOpen ? "Thu gọn" : "Xem demo"}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border text-[#2B3A1A] ${
                        isOpen ? "bg-[#EFE8DA] border-[#7A9B58]" : "bg-white border-[#DDD5C7]"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>
                </motion.button>

                {/* EXPANDABLE DEMO SHOWCASE WITH FRAMER MOTION ANIMATE PRESENCE */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${feature.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-[#EFE8DA]">
                        <motion.div 
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="grid lg:grid-cols-12 gap-8 items-stretch pt-4"
                        >
                          
                          {/* Cột trái: Mô tả chi tiết & Điểm nổi bật */}
                          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F5E0] text-[#2B3A1A] rounded-[6px] border border-[#C8DFB0] text-xs font-bold">
                                <Sparkles size={13} className="text-[#7A9B58]" />
                                <span>Trực quan hóa tính năng</span>
                              </div>

                              <p className="text-sm text-[#5A5248] leading-relaxed">
                                {feature.longDesc}
                              </p>

                              <div className="space-y-2 pt-2">
                                {feature.highlights.map((h, i) => (
                                  <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.25, delay: 0.15 + i * 0.08 }}
                                    className="flex items-start gap-2 text-xs text-[#2B3A1A]"
                                  >
                                    <CheckCircle2 size={15} className="text-[#7A9B58] shrink-0 mt-0.5" />
                                    <span>{h}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2">
                              <Link
                                to={feature.ctaLink}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B3A1A] hover:bg-[#1E2B12] text-white rounded-[10px] text-xs font-bold shadow-sm transition-all hover:gap-3 group active:scale-98"
                              >
                                <span>{feature.ctaText}</span>
                                <ArrowRight size={14} className="text-[#9CB953] transition-transform group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>

                          {/* Cột phải: Live Interactive Demo Mockup */}
                          <div className="lg:col-span-7 bg-white/95 rounded-[10px] border border-[#DDD5C7] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                            
                            {/* DEMO 1: TÓM TẮT TIN TỰ ĐỘNG (SUMMARY) */}
                            {feature.id === "summary" && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#7A9B58] live-dot"></span>
                                    <span className="text-xs font-bold text-[#2B3A1A] uppercase tracking-wider">
                                      Bản tin: Tập đoàn Hòa Phát (HPG)
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-[#7A7060] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#DDD5C7]">
                                    VNEXPRESS · 10:30
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 text-xs font-bold text-[#3D5226]">
                                    <Zap size={14} className="text-[#7A9B58]" />
                                    <span>AI Tóm lược 3 ý chính (Đọc trong 30s):</span>
                                  </div>
                                  
                                  <div className="space-y-2 text-xs text-[#2B3A1A]">
                                    {[
                                      { num: 1, title: "Doanh thu quý tăng 24%:", desc: "Đạt 38,500 tỷ nhờ sản lượng thép xây dựng và HRC phục hồi mạnh mẽ tại thị trường nội địa." },
                                      { num: 2, title: "Chi phí vốn giảm 15%:", desc: "Giá quặng sắt thế giới hạ nhiệt giúp biên lợi nhuận gộp nới rộng thêm 3.2 điểm phần trăm." },
                                      { num: 3, title: "Kế hoạch cổ tức 1,500đ:", desc: "Ban lãnh đạo phê duyệt phương án chi trả cổ tức tiền mặt đợt 1 năm 2026." },
                                    ].map((item, idx) => (
                                      <motion.div
                                        key={item.num}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, delay: 0.2 + idx * 0.08 }}
                                        className="p-2.5 bg-[#FAF7F0] rounded-[8px] border border-[#EFE8DA] flex items-start gap-2.5 hover:border-[#7A9B58] transition-colors"
                                      >
                                        <span className="font-bold text-[#7A9B58] bg-white px-2 py-0.5 rounded border border-[#DDD5C7] shrink-0">{item.num}</span>
                                        <span><strong>{item.title}</strong> {item.desc}</span>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* DEMO 2: DỊCH THUẬT NGỮ BÌNH DÂN (DICTIONARY) */}
                            {feature.id === "dictionary" && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                                  <span className="text-xs font-bold text-[#2B3A1A] uppercase tracking-wider">
                                    Click chọn từ khóa để xem AI giải thích:
                                  </span>
                                  <span className="text-[10px] text-[#7A7060]">Interactive Demo</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {[
                                    { key: "pe", label: "P/E (Price to Earnings)" },
                                    { key: "ebitda", label: "EBITDA" },
                                    { key: "nim", label: "NIM (Net Interest Margin)" },
                                    { key: "margin", label: "Margin Call" },
                                  ].map(t => (
                                    <motion.button
                                      key={t.key}
                                      type="button"
                                      onClick={() => setSelectedTerm(t.key)}
                                      whileHover={{ scale: 1.03 }}
                                      whileTap={{ scale: 0.97 }}
                                      className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                                        selectedTerm === t.key
                                          ? "bg-[#2B3A1A] text-white shadow-2xs border border-[#4A6330]"
                                          : "bg-[#FAF7F0] text-[#2B3A1A] border border-[#DDD5C7] hover:border-[#7A9B58]"
                                      }`}
                                    >
                                      {t.label}
                                    </motion.button>
                                  ))}
                                </div>

                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={selectedTerm}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-4 bg-[#EFE8DA] rounded-[10px] border border-[#DDD3C0] space-y-2"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="font-mono font-bold text-[#2B3A1A] text-xs bg-white px-2 py-0.5 rounded border border-[#DDD3C0]">
                                        {selectedTerm === "pe" && "P/E = 12x (Định giá theo lợi nhuận)"}
                                        {selectedTerm === "ebitda" && "EBITDA (Lợi nhuận cốt lõi)"}
                                        {selectedTerm === "nim" && "NIM (Biên lãi ròng ngân hàng)"}
                                        {selectedTerm === "margin" && "Margin Call (Cảnh báo ký quỹ)"}
                                      </span>
                                      <span className="text-[11px] font-bold text-[#7A9B58]">Giải thích bình dân</span>
                                    </div>

                                    <p className="text-xs text-[#2B3A1A] leading-relaxed">
                                      {selectedTerm === "pe" &&
                                        "💡 'Bạn cần bỏ ra 12 đồng để mua được 1 đồng lợi nhuận mỗi năm của doanh nghiệp. P/E càng thấp nghĩa là giá cổ phiếu đang càng rẻ so với khả năng kiếm tiền của công ty.'"}
                                      {selectedTerm === "ebitda" &&
                                        "💡 'Lợi nhuận thuần túy từ hoạt động kinh doanh chính trước khi trừ tiền trả nợ ngân hàng, thuế cho nhà nước và khấu hao máy móc nhà xưởng.'"}
                                      {selectedTerm === "nim" &&
                                        "💡 'Chênh lệch giữa lãi suất ngân hàng thu về từ người đi vay và lãi suất ngân hàng phải trả cho người gửi tiết kiệm — thước đo ngân hàng kiếm lời tốt hay không.'"}
                                      {selectedTerm === "margin" &&
                                        "💡 'Lời nhắc nhở từ công ty chứng khoán yêu cầu bạn nộp thêm tiền vì khoản đầu tư vay nợ đang bị lỗ quá giới hạn an toàn quy định.'"}
                                    </p>
                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            )}

                            {/* DEMO 3: SENTIMENT RADAR (SENTIMENT) */}
                            {feature.id === "sentiment" && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                                  <span className="text-xs font-bold text-[#2B3A1A] uppercase tracking-wider">
                                    Chọn cổ phiếu để đo sắc thái tin:
                                  </span>
                                  <div className="flex gap-1">
                                    {["HPG", "VNM", "FPT", "MBB"].map(sym => (
                                      <motion.button
                                        key={sym}
                                        type="button"
                                        onClick={() => setSelectedStock(sym)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-2.5 py-1 rounded-[6px] text-xs font-bold font-mono transition-all ${
                                          selectedStock === sym
                                            ? "bg-[#2B3A1A] text-white"
                                            : "bg-[#FAF7F0] text-[#2B3A1A] border border-[#DDD5C7]"
                                        }`}
                                      >
                                        {sym}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-4 bg-[#FAF7F0] rounded-[10px] border border-[#DDD5C7] space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-[#2B3A1A]">
                                      Sắc thái tin tức {selectedStock}:
                                    </span>
                                    <motion.span 
                                      key={selectedStock}
                                      initial={{ scale: 0.9, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-[#3D5226] bg-[#E8F5E0] px-2.5 py-0.5 rounded border border-[#C8DFB0]"
                                    >
                                      <TrendingUp size={12} />
                                      <span>
                                        {selectedStock === "HPG" && "Tích cực 86%"}
                                        {selectedStock === "VNM" && "Trung lập 54%"}
                                        {selectedStock === "FPT" && "Rất tích cực 92%"}
                                        {selectedStock === "MBB" && "Tích cực 78%"}
                                      </span>
                                    </motion.span>
                                  </div>

                                  <div className="w-full bg-[#EFE8DA] h-2.5 rounded-full overflow-hidden">
                                    <motion.div
                                      className="bg-[#7A9B58] h-full rounded-full"
                                      animate={{
                                        width:
                                          selectedStock === "HPG"
                                            ? "86%"
                                            : selectedStock === "VNM"
                                            ? "54%"
                                            : selectedStock === "FPT"
                                            ? "92%"
                                            : "78%",
                                      }}
                                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    />
                                  </div>

                                  <div className="flex justify-between text-[10px] text-[#8C8272] font-mono">
                                    <span>Tiêu cực (0%)</span>
                                    <span>Trung lập (50%)</span>
                                    <span>Tích cực (100%)</span>
                                  </div>

                                  <div className="pt-2 text-[11px] text-[#5A5248] italic border-t border-[#EFE8DA]">
                                    Dự báo tác động: Tin tức hỗ trợ tốt cho xu hướng tăng ngắn hạn trong 3-5 phiên tới.
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* DEMO 4: 4 NGUỒN TIN TỨC (MULTISOURCE) */}
                            {feature.id === "multisource" && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                                  <span className="text-xs font-bold text-[#2B3A1A] uppercase tracking-wider">
                                    Dòng tin 4 nguồn đang cập nhật trực tiếp:
                                  </span>
                                  <span className="text-[10px] text-[#7A7060]">Realtime Feed</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                                  {[
                                    { label: "Báo điện tử", name: "VnExpress", color: "text-[#8E24AA]" },
                                    { label: "Chuyên trang", name: "CafeF", color: "text-[#E8562A]" },
                                    { label: "Thị trường", name: "Vietstock", color: "text-[#1A5EAB]" },
                                    { label: "Kinh tế", name: "VnEconomy", color: "text-[#2E7D32]" },
                                  ].map((src, i) => (
                                    <motion.div
                                      key={src.name}
                                      whileHover={{ y: -3, scale: 1.02 }}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2, delay: 0.15 + i * 0.05 }}
                                      className={`bg-[#FAF7F0] p-2.5 rounded-[8px] border border-[#DDD5C7] ${src.color} cursor-default`}
                                    >
                                      <div className="text-[9px] text-[#7A7060] font-normal">{src.label}</div>
                                      {src.name}
                                    </motion.div>
                                  ))}
                                </div>

                                <div className="p-3 bg-[#EFE8DA] rounded-[8px] border border-[#DDD3C0] text-xs space-y-1.5">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#3D5226]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A9B58]"></span>
                                    <span>AI ĐÃ KHỬ 14 BÀI BÁO TRÙNG LẶP TRONG 1 GIỜ QUA</span>
                                  </div>
                                  <p className="text-[11px] text-[#5A5248]">
                                    Bạn chỉ nhận được 1 bản tóm tắt duy nhất tổng hợp đầy đủ góc nhìn từ cả 4 nguồn mà không phải đọc lại cùng một sự kiện 4 lần.
                                  </p>
                                </div>
                              </div>
                            )}

                          </div>

                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;