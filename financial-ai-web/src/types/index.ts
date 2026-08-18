export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface StepItem {
  num: string;
  title: string;
  desc: string;
}

export interface MockTickerCard {
  symbol: string;
  name: string;
  price: string;
  change: string;
  sentimentText: string;
  aiSummary: string;
}

export interface NewsItem {
  // 1. Thông tin cơ bản bài báo
  id: string;
  ticker: string;
  title: string;
  link: string;
  source: string;
  publishedDate: string;

  // 2. Điểm số & Tóm tắt AI
  sentimentType: string;       // "POSITIVE" | "NEGATIVE" | "NEUTRAL"
  sentimentScore: number;      // 0 - 100
  aiSummary: string;
  marketContext?: string;

  // 3. Phân tích Chuyên sâu (AI Deep Analysis & Reasoning)
  reasoning?: string;          // 💡 Giải thích VÌ SAO AI đưa ra kết luận
  catalystAnalysis?: string;   // 🚀 Các động lực tăng giá chính
  riskAnalysis?: string;       // 🛡️ Các yếu tố rủi ro cần quản trị
  macroImpact?: string;        // 🌐 Tác động Vĩ mô / Ngành / Tỷ giá / Lãi suất

  // 4. Khuyến nghị & Định giá (Target Price & Valuation)
  investorAction?: string;     // Khuyến nghị tổng quan
  entryZone?: string;          // Vùng giá mua khuyến nghị (VD: "38.5 - 40.0")
  targetPrice?: string;        // Giá mục tiêu kỳ vọng (VD: "48.5 (+22%)")
  stopLossZone?: string;       // Mức cắt lỗ quản trị rủi ro (VD: "< 36.8")

  // 5. Chi tiết Chiến lược Đầu tư 3 Tầng
  shortTermStrategy?: string;  // Chiến lược lướt sóng ngắn hạn (T+)
  mediumTermStrategy?: string; // Chiến lược trung hạn (3 - 6 tháng)
  longTermStrategy?: string;   // Chiến lược dài hạn (1 - 3 năm)

  // 6. Dữ liệu cho Bộ 4 Biểu Đồ Insight (MultiInsightCharts)
  radarMetrics?: Record<string, number>;       // Chart 1: Sức mạnh 360° (VD: Định giá, EPS, Dòng tiền...)
  timelineGrowthData?: Record<string, number>; // Chart 2: Dự báo xung lực tăng trưởng theo quý (Q1-Q4)
  sentimentBreakdown?: Record<string, number>; // Chart 3: Cơ cấu tâm lý thị trường (Tích cực, Tiêu cực, Trung tính)
  technicalSignals?: Record<string, number>;   // Chart 4: Chỉ số Dòng tiền & Kỹ thuật (RSI, MACD, Khối ngoại...)

  // 7. Trường cũ (đã deprecated hoặc dùng fallback)
  chartData?: Record<string, number>;          // Dữ liệu biểu đồ đơn giản cũ
  recommendation?: string;
  impactAnalysis?: string;

  // 8. Tags & Sự kiện
  keyEvents?: string[];
  keywords?: string[];
}

export interface Term {
  id: string;
  term: string;
  fullName: string;
  category: string;
  categoryName?: string;
  shortDefinition: string;
  fullDefinition: string;
  example?: string;
  firstLetter: string;
}

export interface CategoryOption {
  key: string;
  label: string;
}

export interface StockInfo {
  ticker: string;
  companyName: string;
  industry: string;
  sector: string;
  currentPrice: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  summary: string;
  searchKeyword: string
}

export interface PortfolioAlertDto {
  alertId: string;
  ticker: string;
  alertType: 'NEGATIVE_RISK' | 'POSITIVE_OPPORTUNITY';
  title: string;
  summary: string;
  link: string;
  publishedDate: string;
  avgPrice: number;
  currentPrice: number;
  profitLossPct: number;
  suggestedAction: string;
}
