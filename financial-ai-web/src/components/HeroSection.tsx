import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  { symbol: 'VN-Index', value: '1,287.45', change: '+8.32', percent: '+0.65%', up: true },
  { symbol: 'HNX-Index', value: '228.17', change: '+1.45', percent: '+0.64%', up: true },
  { symbol: 'UPCOM', value: '91.24', change: '-0.18', percent: '-0.20%', up: false },
  { symbol: 'HPG', value: '29,300', change: '+350', percent: '+1.21%', up: true },
  { symbol: 'FPT', value: '125,400', change: '+2,600', percent: '+2.12%', up: true },
  { symbol: 'MBB', value: '21,850', change: '-175', percent: '-0.80%', up: false },
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
      {/* Ticker bar */}
      <div className="bg-[#2B3A1A] text-white py-2 overflow-hidden flex whitespace-nowrap text-sm font-sans mb-12 border-y border-[#3D5226]/50 shadow-inner">
        <div className="animate-[ticker_30s_linear_infinite] flex items-center gap-8 ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-semibold text-white/90">{item.symbol}</span>
              <span className="text-white/80 font-mono">{item.value}</span>
              <span className={`flex items-center font-mono text-xs ${item.up ? 'text-[#9CB953]' : 'text-[#C96B54]'}`}>
                {item.up ? <TrendingUp size={13} className="mr-0.5" /> : <TrendingDown size={13} className="mr-0.5" />}
                {item.change} ({item.percent})
              </span>
            </div>
          ))}
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

            {/* Interactive Liquid-Glass Financial Term Highlight Feature Demo */}
            <div className="bg-white/90 border border-[#E8EDE0] rounded-2xl p-4 shadow-sm backdrop-blur-md max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#7A9B58]" />
                <span className="text-xs font-bold text-[#2B3A1A] uppercase tracking-wide">
                  Trải nghiệm giải thích thuật ngữ (Click hoặc Bôi đen):
                </span>
              </div>
              
              <p className="text-xs text-[#5A5248] leading-relaxed mb-3">
                Thử click hoặc bôi đen các thuật ngữ nổi bật dưới đây để xem popup AI giải thích ngay:
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="liquid-glass-highlight text-xs font-mono cursor-pointer" data-term="ebitda" title="Click để xem giải thích EBITDA">
                  ✨ EBITDA
                </span>
                <span className="liquid-glass-highlight text-xs font-mono cursor-pointer" data-term="p/e" title="Click để xem giải thích P/E">
                  ✨ Chỉ số P/E
                </span>
                <span className="liquid-glass-highlight text-xs font-mono cursor-pointer" data-term="roe" title="Click để xem giải thích ROE">
                  ✨ ROE
                </span>
                <span className="liquid-glass-highlight text-xs font-mono cursor-pointer" data-term="nim" title="Click để xem giải thích NIM">
                  ✨ NIM
                </span>
                <span className="liquid-glass-highlight text-xs font-mono cursor-pointer" data-term="margin call" title="Click để xem giải thích Margin Call">
                  ✨ Margin Call
                </span>
                <span className="liquid-glass-highlight text-xs font-mono cursor-pointer" data-term="cagr" title="Click để xem giải thích CAGR">
                  ✨ CAGR
                </span>
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
            {/* Alert Card With Liquid-Glass Highlight inside */}
            <div className="bg-[#2B3A1A] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-[#3D5226]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#3D5226] flex items-center justify-center font-bold text-[#9CB953] shadow-inner">
                    HPG
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base leading-snug">Hòa Phát Group</h3>
                    <span className="text-xs text-[#D8D0C0] font-mono">Giá: 29,300đ (+1.2%)</span>
                  </div>
                </div>
                <span className="bg-[#3D5226] text-[#9CB953] border border-[#9CB953]/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> Tích cực 85%
                </span>
              </div>

              {/* AI Summary Box with Highlighted Term */}
              <div className="bg-[#3D5226]/80 backdrop-blur-sm p-4 rounded-2xl mb-4 border border-[#9CB953]/25 shadow-inner">
                <div className="text-[10px] font-bold text-[#9CB953] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CB953] live-dot"></span>
                  AI TÓM TẮT TRỌNG TÂM CHO F0
                </div>
                <p className="text-xs text-[#F5F0E8] leading-relaxed select-text font-sans">
                  Giá quặng sắt thế giới giảm giúp HPG cải thiện biên lợi nhuận{' '}
                  <span 
                    className="liquid-glass-highlight bg-white/20 text-[#9CB953] border-b-2 border-[#9CB953] px-1.5 py-0.5 rounded cursor-pointer font-bold shadow-sm"
                    data-term="ebitda"
                    title="Bôi đen hoặc click để xem giải thích"
                  >
                    EBITDA
                  </span>{' '}
                  tăng 38% và duy trì định giá{' '}
                  <span 
                    className="liquid-glass-highlight bg-white/20 text-[#9CB953] border-b-2 border-[#9CB953] px-1.5 py-0.5 rounded cursor-pointer font-bold shadow-sm"
                    data-term="p/e"
                    title="Bôi đen hoặc click để xem giải thích"
                  >
                    P/E
                  </span>{' '}
                  ở mức 12× rất hấp dẫn so với trung bình ngành.
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-[#A09888] pt-2 border-t border-[#3D5226]">
                <span className="italic">💡 Bôi đen hoặc click bất kỳ từ nào để tra cứu AI</span>
                <span className="text-[#9CB953] font-bold cursor-pointer hover:underline">Chi tiết &rarr;</span>
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
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-[#E8EDE0] rounded-lg flex items-center justify-center font-bold text-xs text-[#3D5226]">
                        {item.symbol}
                      </div>
                      <span className="font-bold text-xs text-[#2B3A1A]">{item.symbol}</span>
                    </div>
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