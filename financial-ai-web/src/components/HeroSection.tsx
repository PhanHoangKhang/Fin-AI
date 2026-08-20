import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  HelpCircle,
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
    <section
      className="relative pt-28 pb-20 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Ticker bar - Khung đóng bo nhẹ 10px */}
      <div className="container mx-auto px-6 max-w-7xl mb-12">
        <div className="bg-[#EBE4D5]/90 border border-[#DDD4C1] text-[#2B3A1A] py-2 px-4 rounded-[10px] overflow-hidden shadow-2xs">
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

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* CỘT TRÁI: THÔNG ĐIỆP & NÚT THỬ NGAY & BÔI ĐEN THUẬT NGỮ */}
          <div className="lg:col-span-7 space-y-7">
            {/* Tag định danh bo nhẹ 10px */}
            <div className="inline-flex items-center gap-2 select-none px-3 py-1 bg-white/70 rounded-[10px] border border-[#E0DDD6] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#7A9B58] live-dot"></span>
              <span className="text-[#3D5226] text-[11px] font-bold tracking-wider uppercase font-sans">
                Trợ lý Đọc tin & Quản trị Danh mục
              </span>
            </div>

            {/* Tiêu đề chính font Lora thanh lịch */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[54px] text-[#2B3A1A] leading-[1.18] font-serif font-bold tracking-tight"
              style={{ fontFamily: "Lora, serif" }}
            >
              Đọc tin chứng khoán,
              <br />
              <span className="text-[#3D5226]">hiểu ngay tác động</span>
              <br />
              chỉ trong 30 giây.
            </h1>

            {/* Mô tả súc tích, ấm áp */}
            <p className="text-[#5A5248] text-base lg:text-lg leading-relaxed font-sans max-w-xl">
              Nền tảng đơn giản hóa tin tức tài chính dành riêng cho nhà đầu tư mới. 
              Tóm tắt trọng tâm, giải thích thuật ngữ bình dân và cảnh báo biến động danh mục kịp thời.
            </p>

            {/* NÚT THỬ NGAY (BO VIỀN 10PX) */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#3D5226] hover:bg-[#2B3A1A] text-white rounded-[10px] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 group font-sans hover:-translate-y-0.5 active:scale-98"
              >
                <span>Thử ngay</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-5 py-3.5 text-sm font-bold text-[#5A5248] hover:text-[#2B3A1A] hover:bg-white/60 rounded-[10px] transition duration-150 font-sans"
              >
                Xem cách hoạt động
              </a>
            </div>

            {/* BÔI ĐEN TỪ NGỮ CHUYÊN MÔN VÀ GIẢI THÍCH */}
            <div className="pt-4 border-t border-[#E8EDE0]/90 max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#7A9B58] shrink-0" />
                <span className="text-xs font-bold text-[#3D5226] uppercase tracking-wider">
                  Trải nghiệm giải thích thuật ngữ tức thì:
                </span>
              </div>

              <p className="text-xs text-[#6B6355] leading-relaxed mb-3">
                Bôi đen hoặc click trực tiếp vào các từ khóa bên dưới để xem popup AI giải nghĩa:
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { term: "ebitda", label: "EBITDA" },
                  { term: "p/e", label: "Chỉ số P/E" },
                  { term: "roe", label: "ROE" },
                  { term: "nim", label: "NIM" },
                  { term: "margin call", label: "Margin Call" },
                  { term: "cagr", label: "CAGR" },
                ].map((item) => (
                  <span
                    key={item.term}
                    data-term={item.term}
                    title={`Click để xem giải thích AI: ${item.label}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5F8F0] border border-[#DDD8CE] hover:border-[#7A9B58] rounded-[10px] text-xs font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
                  >
                    <span className="text-[#9CB953] text-xs">✦</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Nguồn tin tổng hợp */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#7A7060] font-sans pt-1 flex-wrap">
              <span className="font-semibold text-[#8C8272]">Nguồn chính thống:</span>
              <span className="bg-white/80 px-2.5 py-1 rounded-[6px] border border-[#E8EDE0] text-[#3D372E] font-medium text-[11px]">VnExpress</span>
              <span className="bg-white/80 px-2.5 py-1 rounded-[6px] border border-[#E8EDE0] text-[#3D372E] font-medium text-[11px]">CafeF</span>
              <span className="bg-white/80 px-2.5 py-1 rounded-[6px] border border-[#E8EDE0] text-[#3D372E] font-medium text-[11px]">Vietstock</span>
              <span className="bg-white/80 px-2.5 py-1 rounded-[6px] border border-[#E8EDE0] text-[#3D372E] font-medium text-[11px]">VnEconomy</span>
            </div>
          </div>

          {/* CỘT PHẢI: BẢN TIN MẪU & XEM CỔ PHIẾU NHANH (BO VIỀN 10PX) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* THẺ BẢN TIN MẪU CÓ TỪ NGỮ HIGHLIGHT (BO 10PX) */}
            <div className="bg-[#FAF7F0] text-[#2B3A1A] p-6 rounded-[10px] shadow-[0_4px_20px_rgba(43,58,26,0.05)] border border-[#EBE4D5] relative overflow-hidden">
              {/* Hoạ tiết watermark chìm trang nhã */}
              <img
                src="/LOGO Fin-AI_Gray.svg"
                alt=""
                className="absolute -right-3 -bottom-3 w-40 h-40 object-contain opacity-25 pointer-events-none select-none z-0"
              />

              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <StockLogo
                    ticker="HPG"
                    size="md"
                    alt="Hòa Phát Group"
                    className="border border-[#E0DDD6] shadow-2xs rounded-[6px]"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-[#2B3A1A] text-base leading-snug">
                      Hòa Phát Group (HPG)
                    </h3>
                    <span className="text-xs text-[#7A7060] font-mono">
                      29,550đ (+1.22%)
                    </span>
                  </div>
                </div>
                <span className="bg-[#E8F5E0] text-[#3D5226] border border-[#C8DFB0] text-xs font-bold px-3 py-1 rounded-[10px] flex items-center gap-1 shadow-2xs">
                  <TrendingUp size={12} /> Tích cực 86%
                </span>
              </div>

              {/* Hộp tóm tắt AI (BO 10PX) */}
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-[10px] mb-4 border border-[#E8EDE0] relative z-10">
                <div className="text-[11px] font-bold text-[#3D5226] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>✦ AI Tóm tắt trọng tâm</span>
                </div>
                <p className="text-xs text-[#2B3A1A] leading-relaxed select-text font-sans">
                  Giá quặng sắt thế giới hạ nhiệt giúp HPG cải thiện biên lợi nhuận, kỳ vọng{" "}
                  <span
                    className="inline-flex items-center mx-0.5 px-2 py-0.5 bg-[#F5F8F0] hover:bg-[#E8F5E0] border border-[#C8DFB0] rounded-[6px] font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-colors"
                    data-term="ebitda"
                    title="Click để xem giải thích AI"
                  >
                    EBITDA
                  </span>{" "}
                  tăng trưởng và duy trì chỉ số định giá{" "}
                  <span
                    className="inline-flex items-center mx-0.5 px-2 py-0.5 bg-[#F5F8F0] hover:bg-[#E8F5E0] border border-[#C8DFB0] rounded-[6px] font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-colors"
                    data-term="p/e"
                    title="Click để xem giải thích AI"
                  >
                    P/E
                  </span>{" "}
                  ở mức 12x — hấp dẫn so với trung bình ngành.
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-center text-xs text-[#7A7060] pt-2 border-t border-[#EBE4D5]">
                <span className="italic text-[11px]">
                  💡 Bôi đen bất kỳ chữ nào để tra cứu AI
                </span>
                <Link to="/dashboard" className="text-[#3D5226] font-bold hover:underline">
                  Vào Dashboard &rarr;
                </Link>
              </div>
            </div>

            {/* XEM CỔ PHIẾU NHANH (BO 10PX) */}
            <div className="bg-white rounded-[10px] p-6 border border-[#E8EDE0] shadow-[0_2px_12px_rgba(43,58,26,0.04)]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#2B3A1A] text-sm font-serif">
                    Xem cổ phiếu nhanh
                  </h4>
                  <button
                    onClick={fetchWatchlist}
                    disabled={loadingWatchlist}
                    title="Làm mới giá"
                    className="p-1 text-[#7A9B58] hover:text-[#3D5226] hover:bg-[#F5F8F0] rounded-[6px] transition disabled:opacity-50"
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

              <div className="space-y-2">
                {watchlist.map((item, idx) => (
                  <Link
                    to="/dashboard"
                    key={idx}
                    className="flex justify-between items-center p-2.5 hover:bg-[#FAF7F0] rounded-[10px] transition-colors group border border-transparent hover:border-[#E8EDE0]"
                  >
                    <div className="flex items-center gap-3">
                      <StockLogo ticker={item.symbol} size="xs" fallback="none" className="rounded-[4px]" />
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
                  </Link>
                ))}
              </div>
            </div>

          </div>
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
    </section>
  );
};

export default HeroSection;
