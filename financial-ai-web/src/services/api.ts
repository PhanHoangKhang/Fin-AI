const BASE_URL = 'http://localhost:8080/api/v1';

// Hàm helper fetch chung
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Định nghĩa các hàm gọi API cho News
export const newsService = {
  // Lấy danh sách tin tức feed
  getFeed: () => fetchAPI<any[]>('/news/feed'),

  // Lấy chi tiết 1 bài viết theo ID (Dùng chung fetchAPI)
  getById: (id: string) => fetchAPI<any>(`/news/${encodeURIComponent(id)}`),
};

export interface TickerData {
  symbol: string;
  value: string;
  change: string;
  percent: string;
  up: boolean;
}

export interface StockInfo {
  ticker: string;
  companyName?: string;
  industry?: string;
  sector?: string;
  currentPrice?: number;
  marketCap?: number;
  peRatio?: number;
  pbRatio?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  summary?: string;
}

// Định nghĩa các hàm gọi API cho Stock (Realtime & Company Info)
export const stockService = {
  // Lấy danh sách realtime ticker từ backend (ưu tiên Spring Boot, fallback trực tiếp Python service)
  getTickerList: async (tickers: string = 'HPG,MBB,FPT,VNM,VIC,VHM,VCB'): Promise<TickerData[]> => {
    try {
      // 1. Thử gọi qua Spring Boot API
      return await fetchAPI<TickerData[]>(`/stocks/ticker-list?tickers=${encodeURIComponent(tickers)}`);
    } catch {
      try {
        // 2. Fallback gọi trực tiếp Python Stock Service
        const res = await fetch(`http://localhost:8001/api/stock/ticker-list?tickers=${encodeURIComponent(tickers)}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Không thể kết nối Python Stock Service:', err);
      }
      return [];
    }
  },

  // Lấy chi tiết thông tin công ty và giá hiện tại
  getStockInfo: async (ticker: string): Promise<StockInfo | null> => {
    try {
      return await fetchAPI<StockInfo>(`/stocks/${encodeURIComponent(ticker)}/info`);
    } catch {
      try {
        const res = await fetch(`http://localhost:8001/api/stock/info/${encodeURIComponent(ticker)}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Lỗi lấy thông tin cổ phiếu:', err);
      }
      return null;
    }
  },

  // Lấy lịch sử giá
  getStockPrice: async (ticker: string): Promise<any[]> => {
    try {
      return await fetchAPI<any[]>(`/stocks/${encodeURIComponent(ticker)}/price`);
    } catch {
      try {
        const res = await fetch(`http://localhost:8001/api/stock/price/${encodeURIComponent(ticker)}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Lỗi lấy lịch sử giá:', err);
      }
      return [];
    }
  },
};