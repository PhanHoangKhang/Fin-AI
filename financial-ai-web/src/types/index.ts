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
  id: string;
  ticker: string;
  title: string;
  link: string;
  source: string;
  publishedDate: string;
  sentimentType: string;
  sentimentScore: number;
  aiSummary: string;
  keywords: string[];
  // Trường mở rộng cho Detail Page (optional)
  marketContext?: string;
  recommendation?: string;
}