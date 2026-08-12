import React from "react";
import {
  TagIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { MultiInsightCharts } from "./MultiInsightCharts";
import type { NewsItem } from "../types";

interface AiAnalysisCardProps {
  news: NewsItem;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({ news }) => {
  return (
    <section className="bg-cyan-950 text-white p-8 shadow-2xl border-cyan-800/50 border space-y-8">
      {/* 1. Header Báo cáo */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Báo Cáo Phân Tách Định Giá & Tác Động
            </h2>
            <p className="text-xs text-slate-400">
               Real-time Analysis
            </p>
          </div>
        </div>
        <span className="text-md font-bold px-3.5 py-1.5 text-white">
          Rating: {news.sentimentScore}/100
        </span>
      </header>

      {/* 2. Vùng Giá Mục Tiêu & Khuyến Nghị Nhanh (Target Price Banner) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cyan-900/30 border border-cyan-800/50 p-4">
        <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-700 pb-3 sm:pb-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Vùng Mua Khuyến Nghị
          </span>
          <span className="text-sm font-extrabold text-cyan-400">
            {news.entryZone || "38.5 - 40.0"}
          </span>
        </div>
        <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-700 pb-3 sm:pb-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Giá Mục Tiêu Kỷ Vọng
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            {news.targetPrice || "48.5 (+22%)"}
          </span>
        </div>
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Cắt Lỗ Quản Trị
          </span>
          <span className="text-sm font-extrabold text-rose-400">
            {news.stopLossZone || "< 36.8"}
          </span>
        </div>
      </div>

      {/* 3. Khối Giải Thích Lý Do  */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Luận điểm giải thích VÌ SAO */}
        <article className="space-y-2 bg-cyan-950/30 p-5 border border-cyan-900/40">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
             Giải Thích Luận
            Điểm 
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
            {news.reasoning ||
              "Dữ liệu cào từ bài báo xác nhận mức tăng trưởng doanh thu vượt kỳ vọng. Việc mở rộng thị phần sẽ giúp doanh nghiệp duy trì biên lợi nhuận cao."}
          </p>
        </article>

        {/* Động lực chính  */}
        <article className="space-y-2 bg-slate-800/40 p-5 border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
             Động Lực
            Tăng Giá 
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {news.catalystAnalysis ||
              "1. Dòng tiền khối ngoại quay lại mua ròng. 2. Sản lượng tiêu thụ tăng. 3. Hưởng lợi từ chính sách vĩ mô."}
          </p>
        </article>
      </div>

      {/* 4. Bộ Biểu Đồ Insight - Đã sửa lỗi Type truyền Object */}
      <MultiInsightCharts
        radarMetrics={news.radarMetrics}
        sentimentBreakdown={news.sentimentBreakdown}
        technicalSignals={news.technicalSignals}
        timelineGrowthData={news.timelineGrowthData}
        chartData={news.chartData}
      />

      {/* 5. Chiến Lược 3 Tầng Chi Tiết & Luận Điểm */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <AcademicCapIcon className="w-4 h-4 text-cyan-400" /> Chi Tiết Chiến
          Lược Đầu Tư & Cơ Sở Luận Điểm
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Ngắn hạn */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 block">
                Lướt Sóng Ngắn Hạn (T+)
              </span>
              <span className="text-xs text-sky-300 px-2 py-0.5 rounded-md">
                Kỹ thuật
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed whitespace-pre-line">
              {news.shortTermStrategy ||
                "Gom mua ở vùng nền kỹ thuật, chốt lời khi tiệm cận kháng cự ngắn."}
            </p>
          </div>

          {/* Trung hạn */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-400 block">
                Trung Hạn (3 - 6 Tháng)
              </span>
              <span className="text-xs text-indigo-300 px-2 py-0.5 rounded-md">
                Tăng trưởng
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed whitespace-pre-line">
              {news.mediumTermStrategy ||
                "Nắm giữ theo đà tăng trưởng kết quả kinh doanh quý."}
            </p>
          </div>

          {/* Dài hạn */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-400 block">
                Dài Hạn (1 - 3 Năm)
              </span>
              <span className="text-xs text-purple-300 px-2 py-0.5">
                Nội tại
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed whitespace-pre-line">
              {news.longTermStrategy ||
                "Tích sản ở các nhịp điều chỉnh lớn của thị trường chung."}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Phân Tích Vĩ Mô & Rủi Ro Quản Trị Chi Tiết */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
             Tác Động Vĩ Mô & Cơ Cấu Ngành
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line">
            {news.macroImpact ||
              "Không chịu nhiều áp lực từ tỷ giá, hưởng lợi từ môi trường lãi suất thấp."}
          </p>
        </div>

        <div className="bg-cyan-900/30 border border-cyan-800/50 p-5 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
             Bối Cảnh Rủi Ro & Kịch
            Bản Cảnh Báo
          </h4>
          <p className="text-xs text-rose-200/90 leading-relaxed font-normal whitespace-pre-line">
            {news.riskAnalysis ||
              "Rủi ro chốt lời từ nhóm cổ đông lớn và biến động giá hàng hóa thế giới."}
          </p>
        </div>
      </div>

      {/* 7. Tags / Keywords */}
      {news.keywords && news.keywords.length > 0 && (
        <footer className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <TagIcon className="w-4 h-4 text-slate-500 shrink-0" />
          <ul className="flex flex-wrap gap-2 text-xs">
            {news.keywords.map((kw: string, idx: number) => (
              <li
                key={idx}
                className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-xl border border-slate-700/60 font-medium"
              >
                #{kw}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </section>
  );
};
