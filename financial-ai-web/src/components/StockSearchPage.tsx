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
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Tra cứu thông tin Cổ phiếu
          </h1>
          <p className="text-sm text-slate-500">
            Nhập mã chứng khoán (HOSE, HNX) để xem chỉ số tài chính và tổng quan doanh nghiệp.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Nhập mã CP (VD: HPG, VNM, FPT...)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stock Result Card */}
        {stockInfo && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{stockInfo.ticker}</h2>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">HOSE</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{stockInfo.companyName}</p>
              </div>

              <div className="text-left md:text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {stockInfo.currentPrice ? stockInfo.currentPrice.toLocaleString('vi-VN') + ' VND' : 'N/A'}
                </div>
                <span className="text-xs text-slate-400">Giá thị trường</span>
              </div>
            </div>

            {/* Key Financial Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">P/E Ratio</span>
                <span className="font-semibold text-slate-800">{stockInfo.peRatio ? stockInfo.peRatio.toFixed(2) : 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">P/B Ratio</span>
                <span className="font-semibold text-slate-800">{stockInfo.pbRatio ? stockInfo.pbRatio.toFixed(2) : 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Cao nhất 52 tuần</span>
                <span className="font-semibold text-slate-800">{stockInfo.fiftyTwoWeekHigh ? stockInfo.fiftyTwoWeekHigh.toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Thấp nhất 52 tuần</span>
                <span className="font-semibold text-slate-800">{stockInfo.fiftyTwoWeekLow ? stockInfo.fiftyTwoWeekLow.toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
            </div>

            {/* Industry & Summary */}
            <div className="space-y-3 pt-2 text-sm text-slate-600">
              <div className="flex gap-4 text-xs font-medium text-slate-500">
                <span>Ngành: <strong className="text-slate-800">{stockInfo.industry || 'N/A'}</strong></span>
                <span>•</span>
                <span>Lĩnh vực: <strong className="text-slate-800">{stockInfo.sector || 'N/A'}</strong></span>
              </div>

              {stockInfo.summary && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Tổng quan doanh nghiệp</h4>
                  <p className="leading-relaxed text-xs text-slate-600">{stockInfo.summary}</p>
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