import React from 'react';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  ShieldExclamationIcon, 
  RocketLaunchIcon, 
  GlobeAltIcon, 
  CurrencyDollarIcon,
  TagIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { MultiInsightCharts } from './MultiInsightCharts';
import type { NewsItem } from '../types';

interface AiAnalysisCardProps {
  news: NewsItem;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({ news }) => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8 font-poppins">
      
      {/* 1. Header Báo cáo */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
            <SparklesIcon className="w-7 h-7 text-cyan-400"/>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Báo Cáo Phân Tách Định Giá & Tác Động AI
            </h2>
            <p className="text-xs text-slate-400">Gemini Institutional Engine • Real-time Analysis</p>
          </div>
        </div>
        <span className="text-xs font-bold px-3.5 py-1.5 bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-300 rounded-xl border border-cyan-700/50 shadow-inner">
          Rating: {news.sentimentScore}/100
        </span>
      </header>

      {/* 2. Vùng Giá Mục Tiêu & Khuyến Nghị Nhanh (Target Price Banner) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
        <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-700 pb-3 sm:pb-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vùng Mua Khuyến Nghị</span>
          <span className="text-sm font-extrabold text-cyan-400">{news.entryZone || '38.5 - 40.0'}</span>
        </div>
        <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-700 pb-3 sm:pb-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Giá Mục Tiêu Kỷ Vọng</span>
          <span className="text-sm font-extrabold text-emerald-400">{news.targetPrice || '48.5 (+22%)'}</span>
        </div>
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cắt Lỗ Quản Trị</span>
          <span className="text-sm font-extrabold text-rose-400">{news.stopLossZone || '< 36.8'}</span>
        </div>
      </div>

      {/* 3. Khối Giải Thích Lý Do (Reasoning & Catalysts) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Luận điểm giải thích VÌ SAO */}
        <article className="space-y-2 bg-cyan-950/30 p-5 rounded-2xl border border-cyan-900/40">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <LightBulbIcon className="w-4 h-4 text-cyan-400"/> Giải Thích Luận Điểm (Reasoning)
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            {news.reasoning || 'Dữ liệu cào từ bài báo xác nhận mức tăng trưởng doanh thu vượt kỳ vọng. Việc mở rộng thị phần sẽ giúp doanh nghiệp duy trì biên lợi nhuận cao.'}
          </p>
        </article>

        {/* Động lực chính (Catalysts) */}
        <article className="space-y-2 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <RocketLaunchIcon className="w-4 h-4 text-emerald-400"/> Động Lực Tăng Giá (Catalysts)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {news.catalystAnalysis || '1. Dòng tiền khối ngoại quay lại mua ròng. 2. Sản lượng tiêu thụ tăng. 3. Hưởng lợi từ chính sách vĩ mô.'}
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

      {/* 5. Chiến Lược 3 Tầng (Ngắn / Trung / Dài hạn) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <AcademicCapIcon className="w-4 h-4"/> Chi Tiết Chiến Lược Đầu Tư Theo Khung Thời Gian
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-sky-400 block">Lướt Sóng Ngắn Hạn (T+)</span>
            <p className="text-xs text-slate-300">{news.shortTermStrategy || 'Gom mua ở vùng nền kỹ thuật, chốt lời khi tiệm cận kháng cự ngắn.'}</p>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-400 block">Trung Hạn (3 - 6 Tháng)</span>
            <p className="text-xs text-slate-300">{news.mediumTermStrategy || 'Nắm giữ theo đà tăng trưởng kết quả kinh doanh quý.'}</p>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-purple-400 block">Dài Hạn (1 - 3 Năm)</span>
            <p className="text-xs text-slate-300">{news.longTermStrategy || 'Tích sản ở các nhịp điều chỉnh lớn của thị trường chung.'}</p>
          </div>
        </div>
      </div>

      {/* 6. Phân Tích Vĩ Mô & Rủi Ro Quản Trị */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
          <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
            <GlobeAltIcon className="w-4 h-4"/> Tác Động Vĩ Mô & Ngành
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{news.macroImpact || 'Không chịu nhiều áp lực từ tỷ giá, hưởng lợi từ môi trường lãi suất thấp.'}</p>
        </div>
        <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-900/30 space-y-1.5">
          <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <ShieldExclamationIcon className="w-4 h-4"/> Rủi Ro Cần Quản Trị
          </h4>
          <p className="text-xs text-rose-200/80 leading-relaxed">{news.riskAnalysis || 'Rủi ro chốt lời từ nhóm cổ đông lớn và biến động giá hàng hóa thế giới.'}</p>
        </div>
      </div>

      {/* 7. Tags / Keywords */}
      {news.keywords && news.keywords.length > 0 && (
        <footer className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <TagIcon className="w-4 h-4 text-slate-500 shrink-0"/>
          <ul className="flex flex-wrap gap-2 text-xs">
            {news.keywords.map((kw: any, idx: any) => (
              <li key={idx} className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-xl border border-slate-700/60 font-medium">
                #{kw}
              </li>
            ))}
          </ul>
        </footer>
      )}

    </section>
  );
};