import React from "react";
import type { PortfolioItem } from "../../utils/portfolioStorage";

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
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
        Vị thế đang theo dõi ({portfolio.length})
      </span>

      {portfolio.length === 0 ? (
        <p className="text-xs text-slate-400 italic">
          Chưa có mã cổ phiếu nào trong danh mục.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {portfolio.map((item) => (
            <div
              key={item.ticker}
              className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/80 text-slate-800 text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <span className="font-bold tracking-tight">{item.ticker}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 font-medium">
                {item.avgPrice}kđ
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.ticker)}
                className="ml-1 text-slate-400 hover:text-red-600 font-medium transition-colors"
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