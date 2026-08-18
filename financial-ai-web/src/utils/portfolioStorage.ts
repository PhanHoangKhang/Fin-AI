export interface PortfolioItem {
  ticker: string;
  avgPrice: number;
}

const PORTFOLIO_KEY = 'user_portfolio';

// Danh mục mặc định nếu chưa có trong localStorage
const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { ticker: 'HPG', avgPrice: 25.5 },
  { ticker: 'FPT', avgPrice: 115.0 },
  { ticker: 'VNM', avgPrice: 68.0 },
];

export const getPortfolio = (): PortfolioItem[] => {
  const data = localStorage.getItem(PORTFOLIO_KEY);
  if (!data) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
    return DEFAULT_PORTFOLIO;
  }
  try {
    return JSON.parse(data) as PortfolioItem[];
  } catch (error) {
    console.error('Lỗi parse JSON từ localStorage:', error);
    return DEFAULT_PORTFOLIO;
  }
};

export const addTicker = (ticker: string, avgPrice: number): PortfolioItem[] => {
  const current = getPortfolio();
  const upperTicker = ticker.trim().toUpperCase();

  // Tránh trùng lặp mã cổ phiếu
  if (current.some((item) => item.ticker === upperTicker)) {
    return current;
  }

  const updated = [...current, { ticker: upperTicker, avgPrice }];
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updated));
  return updated;
};

export const removeTicker = (tickerToRemove: string): PortfolioItem[] => {
  const current = getPortfolio();
  const updated = current.filter((item) => item.ticker !== tickerToRemove);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updated));
  return updated;
};