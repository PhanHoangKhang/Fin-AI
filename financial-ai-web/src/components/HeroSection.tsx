import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
  Zap,
} from "lucide-react";
import { StockLogo } from "./StockLogo";
import backgroundImg from "../assets/background.svg";
import illustration1Img from "../assets/illustration_1.svg";
import illustration45 from "../assets/illustration/45.svg";
import illustration46 from "../assets/illustration/46.svg";
import illustration47 from "../assets/illustration/47.svg";
import illustration48 from "../assets/illustration/48.svg";
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

// Danh sách các tờ tiền & illustration mới (45, 46, 47, 48) rơi xen kẽ ngẫu nhiên
const FALLING_ITEMS = [
  { id: 1, src: illustration45, left: "3%", size: "w-16 sm:w-22", delay: "0s", duration: "7.2s", startRot: -25, endRot: 45, drift: 25, opacity: 0.85 },
  { id: 2, src: illustration46, left: "12%", size: "w-16 sm:w-22", delay: "2.4s", duration: "8.5s", startRot: 15, endRot: -30, drift: -20, opacity: 0.8 },
  { id: 3, src: illustration47, left: "22%", size: "w-16 sm:w-22", delay: "1.0s", duration: "6.8s", startRot: -20, endRot: 50, drift: 30, opacity: 0.85 },
  { id: 4, src: illustration48, left: "32%", size: "w-12 sm:w-18", delay: "3.5s", duration: "9.0s", startRot: 20, endRot: -40, drift: -25, opacity: 0.8 },
  { id: 5, src: illustration45, left: "42%", size: "w-14 sm:w-18", delay: "0.8s", duration: "7.6s", startRot: -30, endRot: 30, drift: 20, opacity: 0.85 },
  { id: 6, src: illustration46, left: "52%", size: "w-16 sm:w-22", delay: "4.2s", duration: "8.2s", startRot: 25, endRot: -35, drift: -20, opacity: 0.8 },
  { id: 7, src: illustration47, left: "62%", size: "w-16 sm:w-22", delay: "1.5s", duration: "7.0s", startRot: -35, endRot: 40, drift: 25, opacity: 0.85 },
  { id: 8, src: illustration48, left: "72%", size: "w-12 sm:w-18", delay: "3.2s", duration: "8.6s", startRot: 20, endRot: -25, drift: -30, opacity: 0.8 },
  { id: 9, src: illustration45, left: "82%", size: "w-16 sm:w-24", delay: "0.3s", duration: "6.9s", startRot: -15, endRot: 45, drift: 20, opacity: 0.85 },
  { id: 10, src: illustration46, left: "91%", size: "w-16 sm:w-22", delay: "2.1s", duration: "8.0s", startRot: 30, endRot: -45, drift: -20, opacity: 0.8 },
  { id: 11, src: illustration47, left: "8%", size: "w-16 sm:w-20", delay: "5.0s", duration: "7.8s", startRot: 10, endRot: -25, drift: -15, opacity: 0.8 },
  { id: 12, src: illustration45, left: "88%", size: "w-14 sm:w-20", delay: "4.5s", duration: "8.8s", startRot: -30, endRot: 35, drift: 25, opacity: 0.8 },
];

export const HeroSection = () => {
  const [watchlist, setWatchlist] = useState<{ symbol: string; value: string; percent: string; up: boolean }[]>(DEFAULT_HERO_WATCHLIST);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [demoTab, setDemoTab] = useState<"summary" | "original">("summary");

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
    <section
      className="relative pt-28 pb-20 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      
      {/* ================= HIỆU ỨNG TỜ TIỀN & ILLUSTRATION MỚI (45, 46, 47, 48) RƠI XEN KẼ ================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {FALLING_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.size}`}
            style={{
              left: item.left,
              top: "-90px",
              animation: `item-fall ${item.duration} linear infinite`,
              animationDelay: item.delay,
              // Dynamic CSS variables for rotation, drift, and opacity
              ["--rot-start" as string]: `${item.startRot}deg`,
              ["--rot-end" as string]: `${item.endRot}deg`,
              ["--drift" as string]: `${item.drift}px`,
              ["--max-opacity" as string]: `${item.opacity}`,
            }}
          >
            <img
              src={item.src}
              alt=""
              className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(43,58,26,0.15)]"
            />
          </div>
        ))}
      </div>
      {/* ============================================================================================== */}

      {/* 1. TOP TICKER STRIP - Phong cách giấy nến ấm áp */}
      <div className="container mx-auto px-6 max-w-7xl mb-12 relative z-10">
        <div className="bg-[#EFE8DA]/95 border border-[#DDD3C0] text-[#2B3A1A] py-2.5 px-4 rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(43,58,26,0.04)]">
          <div className="animate-[ticker_32s_linear_infinite] flex items-center gap-10 whitespace-nowrap text-xs font-sans ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
              (item, i) => (
                <div key={i} className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-[#2B3A1A] uppercase tracking-wide">
                    {item.symbol}
                  </span>
                  <span className="font-semibold text-[#3D372E]">
                    {item.value}
                  </span>
                  <span
                    className={`flex items-center font-bold text-[11px] ${item.up ? "text-[#3D5226]" : "text-[#C96B54]"}`}
                  >
                    {item.percent}
                    {item.up ? (
                      <TrendingUp size={12} className="ml-0.5 text-[#3D5226]" />
                    ) : (
                      <TrendingDown size={12} className="ml-0.5 text-[#C96B54]" />
                    )}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* 2. EDITORIAL HERO HEADLINE & VALUE PROPOSITION WITH FULL ILLUSTRATION_1 */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14">
          
          {/* Cột trái: Văn bản thông điệp & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 select-none px-3.5 py-1.5 bg-[#FAF7F0] rounded-[10px] border border-[#DDD5C7] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#7A9B58] live-dot"></span>
              <span className="text-[#2B3A1A] text-[11px] font-bold tracking-wider uppercase font-sans">
                NỀN TẢNG AI ĐỌC TIN & QUẢN TRỊ DANH MỤC CHO NHÀ ĐẦU TƯ F0
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[56px] text-[#2B3A1A] leading-[1.14] font-serif font-bold tracking-tight"
              style={{ fontFamily: "Lora, serif" }}
            >
              Đọc tin chứng khoán,
              <br />
              <span className="text-[#3D5226]">hiểu ngay tác động</span>
              <br />
              chỉ trong 30 giây.
            </h1>

            <p className="text-[#5A5248] text-base lg:text-lg leading-relaxed font-sans max-w-2xl">
              Loại bỏ hàng giờ đọc báo cáo phức tạp. AI tự động tóm tắt cốt lõi, dịch thuật ngữ tài chính sang ngôn ngữ đời thường và phân tích tác động trực tiếp tới danh mục của bạn.
            </p>

            {/* PRIMARY CTA & SECONDARY ACTIONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#2B3A1A] hover:bg-[#1E2B12] text-white border border-[#4A6330] rounded-[10px] font-bold text-base shadow-[0_4px_20px_rgba(43,58,26,0.22)] hover:shadow-[0_6px_25px_rgba(43,58,26,0.3)] transition-all duration-200 group font-sans hover:-translate-y-0.5 active:scale-98"
              >
                <span>Thử ngay</span>
                <ArrowRight size={18} className="text-[#9CB953] transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center px-6 py-4 text-sm font-bold text-[#2B3A1A] bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#DDD5C7] rounded-[10px] transition duration-150 font-sans shadow-2xs hover:shadow-xs"
              >
                Xem cách hoạt động
              </a>

              <div className="flex items-center gap-2 text-xs text-[#7A7060] font-sans pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9B58]"></span>
                <span className="font-semibold text-[#5A5248]">4 nguồn tin chính thống</span>
                <span className="text-[#DDD4C1]">·</span>
                <span className="font-semibold text-[#5A5248]">26+ thuật ngữ F0</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Hình minh họa illustration_1 */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
            <div className="relative p-1 w-full max-w-[380px] lg:max-w-[440px]">
              <img
                src={illustration1Img}
                alt="Fin-AI Financial Intelligence Artwork"
                className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.01] drop-shadow-sm"
              />
            </div>
          </div>

        </div>

        {/* 3. INTERACTIVE BENTO SHOWCASE */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* BENTO CARD 1 (7 COLS): INTERACTIVE LIVE ARTICLE DECODER */}
          <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#DDD5C7] rounded-[10px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(43,58,26,0.06)] relative overflow-hidden flex flex-col justify-between">
            {/* Watermark logo */}
            <img
              src="/LOGO Fin-AI_Gray.svg"
              alt=""
              className="absolute -right-4 -bottom-4 w-44 h-44 object-contain opacity-20 pointer-events-none select-none z-0"
            />

            <div className="relative z-10 space-y-4">
              {/* Header: Company & Sentiment */}
              <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-[#E8EDE0]">
                <div className="flex items-center gap-3">
                  <StockLogo ticker="HPG" size="md" alt="Hòa Phát" className="border border-[#DDD5C7] shadow-2xs rounded-[6px]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-[#2B3A1A] text-lg">
                        Tập đoàn Hòa Phát (HPG)
                      </h3>
                      <span className="bg-white text-[#5A5248] text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-[#DDD5C7]">
                        VNEXPRESS
                      </span>
                    </div>
                    <span className="text-xs text-[#7A7060] font-mono">
                      Giá khớp lệnh: 29,550đ (+1.22%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#E8F5E0] text-[#2B3A1A] border border-[#C8DFB0] text-xs font-bold px-3 py-1 rounded-[10px] shadow-2xs">
                    <TrendingUp size={13} className="text-[#3D5226]" />
                    <span>Tích cực 86%</span>
                  </span>
                </div>
              </div>

              {/* View Mode Toggle: [AI Tóm tắt] vs [Bài gốc 800 từ] */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 bg-[#EFE8DA] p-1 rounded-[8px] border border-[#DDD3C0]">
                  <button
                    type="button"
                    onClick={() => setDemoTab("summary")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-bold transition-all ${
                      demoTab === "summary"
                        ? "bg-white text-[#2B3A1A] shadow-2xs border border-[#DDD3C0]/80"
                        : "text-[#7A7060] hover:text-[#2B3A1A]"
                    }`}
                  >
                    <Zap size={12} className="text-[#7A9B58]" />
                    <span>AI Tóm tắt (30s)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoTab("original")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-bold transition-all ${
                      demoTab === "original"
                        ? "bg-white text-[#2B3A1A] shadow-2xs border border-[#DDD3C0]/80"
                        : "text-[#7A7060] hover:text-[#2B3A1A]"
                    }`}
                  >
                    <FileText size={12} className="text-[#A09888]" />
                    <span>Bản gốc dài (800 từ)</span>
                  </button>
                </div>

                <span className="text-[11px] text-[#8C8272] italic hidden sm:inline">
                  💡 Click hoặc bôi đen từ khóa để tra cứu
                </span>
              </div>

              {/* Dynamic Content Display */}
              {demoTab === "summary" ? (
                <div className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-[10px] border border-[#DDD5C7] shadow-2xs space-y-2.5">
                  <div className="text-[11px] font-bold text-[#2B3A1A] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#7A9B58]" />
                    <span>Trọng tâm tác động tới cổ phiếu:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2B3A1A] leading-relaxed font-sans select-text">
                    Giá quặng sắt toàn cầu hạ nhiệt giúp Hòa Phát tối ưu hóa giá vốn, dự báo biên lợi nhuận{" "}
                    <span
                      className="inline-flex items-center mx-1 px-2.5 py-0.5 bg-[#F5F8F0] hover:bg-[#E8F5E0] border border-[#C8DFB0] rounded-[6px] font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-colors"
                      data-term="ebitda"
                      title="Bôi đen hoặc click để xem giải thích AI"
                    >
                      EBITDA
                    </span>{" "}
                    tăng 38% và duy trì hệ số định giá{" "}
                    <span
                      className="inline-flex items-center mx-1 px-2.5 py-0.5 bg-[#F5F8F0] hover:bg-[#E8F5E0] border border-[#C8DFB0] rounded-[6px] font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-colors"
                      data-term="p/e"
                      title="Bôi đen hoặc click để xem giải thích AI"
                    >
                      P/E
                    </span>{" "}
                    ở mức 12x — định giá hấp dẫn so với nhóm ngành thép.
                  </p>
                </div>
              ) : (
                <div className="bg-white/80 p-4 rounded-[10px] border border-[#DDD5C7] text-xs text-[#7A7060] leading-relaxed space-y-2 font-serif select-text">
                  <p>
                    Theo báo cáo tài chính quý gần nhất, Tập đoàn Hòa Phát ghi nhận doanh thu và lợi nhuận trước thuế tăng trưởng vượt bậc nhờ nhu cầu xây dựng hồi phục và chi phí nguyên liệu đầu vào giảm đáng kể...
                  </p>
                  <p className="italic text-[11px] text-[#A09888]">
                    (Văn bản gốc dài hơn 800 từ chứa nhiều số liệu phức tạp đã được AI rút gọn sang chế độ 30 giây ở trên)
                  </p>
                </div>
              )}

              {/* Term Highlight Quick Ribbon */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-[#7A7060] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle size={12} className="text-[#7A9B58]" />
                  <span>Thử tra nhanh thuật ngữ AI khác:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { term: "roe", label: "ROE" },
                    { term: "nim", label: "NIM" },
                    { term: "margin call", label: "Margin Call" },
                    { term: "cagr", label: "CAGR" },
                    { term: "rsi", label: "RSI" },
                  ].map((item) => (
                    <span
                      key={item.term}
                      data-term={item.term}
                      title={`Click để xem giải thích AI: ${item.label}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#F5F8F0] border border-[#DDD5C7] hover:border-[#7A9B58] rounded-[8px] text-xs font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all duration-150 active:scale-95"
                    >
                      <span className="text-[#D4A03D] text-[10px]">✦</span>
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-4 border-t border-[#E8EDE0] flex items-center justify-between text-xs font-bold text-[#2B3A1A]">
              <span className="text-[#7A7060] font-normal">Trải nghiệm tương tác trực tiếp trên bài báo</span>
              <Link to="/dashboard" className="hover:text-[#3D5226] hover:underline flex items-center gap-1">
                <span>Vào Dashboard phân tích sâu</span>
                <span className="text-[#7A9B58]">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* BENTO CARD 2 (5 COLS): LIVE STOCK WATCHLIST & SENTIMENT RADAR */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* WATCHLIST BOX (XEM CỔ PHIẾU NHANH) */}
            <div className="bg-white/95 rounded-[10px] p-6 border border-[#DDD5C7] shadow-[0_4px_20px_rgba(43,58,26,0.05)] flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-[#2B3A1A] text-sm font-serif">
                      Xem cổ phiếu nhanh
                    </h3>
                    <p className="text-[11px] text-[#7A7060]">
                      Bảng giá thời gian thực cập nhật từ sàn
                    </p>
                  </div>
                  <button
                    onClick={fetchWatchlist}
                    disabled={loadingWatchlist}
                    title="Làm mới giá"
                    className="p-1.5 text-[#7A9B58] hover:text-[#2B3A1A] hover:bg-[#F5F8F0] rounded-[6px] transition border border-[#DDD5C7] disabled:opacity-50"
                  >
                    <RefreshCw
                      size={12}
                      className={loadingWatchlist ? "animate-spin" : ""}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  {watchlist.map((item, idx) => (
                    <Link
                      to="/dashboard"
                      key={idx}
                      className="flex justify-between items-center p-2.5 hover:bg-[#FAF7F0] rounded-[10px] transition-colors group border border-[#F0ECE1] hover:border-[#DDD5C7]"
                    >
                      <div className="flex items-center gap-3">
                        <StockLogo ticker={item.symbol} size="xs" fallback="none" className="rounded-[4px]" />
                        <div>
                          <span className="font-bold text-sm text-[#2B3A1A] font-mono group-hover:text-[#3D5226] transition-colors block leading-tight">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] text-[#A09888]">Niêm yết HOSE</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[#2B3A1A]">
                          {item.value.endsWith('đ') ? item.value : `${item.value}đ`}
                        </div>
                        <div
                          className={`text-[11px] font-mono font-bold flex items-center justify-end ${item.up ? "text-[#3D5226]" : "text-[#C96B54]"}`}
                        >
                          {item.up ? (
                            <TrendingUp size={11} className="mr-0.5 text-[#3D5226]" />
                          ) : (
                            <TrendingDown size={11} className="mr-0.5 text-[#C96B54]" />
                          )}
                          {item.percent}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                <span className="text-[#8C8272]">Danh mục cá nhân hóa</span>
                <Link to="/dashboard" className="text-[#3D5226] font-bold hover:underline transition flex items-center gap-1">
                  <span>Toàn bộ thị trường</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* QUICK MARKET PULSE BANNER */}
            <div className="bg-[#EFE8DA] border border-[#DDD3C0] rounded-[10px] p-4 flex items-center justify-between gap-4 text-xs text-[#2B3A1A] shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#2B3A1A] text-white flex items-center justify-center font-bold text-xs border border-[#4A6330]">
                  AI
                </div>
                <div>
                  <div className="font-bold text-[#2B3A1A]">Khí sắc thị trường hôm nay:</div>
                  <div className="text-[11px] text-[#5A5248]">68% Tích cực · 22% Trung lập · 10% Thận trọng</div>
                </div>
              </div>
              <Link to="/dashboard" className="font-bold text-[#2B3A1A] hover:text-[#3D5226] hover:underline shrink-0">
                Xem tin &rarr;
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Floating animation keyframes for falling items */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes item-fall {
          0% {
            transform: translateY(-90px) rotate(var(--rot-start, 0deg)) translateX(0);
            opacity: 0;
          }
          12% {
            opacity: var(--max-opacity, 0.85);
          }
          88% {
            opacity: var(--max-opacity, 0.85);
          }
          100% {
            transform: translateY(1150px) rotate(var(--rot-end, 180deg)) translateX(var(--drift, 30px));
            opacity: 0;
          }
        }
      `,
        }}
      />
    </section>
  );
};

export default HeroSection;
