import React from "react";
import type { PortfolioItem } from "../../utils/portfolioStorage";
import { StockLogo } from "../StockLogo";

interface PortfolioTagsProps {
  portfolio: PortfolioItem[];
  onRemove: (ticker: string) => void;
}

export const PortfolioTags: React.FC<PortfolioTagsProps> = ({
  portfolio,
  onRemove,
}) => {
  return (
    <div>
      <span className="text-xs font-bold text-[#7A7060] uppercase tracking-wider block mb-3 font-sans">
        Vị thế đang theo dõi ({portfolio.length})
      </span>

      {portfolio.length === 0 ? (
        <p className="text-xs text-[#A09888] italic">
          Chưa có mã cổ phiếu nào trong danh mục.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {portfolio.map((item) => (
            <div
              key={item.ticker}
              className="inline-flex items-center gap-2 bg-transparent border border-[#DDD8CE] hover:border-[#7A9B58] text-[#2B3A1A] text-xs px-3.5 py-1.5 rounded-xl transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-98 select-none"
            >
              <StockLogo ticker={item.ticker} size="xs" />
              <span className="font-bold font-mono tracking-tight text-[#2B3A1A]">{item.ticker}</span>
              <span className="text-[#C8C2B6]">|</span>
              <span className="text-[#5A5248] font-medium font-mono">
                {item.avgPrice}kđ
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.ticker);
                }}
                className="ml-1 text-[#A09888] hover:text-[#C96B54] font-bold transition-colors hover:underline cursor-pointer"
                title={`Xóa ${item.ticker} khỏi danh mục`}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioTags;