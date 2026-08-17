import React, { useState } from 'react';
import axios from 'axios';
import type { StockInfo } from '../types';

export const StockSearchPage: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError('');
    setStockInfo(null);

    try {
      // React gọi sang Spring Boot (Port 8080)
      const response = await axios.get<StockInfo>(
        `http://localhost:8080/api/v1/stocks/${ticker.trim().toUpperCase()}/info`
      );
      setStockInfo(response.data);
    } catch (err) {
      setError(`Không tìm thấy dữ liệu cho mã cổ phiếu "${ticker.toUpperCase()}"`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]/50 p-6 md:p-10 text-[#2B3A1A] font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#2B3A1A]" style={{ fontFamily: 'Lora, serif' }}>
            Tra cứu thông tin Cổ phiếu
          </h1>
          <p className="text-sm text-[#7A7060]">
            Nhập mã chứng khoán (HOSE, HNX, UPCOM) để xem chỉ số tài chính và tổng quan doanh nghiệp.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Nhập mã CP (VD: HPG, VNM, FPT...)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-[#E8EDE0] rounded-xl text-sm placeholder-[#7A7060]/60 text-[#2B3A1A] focus:outline-none focus:border-[#7A9B58] focus:ring-2 focus:ring-[#9CB953]/20 uppercase font-mono font-semibold shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#3D5226] hover:bg-[#2B3A1A] text-white text-sm font-bold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-[#FBF0EE] border border-[#C96B54]/30 rounded-xl text-sm text-[#8B2500]">
            {error}
          </div>
        )}

        {/* Stock Result Card */}
        {stockInfo && (
          <div className="bg-white border border-[#E8EDE0] rounded-2xl p-6 space-y-6 shadow-sm">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0EDE6] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-serif font-bold text-[#2B3A1A]">{stockInfo.ticker}</h2>
                  <span className="text-xs px-2.5 py-0.5 bg-[#E8F5E0] text-[#3D5226] rounded-md font-bold">HOSE / HNX</span>
                </div>
                <p className="text-sm text-[#7A7060] mt-0.5">{stockInfo.companyName}</p>
              </div>

              <div className="text-left md:text-right">
                <div className="text-2xl font-mono font-bold text-[#2B3A1A]">
                  {stockInfo.currentPrice ? stockInfo.currentPrice.toLocaleString('vi-VN') + ' VND' : 'N/A'}
                </div>
                <span className="text-xs text-[#A09888]">Giá thị trường</span>
              </div>
            </div>

            {/* Key Financial Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="p-3.5 bg-[#F8F5F0] rounded-xl border border-[#E8EDE0]">
                <span className="text-xs text-[#7A7060] block mb-1">P/E Ratio</span>
                <span className="font-mono font-bold text-[#2B3A1A]">{stockInfo.peRatio ? stockInfo.peRatio.toFixed(2) : 'N/A'}</span>
              </div>
              <div className="p-3.5 bg-[#F8F5F0] rounded-xl border border-[#E8EDE0]">
                <span className="text-xs text-[#7A7060] block mb-1">P/B Ratio</span>
                <span className="font-mono font-bold text-[#2B3A1A]">{stockInfo.pbRatio ? stockInfo.pbRatio.toFixed(2) : 'N/A'}</span>
              </div>
              <div className="p-3.5 bg-[#F8F5F0] rounded-xl border border-[#E8EDE0]">
                <span className="text-xs text-[#7A7060] block mb-1">Cao nhất 52 tuần</span>
                <span className="font-mono font-bold text-[#3D5226]">{stockInfo.fiftyTwoWeekHigh ? stockInfo.fiftyTwoWeekHigh.toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
              <div className="p-3.5 bg-[#F8F5F0] rounded-xl border border-[#E8EDE0]">
                <span className="text-xs text-[#7A7060] block mb-1">Thấp nhất 52 tuần</span>
                <span className="font-mono font-bold text-[#C96B54]">{stockInfo.fiftyTwoWeekLow ? stockInfo.fiftyTwoWeekLow.toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
            </div>

            {/* Industry & Summary */}
            <div className="space-y-3 pt-2 text-sm text-[#5A5248]">
              <div className="flex gap-4 text-xs font-medium text-[#7A7060]">
                <span>Ngành: <strong className="text-[#2B3A1A]">{stockInfo.industry || 'N/A'}</strong></span>
                <span>•</span>
                <span>Lĩnh vực: <strong className="text-[#2B3A1A]">{stockInfo.sector || 'N/A'}</strong></span>
              </div>

              {stockInfo.summary && (
                <div className="pt-3 border-t border-[#F0EDE6]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A09888] mb-1.5">Tổng quan doanh nghiệp</h4>
                  <p className="leading-relaxed text-xs text-[#5A5248]">{stockInfo.summary}</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default StockSearchPage;