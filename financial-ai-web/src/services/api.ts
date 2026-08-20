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

// Dữ liệu tin tức chất lượng cao dự phòng khi Backend đang khởi động (Cold Start)
export const FALLBACK_NEWS_FEED = [
  {
    id: "hpg-01",
    title: "Giá quặng sắt thế giới giảm 4% - Tác động tích cực đến biên lợi nhuận Hòa Phát (HPG)",
    ticker: "HPG",
    source: "CafeF",
    link: "https://cafef.vn",
    publishedDate: "15 phút trước",
    sentimentType: "POSITIVE",
    sentimentScore: 86,
    aiSummary: "Giá nguyên liệu đầu vào giảm mạnh hỗ trợ mở rộng biên lợi nhuận gộp trong quý 3. Nhu cầu thép xây dựng nội địa có tín hiệu phục hồi nhờ giải ngân đầu tư công.",
    keywords: ["Biên lợi nhuận", "P/E", "Quặng sắt", "Đầu tư công"]
  },
  {
    id: "fpt-02",
    title: "FPT công bố doanh thu chuyển đổi số và AI tăng trưởng 32% so với cùng kỳ",
    ticker: "FPT",
    source: "VnExpress",
    link: "https://vnexpress.net",
    publishedDate: "30 phút trước",
    sentimentType: "POSITIVE",
    sentimentScore: 92,
    aiSummary: "Khối công nghệ và dịch vụ AI đóng góp tỷ trọng lớn vào đà tăng trưởng lợi nhuận. Hợp đồng ký mới tại thị trường Nhật Bản và Mỹ tiếp tục mở rộng quy mô.",
    keywords: ["Chuyển đổi số", "EBITDA", "Doanh thu xuất khẩu"]
  },
  {
    id: "mbb-03",
    title: "MB Bank ghi nhận tăng trưởng tín dụng vượt trội, tỷ lệ CASA duy trì vị thế dẫn đầu",
    ticker: "MBB",
    source: "Vietstock",
    link: "https://vietstock.vn",
    publishedDate: "1 giờ trước",
    sentimentType: "POSITIVE",
    sentimentScore: 84,
    aiSummary: "Chi phí vốn rẻ nhờ nguồn tiền gửi không kỳ hạn (CASA) dồi dào giúp bảo vệ biên lãi thuần (NIM) trong bối cảnh mặt bằng lãi suất cho vay giảm.",
    keywords: ["CASA", "NIM", "Tín dụng", "Nợ xấu"]
  },
  {
    id: "vnm-04",
    title: "Vinamilk đẩy mạnh mở rộng thị trường xuất khẩu và tối ưu hóa hệ thống trang trại xanh",
    ticker: "VNM",
    source: "VnEconomy",
    link: "https://vneconomy.vn",
    publishedDate: "2 giờ trước",
    sentimentType: "NEUTRAL",
    sentimentScore: 68,
    aiSummary: "Thị trường nội địa duy trì ổn định, tăng trưởng đến từ mảng xuất khẩu Trung Đông và châu Á. Giá sữa bột nguyên liệu thế giới đang ở mức ổn định.",
    keywords: ["Thị phần", "Doanh thu", "Cổ tức"]
  },
  {
    id: "vic-05",
    title: "Vingroup đẩy mạnh các dự án hạ tầng công nghiệp và mở rộng hệ sinh thái xe điện",
    ticker: "VIC",
    source: "CafeF",
    link: "https://cafef.vn",
    publishedDate: "3 giờ trước",
    sentimentType: "NEUTRAL",
    sentimentScore: 62,
    aiSummary: "Tập đoàn tiếp tục tái cấu trúc các mảng kinh doanh cốt lõi, tập trung nguồn lực phát triển hạ tầng và mạng lưới trạm sạc toàn quốc.",
    keywords: ["Dòng tiền", "Tái cấu trúc", "Trạm sạc"]
  }
];

// Hàm helper fetch chung có timeout 8s để không treo UI
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Định nghĩa các hàm gọi API cho News
export const newsService = {
  // Lấy danh sách tin tức feed
  getFeed: async (): Promise<any[]> => {
    try {
      const data = await fetchAPI<any[]>('/news/feed');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return FALLBACK_NEWS_FEED;
    } catch (err) {
      console.warn('Backend đang khởi động hoặc chưa phản hồi, sử dụng feed dữ liệu sẵn sàng:', err);
      return FALLBACK_NEWS_FEED;
    }
  },

  // Lấy chi tiết 1 bài viết theo ID (Dùng chung fetchAPI)
  getById: async (id: string): Promise<any> => {
    try {
      return await fetchAPI<any>(`/news/${encodeURIComponent(id)}`);
    } catch (err) {
      console.warn('Fallback chi tiết tin tức từ bộ nhớ đệm:', id);
      const matched = FALLBACK_NEWS_FEED.find((n) => n.id === id);
      if (matched) {
        return {
          id: matched.id,
          title: matched.title,
          ticker: matched.ticker,
          source: matched.source,
          link: matched.link,
          publishedDate: matched.publishedDate,
          sentimentType: matched.sentimentType,
          sentimentScore: matched.sentimentScore,
          aiSummary: matched.aiSummary,
          threeKeyPoints: [
            "Doanh nghiệp duy trì vị thế dẫn đầu trong ngành với hiệu quả kinh doanh tích cực.",
            "Các chỉ số tài chính cơ bản ổn định, dòng tiền kinh doanh duy trì khỏe mạnh.",
            "Tác động tin tức mang tính hỗ trợ tâm lý thị trường trong ngắn và trung hạn."
          ],
          f0Explanation: "Tin tức này mang lại tín hiệu thuận lợi cho nhà đầu tư đang nắm giữ mã cổ phiếu. Tuy nhiên cần theo dõi sát diễn biến khối lượng giao dịch trước khi ra quyết định giải ngân thêm.",
          easyTerms: [
            { term: "Biên lợi nhuận", explanation: "Tỷ lệ phần trăm lợi nhuận thu được trên mỗi đồng doanh nghiệp bán ra." },
            { term: "P/E", explanation: "Số năm cần thiết để thu hồi vốn đầu tư dựa trên mức lợi nhuận hiện tại của công ty." }
          ]
        };
      }
      throw err;
    }
  },
};

// Định nghĩa các hàm gọi API cho Từ điển
export const glossaryService = {
  getAll: async (): Promise<any[]> => {
    try {
      return await fetchAPI<any[]>('/glossary');
    } catch {
      return [];
    }
  },
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