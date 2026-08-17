import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/api';
import type { NewsItem } from '../../types';
import { NewsCard } from '../../components/NewsCard';
import { NewsSkeleton } from '../../components/NewsSkeleton';

const SOURCES = ['Tất cả', 'CAFEF', 'VIETSTOCK', 'VNECONOMY', 'NDH'];

const WATCHLIST = [
  { t: 'HPG', name: 'Hòa Phát Group', price: '29,300', ch: '+1.2%', up: true },
  { t: 'MBB', name: 'MB Bank', price: '21,850', ch: '-0.8%', up: false },
  { t: 'FPT', name: 'FPT Corporation', price: '125,400', ch: '+2.1%', up: true },
  { t: 'VNM', name: 'Vinamilk', price: '72,100', ch: '-0.5%', up: false },
  { t: 'VIC', name: 'Vingroup', price: '44,200', ch: '-1.2%', up: false },
  { t: 'VHM', name: 'Vinhomes', price: '38,700', ch: '+0.8%', up: true },
];

export const OverviewPage: React.FC = () => {
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState('Tất cả');

  const loadNews = async () => {
    setLoading(true);
    try {
      const feed = await newsService.getFeed();
      setNewsFeed(feed || []);
    } catch (error) {
      console.error('Error loading news from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const filteredNews = activeSource === 'Tất cả' 
    ? newsFeed 
    : newsFeed.filter(n => n.source?.toUpperCase() === activeSource.toUpperCase());

  return (
    <div className="pb-10 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B3A1A] mb-1" style={{ fontFamily: 'Lora, serif' }}>
            Bản tin thị trường AI
          </h1>
          <p className="text-sm text-[#7A7060]">
            Tổng hợp realtime từ RSS & Phân tích tác động bằng Trí tuệ nhân tạo.
          </p>
        </div>

        <button 
          type="button"
          onClick={loadNews}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#E8EDE0] px-4 py-2 rounded-xl text-xs font-bold text-[#2B3A1A] hover:bg-[#F5F8F0] hover:text-[#3D5226] transition shadow-sm disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#3D5226]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? 'Đang cập nhật...' : 'Làm mới feed'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left Column - News Feed */}
        <div className="flex flex-col gap-6">
          {/* Source Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SOURCES.map(src => (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                  activeSource === src 
                    ? 'bg-[#3D5226] text-white border-[#3D5226] shadow-sm' 
                    : 'bg-white text-[#5A5248] border-[#E8EDE0] hover:border-[#9CB953] hover:text-[#2B3A1A]'
                }`}
              >
                {src}
              </button>
            ))}
            <span className="text-[11px] text-[#A09888] ml-auto whitespace-nowrap hidden sm:inline">
              {filteredNews.length} bản tin
            </span>
          </div>

          {/* News List */}
          {loading ? (
            <NewsSkeleton />
          ) : filteredNews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredNews.map((news, index) => {
                // Bài từ thứ 3 trở đi (index >= 2) sẽ bị mờ và hiển thị form đăng ký/đăng nhập
                const isLocked = index >= 2;
                
                if (isLocked) {
                  return (
                    <div key={news.id} className="relative rounded-2xl overflow-hidden group">
                      {/* Blurred Card Content */}
                      <div className="blur-[6px] pointer-events-none select-none opacity-60">
                        <NewsCard news={news} />
                      </div>
                      
                      {/* Paywall Overlay */}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] p-6 text-center border border-[#E8EDE0] rounded-2xl">
                        <div className="w-12 h-12 bg-[#E8F5E0] border border-[#C8DFB0] rounded-full flex items-center justify-center shadow-sm mb-3 text-[#3D5226]">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="font-serif font-bold text-[#2B3A1A] mb-1.5 text-lg">
                          Đăng ký / Đăng nhập để xem đầy đủ
                        </h3>
                        <p className="text-xs text-[#7A7060] mb-5 max-w-sm leading-relaxed">
                          Tạo tài khoản miễn phí để mở khóa toàn bộ bài báo, nhận phân tích AI chuyên sâu và cảnh báo danh mục cá nhân hóa.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button className="px-5 py-2.5 bg-[#3D5226] hover:bg-[#2B3A1A] text-white rounded-full font-bold text-xs transition-all shadow-md hover:-translate-y-px">
                            Đăng ký miễn phí
                          </button>
                          <button className="px-5 py-2.5 bg-white border border-[#3D5226] text-[#3D5226] hover:bg-[#F5F8F0] rounded-full font-bold text-xs transition-all">
                            Đăng nhập
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return <NewsCard key={news.id} news={news} />;
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#E8EDE0] shadow-sm">
              <div className="w-16 h-16 mx-auto bg-[#F5F8F0] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#9CB953]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#2B3A1A] mb-1">Không có tin tức nào</h3>
              <p className="text-[#7A7060] text-xs">Chưa có bản tin nào từ nguồn "{activeSource}". Vui lòng nhấn "Làm mới feed" để cập nhật.</p>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-4 sticky top-20">
          
          {/* Watchlist Card */}
          <div className="bg-white rounded-2xl border border-[#E8EDE0] overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 border-b border-[#F0EDE6] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#2B3A1A] mb-0.5">Bảng giá thời gian thực</h3>
                <p className="text-[10px] text-[#A09888]">HOSE · HNX · UPCOM</p>
              </div>
              <span className="text-[10px] font-bold text-[#3D5226] bg-[#E8F5E0] px-2 py-0.5 rounded-full">
                Realtime
              </span>
            </div>
            {WATCHLIST.map(stock => (
              <div key={stock.t} className="flex items-center justify-between px-4 py-3 border-b border-[#F8F5F0] last:border-b-0 hover:bg-[#FAFAF7] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-bold transition-colors ${stock.up ? 'bg-[#E8F5E0] text-[#3D5226] group-hover:bg-[#D4ECC0]' : 'bg-[#FBF0EE] text-[#C96B54] group-hover:bg-[#F5E0DC]'}`}>
                    {stock.t}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#2B3A1A]">{stock.t}</div>
                    <div className="text-[10px] text-[#A09888]">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#2B3A1A]">{stock.price}</div>
                  <div className={`text-[10px] font-mono font-bold ${stock.up ? 'text-[#3D5226]' : 'text-[#C96B54]'}`}>{stock.ch}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Tip Card */}
          <div className="bg-[#2B3A1A] rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#9CB953] rounded-full flex items-center justify-center">
                <span className="text-[9px] text-[#2B3A1A] font-bold">AI</span>
              </div>
              <span className="text-[11px] font-bold text-[#9CB953] uppercase tracking-widest">Mẹo hôm nay</span>
            </div>
            <p className="text-[12px] text-[#D8D0C0] leading-relaxed mb-3">
              Bôi đen bất kỳ từ ngữ tài chính nào trong bài báo để nhận giải thích tức thì từ AI — không cần tìm Google.
            </p>
            <div className="bg-[#3D5226] rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-[11px] text-[#9CB953] font-mono">Thử với: "EBITDA", "NIM", "P/E"</span>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-2xl border border-[#E8EDE0] p-4 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-[#A09888] uppercase mb-3">Cộng đồng FinAI</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: '5k+', l: 'Nhà đầu tư' },
                { v: '120+', l: 'Bản tin/ngày' },
                { v: '98%', l: 'Độ chính xác AI' },
                { v: '4.8★', l: 'Đánh giá' },
              ].map(s => (
                <div key={s.l} className="bg-[#F8F5F0] rounded-xl p-3">
                  <div className="font-serif text-lg font-bold text-[#3D5226]">{s.v}</div>
                  <div className="text-[10px] text-[#7A7060]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default OverviewPage;