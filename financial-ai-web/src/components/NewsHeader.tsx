import React from 'react';
import { 
  BuildingLibraryIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon, 
  ArrowUpRightIcon 
} from '@heroicons/react/24/outline';
import type { NewsItem } from '../types';

interface NewsHeaderProps {
  news: NewsItem;
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({ news }) => {
  return (
    <header className="bg-white p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 bg-cyan-50 text-cyan-800 font-extrabold text-xs rounded-xl border border-cyan-200/60 tracking-wide">
            {news.ticker}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <BuildingLibraryIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>{news.source}</span>
            <span aria-hidden="true">•</span>
            <ClockIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <time dateTime={news.publishedDate}>{news.publishedDate}</time>
          </div>
        </div>

        <aside aria-label="Đánh giá xu hướng">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border ${
            news.sentimentType === 'POSITIVE'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <ArrowTrendingUpIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {news.sentimentType === 'POSITIVE' ? `Tích cực ${news.sentimentScore}%` : 'Trung tính 50%'}
            </span>
          </span>
        </aside>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
        {news.title}
      </h1>

      <p className="text-sm font-normal text-slate-600 leading-relaxed">
        {news.aiSummary}
      </p>

      <footer className="pt-2">
        <a 
          href={news.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-800 hover:text-cyan-900 hover:underline focus:outline-none"
        >
          <span>Đọc bài viết gốc trên {news.source}</span>
          <ArrowUpRightIcon className="w-4 h-4" aria-hidden="true" />
        </a>
      </footer>
    </header>
  );
};