import React from "react";
import type { PortfolioAlertDto } from "../../types/index";
import { StockLogo } from "../StockLogo";

interface AlertListProps {
  alerts: PortfolioAlertDto[];
  loading: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, loading }) => {
  if (loading) {
    return (
      <div className="text-sm text-[#7A7060] py-8 text-center bg-white rounded-2xl border border-[#E8EDE0]">
        Đang tải dữ liệu cảnh báo từ hệ thống AI...
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-sm text-[#7A7060] py-8 text-center bg-white border border-dashed border-[#DDD5C7] rounded-2xl p-6">
        Không có cảnh báo rủi ro nào cho các mã cổ phiếu trong danh mục của bạn lúc này.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const isNegative = alert.alertType === "NEGATIVE_RISK";

        return (
          <div
            key={alert.alertId}
            className={`p-5 bg-white border rounded-2xl shadow-sm transition-all overflow-hidden relative ${
              isNegative ? "border-l-4 border-l-[#C96B54] border-[#E8EDE0]" : "border-l-4 border-l-[#3D5226] border-[#E8EDE0]"
            }`}
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2">
                <StockLogo ticker={alert.ticker} size="xs" />
                <span
                  className={`text-xs font-bold font-mono tracking-wider ${
                    isNegative ? "text-[#C96B54]" : "text-[#3D5226]"
                  }`}
                >
                  [{alert.ticker}] — {isNegative ? "Cảnh báo rủi ro" : "Tín hiệu tích cực"}
                </span>
              </div>
              <span className="text-xs text-[#7A7060]">{alert.publishedDate}</span>
            </div>

            <h3 className="text-base font-serif font-bold text-[#2B3A1A] mb-2 leading-snug">
              {alert.title}
            </h3>

            <p className="text-sm text-[#5A5248] mb-4 line-clamp-3 leading-relaxed">
              {alert.summary}
            </p>

            <div className="p-3 bg-[#F5F8F0] rounded-xl border border-[#E0E8D4] text-xs text-[#3D5226]">
              <span className="font-bold text-[#2B3A1A]">Khuyến nghị AI: </span>
              {alert.suggestedAction}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertList;