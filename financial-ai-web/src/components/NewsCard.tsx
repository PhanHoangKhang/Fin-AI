import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ArrowTrendingUpIcon, 
  ArrowUpRightIcon, 
  TagIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import type { NewsItem } from '../types';

export const NewsCard: React.FC<{ news: NewsItem }> = ({ news }) => {
  return (
    <article className="bg-white p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition">
      {/* Header Card */}
      <header className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-cyan-50 font-bold text-xs border border-cyan-100 text-cyan-800">
            {news.ticker}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {news.source} • {news.publishedDate}
          </span>
        </div>

        <aside aria-label="Đánh giá sentiment">
          <span className={`text-xs font-semibold px-3 py-1 flex items-center gap-1 ${
            news.sentimentType === 'POSITIVE' 
              ? 'bg-emerald-50 text-emerald-800' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            <ArrowTrendingUpIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> 
            <span>
              {news.sentimentType === 'POSITIVE' ? `Tích cực ${news.sentimentScore}%` : 'Trung tính 50%'}
            </span>
          </span>
        </aside>
      </header>

      {/* Tiêu đề bài báo */}
      <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
        {news.title}
      </h3>

      {/* AI Summary Block */}
      <section aria-label="AI Tóm tắt" className="p-4 border border-slate-100 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs uppercase tracking-wider">
          <SparklesIcon className="w-4 h-4 text-cyan-700 shrink-0" aria-hidden="true" />
          <span>AI Tóm tắt trọng tâm</span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          {news.aiSummary}
        </p>

        {/* Keywords Tag */}
        {news.keywords && news.keywords.length > 0 && (
          <footer className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <TagIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <ul className="flex flex-wrap gap-2" role="list">
              {news.keywords.map((kw, idx) => (
                <li key={idx} className="bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-bold text-slate-700">
                  {kw}
                </li>
              ))}
            </ul>
          </footer>
        )}
      </section>

      {/* Chân Card: Tách biệt 2 Link rõ ràng */}
      <footer className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
        {/* Link 1: Ra bài viết gốc (Mở tab mới) */}
        <a 
          href={news.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition"
        >
          <span>Bài gốc</span>
          <ArrowUpRightIcon className="w-3.5 h-3.5" aria-hidden="true" />
        </a>

        {/* Link 2: Xem Phân tích AI Chi tiết */}
        <Link 
          to={`/dashboard/news/${news.id}`} 
          className="font-bold text-cyan-800 hover:text-cyan-900 inline-flex items-center gap-1 transition"
        >
          <span>Xem phân tích AI</span>
          <ChevronRightIcon className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
};