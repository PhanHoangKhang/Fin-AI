import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { StockLogo } from "./StockLogo";
import backgroundImg from "../assets/background.svg";
import { stockService } from "../services/api";

const TICKER_ITEMS = [
  { symbol: "HPG", value: "29,550", change: "+350", percent: "+1.22%", up: true },
  { symbol: "VN-Index", value: "1,262.45", change: "+4.02", percent: "+0.32%", up: true },
  { symbol: "MBB", value: "21,150", change: "-25", percent: "-0.12%", up: false },
  { symbol: "FPT", value: "125,200", change: "+450", percent: "+0.36%", up: true },
  { symbol: "VCB", value: "92,600", change: "+600", percent: "+0.65%", up: true },
  { symbol: "VIC", value: "44,800", change: "+200", percent: "+0.45%", up: true },
  { symbol: "HNX-Index", value: "228.17", change: "+1.45", percent: "+0.64%", up: true },
  { symbol: "UPCOM", value: "91.24", change: "-0.18", percent: "-0.20%", up: false },
];

const WATCHLIST_SYMBOLS = ["VNM", "FPT", "HPG", "PLX"];

const DEFAULT_HERO_WATCHLIST = [
  { symbol: "VNM", value: "68,400", percent: "-0.50%", up: false },
  { symbol: "FPT", value: "131,200", percent: "+2.10%", up: true },
  { symbol: "HPG", value: "20,950", percent: "+1.22%", up: true },
  { symbol: "PLX", value: "41,500", percent: "+0.50%", up: true },
];

export const HeroSection = () => {
  const [watchlist, setWatchlist] = useState<{ symbol: string; value: string; percent: string; up: boolean }[]>(DEFAULT_HERO_WATCHLIST);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    setLoadingWatchlist(true);
    try {
      const data = await stockService.getTickerList(WATCHLIST_SYMBOLS.join(","));
      if (Array.isArray(data) && data.length > 0) {
        const fetchedMap = new Map(data.map(d => [d.symbol?.toUpperCase(), d]));
        const merged = WATCHLIST_SYMBOLS.map(sym => {
          const item = fetchedMap.get(sym);
          const fallback = DEFAULT_HERO_WATCHLIST.find(d => d.symbol === sym)!;
          return {
            symbol: sym,
            value: item && item.value && item.value !== "N/A" ? item.value : fallback.value,
            percent: item && item.percent ? item.percent : fallback.percent,
            up: item ? item.up : fallback.up,
          };
        });
        setWatchlist(merged);
      }
    } catch (error) {
      console.warn("Lỗi fetch watchlist hero:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  }, []);

  useEffect(() => {
    void fetchWatchlist();
  }, [fetchWatchlist]);

  return (
    <div
      className="relative pt-24 pb-16 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Ticker bar - Khung đóng tách biệt màu be đậm */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-6 max-w-7xl mb-12"
      >
        <div className="bg-[#EBE4D5] border border-[#DDD4C1] text-[#2B3A1A] py-2.5 px-4 rounded-2xl overflow-hidden shadow-2xs">
          <div className="animate-[ticker_32s_linear_infinite] flex items-center gap-10 whitespace-nowrap text-xs font-sans ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
              (item, i) => (
                <div key={i} className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-[#3D5226] uppercase">
                    {item.symbol}
                  </span>
                  <span className="font-semibold text-[#2B3A1A]">
                    {item.value}
                  </span>
                  <span
                    className={`flex items-center font-bold text-[11px] ${item.up ? "text-[#4D6E28]" : "text-[#C96B54]"}`}
                  >
                    {item.percent}
                    {item.up ? (
                      <TrendingUp size={12} className="ml-1 text-[#4D6E28]" />
                    ) : (
                      <TrendingDown size={12} className="ml-1 text-[#C96B54]" />
                    )}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#9CB953] live-dot"></span>
              <span className="text-[#3D5226] text-xs font-extrabold tracking-wider uppercase font-sans">
                NỀN TẢNG AI CHỨNG KHOÁN
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-[56px] text-[#2B3A1A] leading-[1.15] font-serif font-bold tracking-tight"
              style={{ fontFamily: "Lora, serif" }}
            >
              Đọc tin chứng khoán,
              <br />
              <span className="text-[#3D5226]">hiểu ngay tác động</span>
              <br />
              chỉ trong 30 giây.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-[#5A5248] text-base lg:text-lg leading-relaxed font-sans max-w-xl"
            >
              Nền tảng AI đơn giản hóa tin tức tài chính dành riêng cho người
              mới. Loại bỏ tin đồn, giải thích thuật ngữ bình dân và cảnh báo
              danh mục tự động.
            </motion.p>

            {/* Quick Action CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex items-center gap-4 pt-1"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#3D5226] hover:bg-[#2B3A1A] text-white rounded-full font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 group font-sans hover:-translate-y-0.5 active:scale-98"
              >
                <span>Khám phá Dashboard</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-5 py-3.5 text-sm font-bold text-[#3D5226] hover:text-[#2B3A1A] hover:bg-[#E8EDE0]/60 rounded-full transition font-sans"
              >
                Xem cách hoạt động
              </a>
            </motion.div>

            {/* Interactive Financial Term Highlight Feature Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="max-w-xl pt-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#7A9B58] shrink-0" />
                <span className="text-xs font-bold text-[#3D5226] uppercase tracking-wider">
                  TRẢI NGHIỆM GIẢI THÍCH THUẬT NGỮ (CLICK HOẶC BÔI ĐEN):
                </span>
              </div>

              <p className="text-xs text-[#6B6355] leading-relaxed mb-4">
                Thử click hoặc bôi đen các thuật ngữ khó hiểu để xem popup AI
                giải thích ngay:
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { term: "ebitda", label: "EBITDA" },
                  { term: "p/e", label: "Chỉ số P/E" },
                  { term: "roe", label: "ROE" },
                  { term: "nim", label: "NIM" },
                  { term: "margin call", label: "Margin Call" },
                  { term: "cagr", label: "CAGR" },
                ].map((item) => (
                  <motion.span
                    key={item.term}
                    data-term={item.term}
                    title={`Click để xem giải thích AI: ${item.label}`}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F2EC] hover:bg-[#EAE4D7] border border-[#E2DDD3] hover:border-[#D0C7B8] rounded-xl text-xs font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-colors"
                  >
                    <span className="text-[#D4A03D] text-[13px] leading-none">
                      ✨
                    </span>
                    <span>{item.label}</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Sources */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex items-center gap-4 text-xs font-semibold text-[#7A7060] font-sans pt-2"
            >
              <span className="uppercase tracking-wider text-[#A09888]">
                Tổng hợp từ:
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">
                CAFEF
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">
                VIETSTOCK
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">
                VNECONOMY
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">
                VNEXPRESS
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative space-y-6 lg:pt-2"
          >
            {/* Alert Card With Liquid-Glass Highlight & LOGO Fin-AI_Gray Watermark */}
            <motion.div 
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-[#FAF7F0] text-[#2B3A1A] p-6 rounded-3xl shadow-md border border-[#EBE4D5] relative overflow-hidden transition-shadow hover:shadow-xl"
            >
              {/* Hoạ tiết LOGO Fin-AI_Gray ở góc phải box */}
              <img
                src="/LOGO Fin-AI_Gray.svg"
                alt=""
                className="absolute -right-2 -bottom-2 w-48 h-48 object-contain opacity-35 pointer-events-none select-none z-0"
              />

              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex items-center gap-3.5">
                  <StockLogo
                    ticker="HPG"
                    size="lg"
                    alt="Hòa Phát Group"
                    className="border border-[#E0DDD6] shadow-sm"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-[#2B3A1A] text-lg leading-snug">
                      Hòa Phát Group
                    </h3>
                    <span className="text-xs text-[#7A7060] font-mono">
                      Giá: 29,550đ (+1.22%)
                    </span>
                  </div>
                </div>
                <span className="bg-transparent border border-[#DDD5C7] text-[#3D5226] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <TrendingUp size={13} className="text-[#3D5226]" /> Tích cực
                  86%
                </span>
              </div>

              {/* AI Summary Box */}
              <div className="bg-white/55 backdrop-blur-md p-5 rounded-2xl mb-4 border border-white/80 shadow-[0_4px_20px_rgba(43,58,26,0.04)] relative z-10">
                <div className="text-xs font-bold text-[#3D5226] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C7140] shrink-0" />
                  AI TÓM TẮT TRỌNG TÂM CHO NHÀ ĐẦU TƯ MỚI
                </div>
                <p className="text-xs text-[#2B3A1A] leading-relaxed select-text font-sans">
                  Giá quặng sắt thế giới giảm giúp HPG cải thiện biên lợi nhuận{" "}
                  <span
                    className="inline-flex items-center mx-1 px-2.5 py-0.5 bg-white/80 hover:bg-white border border-[#D5CFC0]/60 rounded-lg font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all hover:-translate-y-px"
                    data-term="ebitda"
                    title="Bôi đen hoặc click để xem giải thích"
                  >
                    EBITDA
                  </span>{" "}
                  tăng 38% và duy trì định giá{" "}
                  <span
                    className="inline-flex items-center mx-1 px-2.5 py-0.5 bg-white/80 hover:bg-white border border-[#D5CFC0]/60 rounded-lg font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all hover:-translate-y-px"
                    data-term="p/e"
                    title="Bôi đen hoặc click để xem giải thích"
                  >
                    P/E
                  </span>{" "}
                  ở mức 12x — hấp dẫn so với trung bình ngành.
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-center text-xs text-[#7A7060] pt-2 border-t border-[#EBE4D5]/80">
                <span className="italic">
                  💡 Bối cảnh hoặc click bất kỳ từ nào để tra cứu AI
                </span>
                <Link to="/dashboard" className="text-[#3D5226] font-bold hover:underline flex items-center gap-1">
                  <span>Chi tiết</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </motion.div>

            {/* Watchlist Preview */}
            <motion.div 
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 border border-[#E8EDE0] shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#2B3A1A] text-sm">
                    Bảng giá theo dõi nhanh
                  </h4>
                  <button
                    onClick={fetchWatchlist}
                    disabled={loadingWatchlist}
                    title="Làm mới giá"
                    className="p-1 text-[#7A9B58] hover:text-[#3D5226] hover:bg-[#F5F8F0] rounded-md transition disabled:opacity-50"
                  >
                    <RefreshCw
                      size={12}
                      className={loadingWatchlist ? "animate-spin" : ""}
                    />
                  </button>
                </div>
                <Link
                  to="/dashboard"
                  className="text-xs text-[#7A9B58] font-bold hover:text-[#3D5226] transition"
                >
                  Xem tất cả &rarr;
                </Link>
              </div>

              <div className="space-y-2.5">
                {watchlist.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4, backgroundColor: "rgba(245, 248, 240, 1)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex justify-between items-center p-2.5 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <StockLogo ticker={item.symbol} size="xs" fallback="none" />
                      <span className="font-bold text-sm text-[#2B3A1A] font-mono group-hover:text-[#3D5226] transition-colors">
                        {item.symbol}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#2B3A1A]">
                        {item.value.endsWith('đ') ? item.value : `${item.value}đ`}
                      </div>
                      <div
                        className={`text-[11px] font-mono font-bold flex items-center justify-end ${item.up ? "text-[#3D5226]" : "text-[#C96B54]"}`}
                      >
                        {item.up ? (
                          <TrendingUp size={11} className="mr-0.5" />
                        ) : (
                          <TrendingDown size={11} className="mr-0.5" />
                        )}
                        {item.percent}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `,
        }}
      />
    </div>
  );
};

export default HeroSection;
