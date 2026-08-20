function normalizeApiUrl(url: string | undefined, defaultUrl: string, defaultPath: string): string {
  if (!url || !url.trim()) return defaultUrl;
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  // Nếu người dùng nhập URL gốc không có path (vd: https://finai-backend.onrender.com)
  if (!cleaned.endsWith(defaultPath) && !cleaned.includes('/api/')) {
    cleaned = `${cleaned}${defaultPath}`;
  }
  return cleaned;
}

export const BASE_URL = normalizeApiUrl(import.meta.env.VITE_API_URL, 'http://localhost:8080/api/v1', '/api/v1');
export const STOCK_SERVICE_URL = normalizeApiUrl(import.meta.env.VITE_STOCK_SERVICE_URL, 'http://localhost:8001/api/stock', '/api/stock');

// Hàm helper fetch chung
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
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

// Định nghĩa các hàm gọi API cho Từ điển
export const glossaryService = {
  getAll: () => fetchAPI<any[]>('/glossary'),
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
        const res = await fetch(`${STOCK_SERVICE_URL}/ticker-list?tickers=${encodeURIComponent(tickers)}`);
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
        const res = await fetch(`${STOCK_SERVICE_URL}/info/${encodeURIComponent(ticker)}`);
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
        const res = await fetch(`${STOCK_SERVICE_URL}/price/${encodeURIComponent(ticker)}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Lỗi lấy lịch sử giá cổ phiếu:', err);
      }
      return [];
    }
  },
};