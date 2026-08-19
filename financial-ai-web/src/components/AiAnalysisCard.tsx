import React from "react";
import {
  TagIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ShieldExclamationIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  FlagIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { MultiInsightCharts } from "./MultiInsightCharts";
import type { NewsItem } from "../types";

interface AiAnalysisCardProps {
  news: NewsItem;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({ news }) => {
  const score = news.sentimentScore ?? 50;
  const isPositive = score >= 60;
  const isNegative = score <= 40;

  // Helper render bullet points
  const renderBulletList = (text?: string) => {
    if (!text) return null;
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return (
      <ul className="space-y-1.5 text-xs text-[#5A5248] leading-relaxed">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-\*]\s*/, "");
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#7A9B58] mt-0.5 shrink-0 text-sm leading-none">•</span>
              <span>{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8EDE0]/80 shadow-sm space-y-6 text-[#2B3A1A] font-sans">
      {/* 1. Header Báo cáo - Tinh giản, nền trắng */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EDE6] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D5226] uppercase tracking-wide">
              <SparklesIcon className="w-4 h-4 text-[#7A9B58]" />
              Báo Cáo Phân Tách Định Giá & Tác Động
            </span>
          </div>
          <p className="text-xs text-[#7A7060]">
            Phân tích chuyên sâu tự động bằng AI từ dữ liệu định lượng bài viết.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7A7060] font-medium">Điểm tác động:</span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
              isPositive
                ? "bg-[#E8F5E0] text-[#3D5226] border-[#C8E6B8]"
                : isNegative
                ? "bg-[#FBF0EE] text-[#C96B54] border-[#F2D0C8]"
                : "bg-[#F8F5F0] text-[#7A7060] border-[#E8EDE0]"
            }`}
          >
            {isPositive ? "▲ Tích cực" : isNegative ? "▼ Tiêu cực" : "◆ Trung lập"}{" "}
            <span className="tabular-nums font-mono">({score}/100)</span>
          </span>
        </div>
      </header>

      {/* 2. Vùng Giá Mục Tiêu & Khuyến Nghị Nhanh - Tinh giản không box thô */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#F8F5F0]/80 border border-[#E8EDE0]/60 space-y-1">
          <div className="flex items-center gap-1.5">
            <CurrencyDollarIcon className="w-4 h-4 text-[#3D5226] shrink-0" />
            <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wide">
              Vùng Mua Khuyến Nghị
            </span>
          </div>
          <div className="text-sm font-bold text-[#3D5226] font-mono">
            {news.entryZone || "Ghi nhận theo bài viết"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F5F0]/80 border border-[#E8EDE0]/60 space-y-1">
          <div className="flex items-center gap-1.5">
            <FlagIcon className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wide">
              Giá Mục Tiêu Kỳ Vọng
            </span>
          </div>
          <div className="text-sm font-bold text-[#2E7D32] font-mono">
            {news.targetPrice || "Kịch bản tích cực"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F5F0]/80 border border-[#E8EDE0]/60 space-y-1">
          <div className="flex items-center gap-1.5">
            <XCircleIcon className="w-4 h-4 text-[#C96B54] shrink-0" />
            <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wide">
              Cắt Lỗ Quản Trị
            </span>
          </div>
          <div className="text-sm font-bold text-[#C96B54] font-mono">
            {news.stopLossZone || "Kỷ luật quản trị vốn"}
          </div>
        </div>
      </div>

      {/* 3. Khối Giải Thích Lý Do & Động Lực */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Luận điểm */}
        <div className="p-4 md:p-5 rounded-xl bg-[#F8F5F0]/60 border border-[#E8EDE0]/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D5226] uppercase tracking-wide">
            <SparklesIcon className="w-4 h-4 text-[#7A9B58]" />
            <span>Giải Thích Luận Điểm</span>
          </div>
          {renderBulletList(
            news.reasoning ||
              "• Nội dung chính xác nhận từ sự kiện bài báo.\n• Tín hiệu thị trường phản ánh trực tiếp vào định giá.\n• Dữ liệu lượng hoá làm cơ sở tính điểm tác động."
          )}
        </div>

        {/* Động lực */}
        <div className="p-4 md:p-5 rounded-xl bg-[#F8F5F0]/60 border border-[#E8EDE0]/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D5226] uppercase tracking-wide">
            <ArrowTrendingUpIcon className="w-4 h-4 text-[#7A9B58]" />
            <span>Động Lực Tăng Giá & Xúc Tác</span>
          </div>
          {renderBulletList(
            news.catalystAnalysis ||
              "• Dòng tiền khối ngoại và tổ chức nâng đỡ.\n• Sản lượng tiêu thụ và biên lợi nhuận kỳ vọng cải thiện.\n• Hưởng lợi từ chu kỳ ngành và chính sách vĩ mô."
          )}
        </div>
      </div>

      {/* 4. Bộ Biểu Đồ Insight Nền Sáng Tinh Gọn */}
      <MultiInsightCharts
        radarMetrics={news.radarMetrics}
        sentimentBreakdown={news.sentimentBreakdown}
        technicalSignals={news.technicalSignals}
        timelineGrowthData={news.timelineGrowthData}
        chartData={news.chartData}
      />

      {/* 5. Chiến Lược 3 Tầng Chi Tiết */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5248] uppercase tracking-wide">
          <AcademicCapIcon className="w-4 h-4 text-[#3D5226]" />
          <span>Chi Tiết Chiến Lược Đầu Tư & Luận Điểm</span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {/* Ngắn hạn */}
          <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2B3A1A]">
                Lướt Sóng Ngắn Hạn (T+)
              </span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Kỹ thuật
              </span>
            </div>
            <p className="text-xs text-[#5A5248] leading-relaxed">
              {news.shortTermStrategy ||
                "Gom mua ở vùng nền kỹ thuật, chốt lời từng phần khi tiệm cận kháng cự ngắn hạn."}
            </p>
          </div>

          {/* Trung hạn */}
          <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2B3A1A]">
                Trung Hạn (3 - 6 Tháng)
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Tăng trưởng
              </span>
            </div>
            <p className="text-xs text-[#5A5248] leading-relaxed">
              {news.mediumTermStrategy ||
                "Nắm giữ theo đà tăng trưởng kết quả kinh doanh quý và chu kỳ mở rộng thị phần."}
            </p>
          </div>

          {/* Dài hạn */}
          <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2B3A1A]">
                Dài Hạn (1 - 3 Năm)
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Nội tại
              </span>
            </div>
            <p className="text-xs text-[#5A5248] leading-relaxed">
              {news.longTermStrategy ||
                "Tích sản ở các nhịp điều chỉnh lớn của thị trường chung khi P/E ở vùng hấp dẫn."}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Phân Tích Vĩ Mô & Rủi Ro */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-sky-50/40 border border-sky-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 uppercase tracking-wide">
            <GlobeAltIcon className="w-4 h-4 text-sky-600" />
            <span>Tác Động Vĩ Mô & Cơ Cấu Ngành</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            {news.macroImpact ||
              "Hưởng lợi từ môi trường lãi suất ổn định và chính sách thúc đẩy đầu tư công, không chịu áp lực lớn từ tỷ giá."}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wide">
            <ShieldExclamationIcon className="w-4 h-4 text-rose-600" />
            <span>Bối Cảnh Rủi Ro & Kịch Bản Cảnh Báo</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            {news.riskAnalysis ||
              "Rủi ro chốt lời ngắn hạn từ khối tự doanh/khối ngoại và biến động giá nguyên vật liệu trên thị trường quốc tế."}
          </p>
        </div>
      </div>

      {/* 7. Tags / Keywords */}
      {news.keywords && news.keywords.length > 0 && (
        <footer className="pt-4 border-t border-[#F0EDE6] flex items-center gap-2 flex-wrap">
          <TagIcon className="w-4 h-4 text-[#A09888] shrink-0" />
          {news.keywords.map((kw: string, idx: number) => (
            <span
              key={idx}
              className="bg-[#F8F5F0] text-[#5A5248] px-2.5 py-1 rounded-lg text-xs font-medium border border-[#E8EDE0]/60"
            >
              #{kw}
            </span>
          ))}
        </footer>
      )}
    </section>
  );
};
