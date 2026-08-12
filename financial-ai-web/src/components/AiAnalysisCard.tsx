import React from 'react';
import { 
  SparklesIcon, 
  BookOpenIcon, 
  ExclamationTriangleIcon, 
  TagIcon 
} from '@heroicons/react/24/outline';
import { NewsChart } from './NewsChart';
import type { NewsItem } from '../types';

interface AiAnalysisCardProps {
  news: NewsItem;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({ news }) => {
  return (
    <section 
      aria-labelledby="ai-analysis-heading" 
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white p-8 border border-slate-800 shadow-xl space-y-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <SparklesIcon className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          <h2 id="ai-analysis-heading" className="text-base font-bold tracking-tight text-white">
            Phân Tích Tác Động Chuyên Sâu Bởi Gemini AI
          </h2>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded-lg border border-cyan-700/50">
          AEO Verified
        </span>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Khối Bối Cảnh */}
        <article className="space-y-3 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4" aria-hidden="true" />
            Bối Cảnh & Động Lực Thị Trường
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {news.marketContext || 'Dữ liệu phân tích thể hiện phản ứng tích cực của dòng vốn đối với thông tin quy hoạch và kế hoạch kinh doanh.'}
          </p>
        </article>

        {/* Khối Khuyến Nghị */}
        <article className="space-y-3 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" aria-hidden="true" />
            Khuyến Nghị Cho Nhà Đầu Tư
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {news.recommendation || news.investorAction || 'Thích hợp cho chiến lược nắm giữ ngắn và trung hạn. Khuyến nghị nhà đầu tư canh các vùng giá hỗ trợ kỹ thuật để giải ngân.'}
          </p>
        </article>
      </div>

      {/* Component Biểu đồ Recharts */}
      <NewsChart chartData={news.chartData} />

      {/* Khối Từ Khóa */}
      {news.keywords && news.keywords.length > 0 && (
        <footer className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <TagIcon className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <ul className="flex flex-wrap gap-2 text-xs" role="list">
            {news.keywords.map((kw: any, index: any) => (
              <li key={index} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-xl border border-slate-700 font-medium">
                {kw}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </section>
  );
};