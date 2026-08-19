import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { newsService, stockService, type TickerData } from "../../services/api";
import type { NewsItem } from "../../types";
import { NewsCard } from "../../components/NewsCard";
import { NewsSkeleton } from "../../components/NewsSkeleton";
import { StockLogo } from "../../components/StockLogo";
import { getPortfolio } from "../../utils/portfolioStorage";

const SOURCE_FILTERS = [
  { label: "Tất cả", key: "ALL" },
  { label: "VNEXPRESS", key: "VNEXPRESS" },
  { label: "CAFEF", key: "CAFEF" },
  { label: "VIETSTOCK", key: "VIETSTOCK" },
  { label: "VNECONOMY", key: "VNECONOMY" },
];

const detectSourceKey = (source?: string, link?: string): string => {
  const text = `${source || ""} ${link || ""}`.toLowerCase();
  if (text.includes("cafef")) return "CAFEF";
  if (text.includes("vietstock")) return "VIETSTOCK";
  if (text.includes("vneconomy")) return "VNECONOMY";
  if (text.includes("vnexpress")) return "VNEXPRESS";
  return "OTHER";
};

// Đan xen bài viết từ các nguồn khác nhau để tab "Tất cả" hiển thị đa dạng ngay từ đầu
const interleaveNewsSources = (items: NewsItem[]): NewsItem[] => {
  if (!items || items.length === 0) return [];

  const groups: Record<string, NewsItem[]> = {
    VNEXPRESS: [],
    CAFEF: [],
    VIETSTOCK: [],
    VNECONOMY: [],
    OTHER: [],
  };

  items.forEach((item) => {
    const key = detectSourceKey(item.source, item.link);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  const result: NewsItem[] = [];
  const sourceKeys = ["VNEXPRESS", "CAFEF", "VIETSTOCK", "VNECONOMY", "OTHER"];
  const maxLen = Math.max(...Object.values(groups).map((g) => g.length), 0);

  for (let i = 0; i < maxLen; i++) {
    for (const key of sourceKeys) {
      if (i < groups[key].length) {
        result.push(groups[key][i]);
      }
    }
  }

  return result;
};

const STOCK_DETAILS_MAP: Record<
  string,
  { name: string; price: string; ch: string; up: boolean }
> = {
  HPG: { name: "Hòa Phát Group", price: "20,950", ch: "+1.2%", up: true },
  MBB: { name: "MB Bank", price: "24,350", ch: "-0.8%", up: false },
  FPT: { name: "FPT Corporation", price: "131,200", ch: "+2.1%", up: true },
  VNM: { name: "Vinamilk", price: "68,400", ch: "-0.5%", up: false },
  VIC: { name: "Vingroup", price: "42,600", ch: "-1.2%", up: false },
  VHM: { name: "Vinhomes", price: "39,100", ch: "+0.8%", up: true },
  PLX: { name: "Petrolimex", price: "41,500", ch: "+0.5%", up: true },
  VCB: { name: "Vietcombank", price: "92,600", ch: "+0.65%", up: true },
  TCB: { name: "Techcombank", price: "24,300", ch: "+1.4%", up: true },
  SSI: { name: "Chứng khoán SSI", price: "32,500", ch: "-0.3%", up: false },
  MWG: { name: "Thế Giới Di Động", price: "64,200", ch: "+1.8%", up: true },
};

export const OverviewPage: React.FC = () => {
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState("ALL");
  const [portfolioTickers, setPortfolioTickers] = useState<string[]>([]);
  const [realtimeData, setRealtimeData] = useState<Record<string, TickerData>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    try {
      const feed = await newsService.getFeed();
      const interleaved = interleaveNewsSources(feed || []);
      setNewsFeed(interleaved);
    } catch (error) {
      console.error("Error loading news from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimePrices = useCallback(async (tickers: string[]) => {
    if (!tickers || tickers.length === 0) return;
    setLoadingPrices(true);
    try {
      const data = await stockService.getTickerList(tickers.join(","));
      if (data && Array.isArray(data) && data.length > 0) {
        const map: Record<string, TickerData> = {};
        data.forEach((item) => {
          if (item && item.symbol) {
            map[item.symbol.toUpperCase()] = item;
          }
        });
        setRealtimeData((prev) => ({ ...prev, ...map }));
      }
    } catch (err) {
      console.warn("Lỗi khi fetch giá realtime từ backend:", err);
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  const loadData = useCallback(() => {
    loadNews();
    const saved = getPortfolio();
    const tickers =
      saved && saved.length > 0
        ? saved.map((item) => item.ticker.toUpperCase())
        : ["HPG", "MBB", "FPT", "VNM", "VIC", "VHM"];

    setPortfolioTickers(saved && saved.length > 0 ? tickers : []);
    fetchRealtimePrices(tickers);
  }, [fetchRealtimePrices]);

  useEffect(() => {
    loadData();

    // Tự động cập nhật lại giá mỗi 15 giây
    const interval = setInterval(() => {
      const saved = getPortfolio();
      const tickers =
        saved && saved.length > 0
          ? saved.map((item) => item.ticker.toUpperCase())
          : ["HPG", "MBB", "FPT", "VNM", "VIC", "VHM"];
      fetchRealtimePrices(tickers);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadData, fetchRealtimePrices]);

  // Compute watchlist items: priority to user's tracked portfolio stocks with realtime values from backend
  const displayWatchlist = useMemo(() => {
    const targetTickers =
      portfolioTickers.length > 0
        ? portfolioTickers
        : ["HPG", "MBB", "FPT", "VNM", "VIC", "VHM"];

    return targetTickers.map((t) => {
      const known = STOCK_DETAILS_MAP[t];
      const live = realtimeData[t];

      let displayPrice = known?.price ? `${known.price}đ` : "28,500đ";
      let displayPercent = known?.ch || "+0.0%";
      let isUp = known ? known.up : true;

      if (live && live.value && live.value !== "N/A") {
        displayPrice = live.value.endsWith("đ") ? live.value : `${live.value}đ`;
        displayPercent = live.percent || `${live.change}`;
        isUp = live.up;
      }

      return {
        t,
        name: known?.name || `Cổ phiếu ${t}`,
        price: displayPrice,
        ch: displayPercent,
        up: isUp,
      };
    });
  }, [portfolioTickers, realtimeData]);

  // Lọc theo nguồn được chọn
  const filteredNews = useMemo(() => {
    if (activeSource === "ALL") {
      return newsFeed;
    }
    return newsFeed.filter((news) => {
      const key = detectSourceKey(news.source, news.link);
      return key === activeSource;
    });
  }, [activeSource, newsFeed]);

  return (
    <div className="pb-10 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl font-serif font-bold text-[#2B3A1A] mb-1"
            style={{ fontFamily: "Lora, serif" }}
          >
            Bản tin thị trường AI
          </h1>
          <p className="text-sm text-[#7A7060]">
            Tổng hợp realtime từ 4 nguồn báo tài chính hàng đầu & Phân tích tác động bằng AI.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading || loadingPrices}
          className="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#E8EDE0] px-4 py-2 rounded-xl text-xs font-bold text-[#2B3A1A] hover:bg-[#F5F8F0] hover:text-[#3D5226] transition shadow-sm disabled:opacity-50"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading || loadingPrices ? "animate-spin text-[#3D5226]" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>
            {loading || loadingPrices ? "Đang cập nhật..." : "Làm mới feed"}
          </span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left Column - News Feed */}
        <div className="flex flex-col gap-6">
          {/* Source Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SOURCE_FILTERS.map((filter) => {
              const count =
                filter.key === "ALL"
                  ? newsFeed.length
                  : newsFeed.filter((n) => detectSourceKey(n.source, n.link) === filter.key).length;

              const isSelected = activeSource === filter.key;

              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveSource(filter.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#3D5226] text-white border-[#3D5226] shadow-sm"
                      : "bg-white text-[#5A5248] border-[#E8EDE0] hover:border-[#9CB953] hover:text-[#2B3A1A]"
                  }`}
                >
                  <span>{filter.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#F0EDE6] text-[#7A7060]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            <span className="text-[11px] text-[#A09888] ml-auto whitespace-nowrap hidden sm:inline font-mono">
              {filteredNews.length} bản tin
            </span>
          </div>

          {/* News List */}
          {loading ? (
            <NewsSkeleton />
          ) : filteredNews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#E8EDE0] shadow-sm">
              <div className="w-16 h-16 mx-auto bg-[#F5F8F0] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#9CB953]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#2B3A1A] mb-1">
                Không có tin tức nào
              </h3>
              <p className="text-[#7A7060] text-xs">
                Chưa có bản tin nào từ nguồn "{activeSource}". Vui lòng nhấn
                "Làm mới feed" để cập nhật.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-4 sticky top-20">
          {/* Watchlist Card - Hiển thị mã cổ phiếu trong Danh mục với Logo thật & Giá Realtime từ Backend */}
          <div className="bg-white rounded-2xl border border-[#E8EDE0] overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 border-b border-[#F0EDE6] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#2B3A1A] mb-0.5">
                  Bảng giá thời gian thực
                </h3>
                <p className="text-[10px] text-[#A09888]">
                  {portfolioTickers.length > 0
                    ? "Mã trong Danh mục của bạn"
                    : "HOSE · HNX · UPCOM"}
                </p>
              </div>
              <Link
                to="/dashboard/portfolio"
                className="text-[11px] font-bold text-[#2B3A1A] bg-transparent hover:text-[#3D5226] border border-[#DDD8CE] hover:border-[#7A9B58] px-3 py-1 rounded-full transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
                title="Quản lý danh mục theo dõi"
              >
                {portfolioTickers.length > 0
                  ? `${portfolioTickers.length} mã`
                  : "Quản lý"}
              </Link>
            </div>

            <div className="divide-y divide-[#F8F5F0]">
              {displayWatchlist.map((stock) => (
                <div
                  key={stock.t}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAF7] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <StockLogo ticker={stock.t} size="sm" />
                    <div>
                      <div className="text-xs font-bold text-[#2B3A1A] font-mono group-hover:text-[#3D5226] transition-colors">
                        {stock.t}
                      </div>
                      <div className="text-[10px] text-[#7A7060]">
                        {stock.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-[#2B3A1A]">
                      {stock.price}
                    </div>
                    <div
                      className={`text-[10px] font-mono font-bold ${stock.up ? "text-[#3D5226]" : "text-[#C96B54]"}`}
                    >
                      {stock.ch}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tip Card - Nền màu xám nhạt */}
          <div className="bg-[#F2EFE9] rounded-2xl p-4 text-[#2B3A1A] shadow-xs border border-[#DDD8CE] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#3D5226] text-white rounded-full flex items-center justify-center shadow-2xs">
                <span className="text-[9px] font-bold">AI</span>
              </div>
              <span className="text-[11px] font-bold text-[#3D5226] uppercase tracking-widest">
                Mẹo hôm nay
              </span>
            </div>
            <p className="text-[12px] text-[#5A5248] leading-relaxed mb-3">
              Bôi đen bất kỳ từ ngữ tài chính nào trong bài báo để nhận giải
              thích tức thì từ AI — không cần tìm Google.
            </p>
            <div className="bg-white border border-[#E0DDD5] rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs">
              <span className="text-[11px] text-[#3D5226] font-mono font-medium">
                Thử với: "EBITDA", "NIM", "P/E"
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OverviewPage;
