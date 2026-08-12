import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [tickerInput, setTickerInput] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      console.log('Searching ticker:', tickerInput);
    }
  };

  return (
    <section className="w-full px-8 md:px-16 lg:px-24 pt-25 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Left Content */}
      <div className="lg:col-span-7 space-y-8">
        <h1 className="text-5xl lg:text-[64px] font-semibold text-slate-900 leading-[1.1] tracking-[-0.035em]">
            Đọc tin chứng khoán,<br />
            hiểu ngay tác động<br />
            chỉ trong 30 giây.
        </h1>
        <p className="text-slate-500 text-base lg:text-lg max-w-xl leading-relaxed font-normal">
            Nền tảng AI đơn giản hóa tin tức tài chính dành riêng cho người mới. Loại bỏ tin đồn, giải thích thuật ngữ bình dân và cảnh báo danh mục tự động.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl bg-white p-2.5 rounded-full border border-slate-200 shadow-lg shadow-slate-100">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            value={tickerInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTickerInput(e.target.value)}
            placeholder="Nhập mã cổ phiếu (VD: HPG, FPT)..." 
            className="w-full text-base outline-none text-slate-700 font-medium placeholder:text-slate-400"
          />
          <button 
            type="submit"
            className="bg-cyan-800 hover:bg-cyan-900 text-white px-8 py-3.5 rounded-full text-sm font-bold whitespace-nowrap transition shadow-sm"
          >
            Tra cứu AI
          </button>
        </form>

        {/* Partners */}
        <div className="pt-4 flex items-center gap-10 text-slate-400 text-sm font-bold tracking-wider">
          <span>CAFEF</span>
          <span>VIETSTOCK</span>
          <span>VNECONOMY</span>
        </div>
      </div>

      {/* Right Mockup Display */}
      <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
        {/* Main Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center font-bold text-cyan-800 text-lg">
                HPG
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">Hòa Phát Group</h4>
                <span className="text-xs text-slate-400 font-medium">Giá: 28,500đ (+2.1%)</span>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Tích cực 85%
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl text-xs text-slate-600 leading-relaxed space-y-2 border border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>AI Tóm Tắt cho F0</span>
            </div>
            <p className="font-medium text-slate-600">
              Giá quặng sắt thế giới giảm giúp HPG tiết kiệm chi phí sản xuất. Đây là tin TỐT cho lợi nhuận Q3.
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Nguồn: 5 bài báo chính thống</span>
            <button className="text-cyan-800 font-bold text-xs hover:underline flex items-center gap-1">
              Chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Overlay Card */}
        <div className="absolute -top-6 -right-2 bg-cyan-900 text-white p-5 rounded-2xl shadow-2xl w-56 text-xs space-y-2 border border-cyan-800">
          <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
            <ShieldAlert className="w-4 h-4" />
            <span>Alert Cảnh Báo</span>
          </div>
          <div className="font-bold text-base">Cổ phiếu HPG</div>
          <div className="text-emerald-400 font-extrabold text-sm">+12% Tỷ trọng đề xuất</div>
        </div>
      </div>
    </section>
  );
};