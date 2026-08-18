import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  { symbol: 'HPG', value: '29,550', change: '+350', percent: '+1.22%', up: true },
  { symbol: 'VN-Index', value: '1,262.45', change: '+4.02', percent: '+0.32%', up: true },
  { symbol: 'MBB', value: '21,150', change: '-25', percent: '-0.12%', up: false },
  { symbol: 'FPT', value: '125,200', change: '+450', percent: '+0.36%', up: true },
  { symbol: 'VCB', value: '92,600', change: '+600', percent: '+0.65%', up: true },
  { symbol: 'VIC', value: '44,800', change: '+200', percent: '+0.45%', up: true },
  { symbol: 'HNX-Index', value: '228.17', change: '+1.45', percent: '+0.64%', up: true },
  { symbol: 'UPCOM', value: '91.24', change: '-0.18', percent: '-0.20%', up: false },
];

const WATCHLIST = [
  { symbol: 'HPG', value: '29,300', percent: '+1.2%', up: true },
  { symbol: 'MBB', value: '21,850', percent: '-0.8%', up: false },
  { symbol: 'FPT', value: '125,400', percent: '+2.1%', up: true },
  { symbol: 'VNM', value: '72,100', percent: '-0.5%', up: false },
];

export const HeroSection = () => {
  const [tickerInput, setTickerInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      window.location.href = `/dashboard?ticker=${encodeURIComponent(tickerInput.trim())}`;
    }
  };

  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Ticker bar - Khung đóng tách biệt màu be đậm */}
      <div className="container mx-auto px-6 max-w-7xl mb-12">
        <div className="bg-[#EBE4D5] border border-[#DDD4C1] text-[#2B3A1A] py-2.5 px-4 rounded-2xl overflow-hidden shadow-2xs">
          <div className="animate-[ticker_32s_linear_infinite] flex items-center gap-10 whitespace-nowrap text-xs font-sans ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-2 font-mono">
                <span className="font-bold text-[#3D5226] uppercase">{item.symbol}</span>
                <span className="font-semibold text-[#2B3A1A]">{item.value}</span>
                <span className={`flex items-center font-bold text-[11px] ${item.up ? 'text-[#4D6E28]' : 'text-[#C96B54]'}`}>
                  {item.percent}
                  {item.up ? (
                    <TrendingUp size={12} className="ml-1 text-[#4D6E28]" />
                  ) : (
                    <TrendingDown size={12} className="ml-1 text-[#C96B54]" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E0] border border-[#C8DFB0] px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#9CB953] live-dot"></span>
              <span className="text-[#3D5226] text-xs font-extrabold tracking-wider uppercase font-sans">NỀN TẢNG AI CHỨNG KHOÁN</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] text-[#2B3A1A] leading-[1.15] font-serif font-bold tracking-tight" style={{ fontFamily: 'Lora, serif' }}>
              Đọc tin chứng khoán,<br />
              <span className="text-[#3D5226]">hiểu ngay tác động</span><br />
              chỉ trong 30 giây.
            </h1>
            
            <p className="text-[#5A5248] text-base lg:text-lg leading-relaxed font-sans max-w-xl">
              Nền tảng AI đơn giản hóa tin tức tài chính dành riêng cho người mới. Loại bỏ tin đồn, giải thích thuật ngữ bình dân và cảnh báo danh mục tự động.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex max-w-md gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value)}
                  placeholder="Nhập mã cổ phiếu (VD: HPG, FPT)..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E8EDE0] rounded-full text-sm placeholder-[#7A7060]/60 text-[#2B3A1A] focus:outline-none focus:border-[#7A9B58] focus:ring-2 focus:ring-[#9CB953]/20 shadow-sm font-sans"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7060]" size={18} />
              </div>
              <button
                type="submit"
                className="bg-[#3D5226] text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-[#2B3A1A] transition-all hover:shadow-lg hover:-translate-y-px whitespace-nowrap font-sans"
              >
                Tra cứu AI
              </button>
            </form>

            {/* Interactive Financial Term Highlight Feature Demo */}
            <div className="bg-[#FAF8F5] border border-[#E8E1D5] rounded-3xl p-5 shadow-2xs max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#7A9B58] shrink-0" />
                <span className="text-xs font-bold text-[#3D5226] uppercase tracking-wider">
                  TRẢI NGHIỆM GIẢI THÍCH THUẬT NGỮ (CLICK HOẶC BÔI ĐEN):
                </span>
              </div>
              
              <p className="text-xs text-[#6B6355] leading-relaxed mb-4">
                Thử click hoặc bôi đen các thuật ngữ khó hiểu để xem popup AI giải thích ngay:
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { term: 'ebitda', label: 'EBITDA' },
                  { term: 'p/e', label: 'Chỉ số P/E' },
                  { term: 'roe', label: 'ROE' },
                  { term: 'nim', label: 'NIM' },
                  { term: 'margin call', label: 'Margin Call' },
                  { term: 'cagr', label: 'CAGR' },
                ].map((item) => (
                  <span
                    key={item.term}
                    data-term={item.term}
                    title={`Click để xem giải thích AI: ${item.label}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F2EC] hover:bg-[#EAE4D7] border border-[#E2DDD3] hover:border-[#D0C7B8] rounded-xl text-xs font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all hover:-translate-y-px active:scale-95"
                  >
                    <span className="text-[#D4A03D] text-[13px] leading-none">✨</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="flex items-center gap-4 text-xs font-semibold text-[#7A7060] font-sans pt-2">
              <span className="uppercase tracking-wider text-[#A09888]">Tổng hợp từ:</span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">CAFEF</span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">VIETSTOCK</span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">VNECONOMY</span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8EDE0] text-[#5A5248]">NDH</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative space-y-6 lg:pt-2">
            {/* Alert Card With Liquid-Glass Highlight & LOGO Fin-AI_Gray Watermark */}
            <div className="bg-[#FAF7F0] text-[#2B3A1A] p-6 rounded-3xl shadow-md border border-[#EBE4D5] relative overflow-hidden">
              
              {/* Hoạ tiết LOGO Fin-AI_Gray ở góc phải box */}
              <img 
                src="/LOGO Fin-AI_Gray.svg" 
                alt="" 
                className="absolute -right-2 -bottom-2 w-48 h-48 object-contain opacity-35 pointer-events-none select-none z-0"
              />

              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#5C7140] flex items-center justify-center font-bold text-white shadow-xs shrink-0">
                    HPG
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2B3A1A] text-lg leading-snug">Hòa Phát Group</h3>
                    <span className="text-xs text-[#7A7060] font-mono">Giá: 29,550đ (+1.22%)</span>
                  </div>
                </div>
                <span className="bg-transparent border border-[#DDD5C7] text-[#3D5226] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <TrendingUp size={13} className="text-[#3D5226]" /> Tích cực 86%
                </span>
              </div>

              {/* AI Summary Box (Ô chữ nhật nhỏ với hiệu ứng Liquid-Glass trắng trong suốt) */}
              <div className="bg-white/55 backdrop-blur-md p-5 rounded-2xl mb-4 border border-white/80 shadow-[0_4px_20px_rgba(43,58,26,0.04)] relative z-10">
                <div className="text-xs font-bold text-[#3D5226] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C7140] shrink-0" />
                  AI TÓM TẮT TRỌNG TÂM CHO NHÀ ĐẦU TƯ MỚI
                </div>
                <p className="text-xs text-[#2B3A1A] leading-relaxed select-text font-sans">
                  Giá quặng sắt thế giới giảm giúp HPG cải thiện biên lợi nhuận{' '}
                  <span 
                    className="inline-flex items-center mx-1 px-2.5 py-0.5 bg-white/80 hover:bg-white border border-[#D5CFC0]/60 rounded-lg font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all hover:-translate-y-px"
                    data-term="ebitda"
                    title="Bôi đen hoặc click để xem giải thích"
                  >
                    EBITDA
                  </span>{' '}
                  tăng 38% và duy trì định giá{' '}
                  <span 
                    className="inline-flex items-center mx-1 px-2.5 py-0.5 bg-white/80 hover:bg-white border border-[#D5CFC0]/60 rounded-lg font-bold text-[#2B3A1A] cursor-pointer shadow-2xs transition-all hover:-translate-y-px"
                    data-term="p/e"
                    title="Bôi đen hoặc click để xem giải thích"
                  >
                    P/E
                  </span>{' '}
                  ở mức 12x — hấp dẫn so với trung bình ngành.
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-center text-xs text-[#7A7060] pt-2 border-t border-[#EBE4D5]/80">
                <span className="italic">💡 Bối cảnh hoặc click bất kỳ từ nào để tra cứu AI</span>
                <span className="text-[#3D5226] font-bold cursor-pointer hover:underline">Chi tiết &rarr;</span>
              </div>
            </div>

            {/* Watchlist Preview */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8EDE0] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-[#2B3A1A] text-sm">Bảng giá theo dõi nhanh</h4>
                <a href="/dashboard" className="text-xs text-[#7A9B58] font-bold hover:text-[#3D5226] transition">Xem tất cả &rarr;</a>
              </div>
              <div className="space-y-2.5">
                {WATCHLIST.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 hover:bg-[#F5F8F0] rounded-xl transition-colors">
                    <span className="font-bold text-sm text-[#2B3A1A]">{item.symbol}</span>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#2B3A1A]">{item.value}</div>
                      <div className={`text-[11px] font-mono font-bold flex items-center justify-end ${item.up ? 'text-[#3D5226]' : 'text-[#C96B54]'}`}>
                        {item.up ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
                        {item.percent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}} />
    </div>
  );
};

export default HeroSection;