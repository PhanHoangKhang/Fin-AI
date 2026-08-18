import React from "react";
import type { PortfolioAlertDto } from "../../types/index";

interface AlertListProps {
  alerts: PortfolioAlertDto[];
  loading: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, loading }) => {
  if (loading) {
    return (
      <div className="text-sm text-slate-400 py-8 text-center">
        Đang tải dữ liệu cảnh báo...
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-sm text-slate-400 py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
        Không có cảnh báo phù hợp với danh mục hiện tại.
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
            className={`p-5 bg-white border rounded-xl shadow-sm transition-all ${
              isNegative ? "border-l-4 border-l-red-500 border-slate-200" : "border-l-4 border-l-emerald-600 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isNegative ? "text-red-600" : "text-emerald-700"
                }`}
              >
                [{alert.ticker}] — {isNegative ? "Cảnh báo rủi ro" : "Tín hiệu tích cực"}
              </span>
              <span className="text-xs text-slate-400">{alert.publishedDate}</span>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">
              {alert.title}
            </h3>

            <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
              {alert.summary}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Khuyến nghị: </span>
              {alert.suggestedAction}
            </div>
          </div>
        );
      })}
    </div>
  );
};