"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { Term, CategoryOption, StockInfo } from '../../types';
import { DictionaryCard } from '../../components/DictionaryCard';
import { DictionaryModal } from '../../components/DictionaryModal';
import { StockLogo } from '../../components/StockLogo';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Mock data thuật ngữ
const MOCK_TERMS: Term[] = [
  {
    id: "rsi",
    term: "RSI",
    fullName: "Relative Strength Index (Chỉ số Sức mạnh Tương đối)",
    category: "PHAN_TICH_KY_THUAT",
    categoryName: "Phân tích kỹ thuật",
    shortDefinition: "Chỉ báo đo lường tốc độ và sự thay đổi của biến động giá trên thang điểm từ 0 đến 100.",
    fullDefinition: "RSI dùng để xác định trạng thái quá mua (Overbought - trên 70) hoặc quá bán (Oversold - dưới 30) của một cổ phiếu.",
    example: "Mã SSI có RSI = 28, cho thấy lực bán quá đà và cổ phiếu bước vào vùng quá bán.",
    firstLetter: "R"
  },
  {
    id: "pe",
    term: "P/E",
    fullName: "Price to Earnings Ratio (Hệ số Giá / Lợi nhuận)",
    category: "CHUNG_KHOAN_CO_BAN",
    categoryName: "Chứng khoán cơ bản",
    shortDefinition: "Đánh giá mối quan hệ giữa giá thị trường của cổ phiếu và lợi nhuận trên một cổ phiếu (EPS).",
    fullDefinition: "Chỉ số P/E thể hiện nhà đầu tư sẵn sàng trả bao nhiêu tiền cho 1 đồng lợi nhuận của doanh nghiệp.",
    example: "HPG có P/E = 8x, thấp hơn trung bình ngành thép là 12x, cho thấy định giá đang tương đối rẻ.",
    firstLetter: "P"
  }
];

const CATEGORIES: CategoryOption[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'CHUNG_KHOAN_CO_BAN', label: 'Chứng khoán cơ bản' },
  { key: 'PHAN_TICH_KY_THUAT', label: 'Phân tích kỹ thuật' },
  { key: 'BAO_CAO_TAI_CHINH', label: 'Báo cáo tài chính' },
  { key: 'VI_MO', label: 'Vĩ mô' }
];

const ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ==========================================
// SUB-COMPONENT: DICTIONARY SEARCH (NHÉT TRỰC TIẾP)
// ==========================================
interface DictionarySearchProps {
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
  categories: CategoryOption[];
  alphabet: string[];
}

const DictionarySearch: React.FC<DictionarySearchProps> = ({
  searchKeyword,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLetter,
  onLetterChange,
  categories,
  alphabet,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nhập thuật ngữ cần tìm (VD: RSI, P/E, cổ tức...)"
          className="w-full px-4 py-2.5 bg-white border border-[#E8EDE0] rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-[#7A9B58] focus:ring-1 focus:ring-[#9CB953]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              selectedCategory === cat.key
                ? 'bg-[#3D5226] text-white'
                : 'bg-white text-slate-600 border border-[#E8EDE0] hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onLetterChange('')}
          className={`px-2 py-1 text-xs rounded font-medium ${
            !selectedLetter ? 'bg-[#3D5226] text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Tất cả
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => onLetterChange(letter === selectedLetter ? '' : letter)}
            className={`px-2 py-1 text-xs rounded font-medium ${
              selectedLetter === letter
                ? 'bg-[#3D5226] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export const DictionaryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'stock'>('dictionary');

  // --- State Thuật ngữ ---
  const [terms, setTerms] = useState<Term[]>([]);
  const [loadingTerms, setLoadingTerms] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  // --- State Cổ phiếu ---
  const [ticker, setTicker] = useState<string>('');
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(false);
  const [stockError, setStockError] = useState<string>('');

  // Fetch danh sách thuật ngữ từ Spring Boot
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoadingTerms(true);
        const response = await axios.get<Term[]>(`${API_BASE_URL}/glossary`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTerms(response.data);
        } else {
          setTerms(MOCK_TERMS);
        }
      } catch (error) {
        setTerms(MOCK_TERMS);
      } finally {
        setLoadingTerms(false);
      }
    };

    fetchTerms();
  }, []);

  // Lọc thuật ngữ
  const filteredTerms = useMemo(() => {
    return terms.filter((item) => {
      const query = searchKeyword.toLowerCase().trim();
      const termMatch = item.term?.toLowerCase().includes(query) ?? false;
      const fullNameMatch = item.fullName?.toLowerCase().includes(query) ?? false;
      const shortDefMatch = item.shortDefinition?.toLowerCase().includes(query) ?? false;

      const matchKeyword = !query || termMatch || fullNameMatch || shortDefMatch;
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      const firstChar = item.firstLetter || item.term?.charAt(0) || '';
      const matchLetter = !selectedLetter || firstChar.toUpperCase() === selectedLetter.toUpperCase();

      return matchKeyword && matchCategory && matchLetter;
    });
  }, [terms, searchKeyword, selectedCategory, selectedLetter]);

  // Handler Tra cứu Cổ phiếu
  const handleStockSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoadingStock(true);
    setStockError('');
    setStockInfo(null);

    try {
      const response = await axios.get<StockInfo>(
        `${API_BASE_URL}/stocks/${ticker.trim().toUpperCase()}/info`
      );
      setStockInfo(response.data);
    } catch (err) {
      setStockError(`Không tìm thấy dữ liệu cho mã cổ phiếu "${ticker.toUpperCase()}"`);
    } finally {
      setLoadingStock(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header chính */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2B3A1A]">
            Trung tâm Tra cứu Tài chính
          </h1>
          <p className="text-sm text-slate-500">
            Tra cứu thuật ngữ chứng khoán và tra cứu thông tin niêm yết của doanh nghiệp.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`pb-3 text-sm font-medium transition relative ${
              activeTab === 'dictionary'
                ? 'text-[#2B3A1A] border-b-2 border-[#3D5226]'
                : 'text-slate-500 hover:text-[#3D5226]'
            }`}
          >
            Từ điển Thuật ngữ
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`pb-3 text-sm font-medium transition relative ${
              activeTab === 'stock'
                ? 'text-[#2B3A1A] border-b-2 border-[#3D5226]'
                : 'text-slate-500 hover:text-[#3D5226]'
            }`}
          >
            Tra cứu Cổ phiếu
          </button>
        </div>

        {/* TAB 1: TỪ ĐIỂN THUẬT NGỮ */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            {/* Nhét trực tiếp component DictionarySearch tại đây */}
            <DictionarySearch
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLetter={selectedLetter}
              onLetterChange={setSelectedLetter}
              categories={CATEGORIES}
              alphabet={ALPHABET}
            />

            {loadingTerms ? (
              <div className="py-20 text-center text-sm text-slate-400">Đang nạp dữ liệu thuật ngữ...</div>
            ) : filteredTerms.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-400">Không tìm thấy thuật ngữ phù hợp.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTerms.map((term) => (
                  <DictionaryCard key={term.id} term={term} onClick={setSelectedTerm} />
                ))}
              </div>
            )}

            <DictionaryModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
          </div>
        )}

        {/* TAB 2: TRA CỨU CỔ PHIẾU */}
        {activeTab === 'stock' && (
          <div className="space-y-6 max-w-4xl">
            <form onSubmit={handleStockSearch} className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Nhập mã CP (VD: HPG, VNM, FPT...)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-[#E8EDE0] rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-[#7A9B58] focus:ring-1 focus:ring-[#9CB953] uppercase"
              />
              <button
                type="submit"
                disabled={loadingStock}
                className="px-4 py-2 bg-[#3D5226] hover:bg-[#2B3A1A] text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {loadingStock ? 'Đang tìm...' : 'Tra cứu'}
              </button>
            </form>

            {stockError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                {stockError}
              </div>
            )}

            {stockInfo && (
              <div className="bg-white border border-[#E8EDE0] rounded-xl p-6 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F8F5F0] pb-4">
                  <div className="flex items-center gap-4">
                    <StockLogo ticker={stockInfo.ticker} size="lg" alt={stockInfo.companyName} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-[#2B3A1A]">{stockInfo.ticker}</h2>
                        <span className="text-xs px-2 py-0.5 bg-[#E8F5E0] text-[#3D5226] rounded font-bold font-mono">HOSE / HNX</span>
                      </div>
                      <p className="text-sm text-[#7A7060] font-medium mt-0.5">{stockInfo.companyName}</p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-2xl font-bold text-[#3D5226] font-mono">
                      {stockInfo.currentPrice ? stockInfo.currentPrice.toLocaleString('vi-VN') + ' VND' : 'N/A'}
                    </div>
                    <span className="text-xs text-[#7A7060] font-medium">Giá thị trường</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-[#F8F5F0] rounded-lg border border-[#E8EDE0]">
                    <span className="text-xs text-slate-400 block mb-1">P/E Ratio</span>
                    <span className="font-semibold text-[#2B3A1A]">{stockInfo.peRatio ? stockInfo.peRatio.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="p-3 bg-[#F8F5F0] rounded-lg border border-[#E8EDE0]">
                    <span className="text-xs text-slate-400 block mb-1">P/B Ratio</span>
                    <span className="font-semibold text-[#2B3A1A]">{stockInfo.pbRatio ? stockInfo.pbRatio.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="p-3 bg-[#F8F5F0] rounded-lg border border-[#E8EDE0]">
                    <span className="text-xs text-slate-400 block mb-1">Cao nhất 52 tuần</span>
                    <span className="font-semibold text-[#2B3A1A]">{stockInfo.fiftyTwoWeekHigh ? stockInfo.fiftyTwoWeekHigh.toLocaleString('vi-VN') : 'N/A'}</span>
                  </div>
                  <div className="p-3 bg-[#F8F5F0] rounded-lg border border-[#E8EDE0]">
                    <span className="text-xs text-slate-400 block mb-1">Thấp nhất 52 tuần</span>
                    <span className="font-semibold text-[#2B3A1A]">{stockInfo.fiftyTwoWeekLow ? stockInfo.fiftyTwoWeekLow.toLocaleString('vi-VN') : 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-sm text-slate-600">
                  <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <span>Ngành: <strong className="text-[#2B3A1A]">{stockInfo.industry || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>Lĩnh vực: <strong className="text-[#2B3A1A]">{stockInfo.sector || 'N/A'}</strong></span>
                  </div>

                  {stockInfo.summary && (
                    <div className="pt-2 border-t border-[#F8F5F0]">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Tổng quan doanh nghiệp</h4>
                      <p className="leading-relaxed text-xs text-slate-600">{stockInfo.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DictionaryPage;