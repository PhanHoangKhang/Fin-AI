import React, { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { newsService } from '../../services/api';
import type { NewsItem } from '../../types';
import { NewsCard } from '../../components/NewsCard';
import { NewsSkeleton } from '../../components/NewsSkeleton';

export const OverviewPage: React.FC = () => {
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Gọi API lấy tin tức từ Spring Boot Backend
  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await newsService.getFeed();
      setNewsFeed(data || []);
    } catch (error) {
      console.error('Lỗi khi tải tin tức từ Backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tổng Quan Tin Tức AI
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Tin tức cào realtime từ RSS Feed & Tóm tắt AI.
          </p>
        </div>

        <button 
          type="button"
          onClick={loadNews}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50 focus:outline-none"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-800' : ''}`} aria-hidden="true" />
          <span>{loading ? 'Đang cập nhật...' : 'Làm mới feed'}</span>
        </button>
      </header>

      {/* Feed Nội dung */}
      {loading ? (
        <NewsSkeleton />
      ) : newsFeed.length === 0 ? (
        <div role="alert" className="p-8 text-center bg-white border border-slate-200/80 text-slate-500 font-medium text-sm">
          Chưa có dữ liệu tin tức nào. Vui lòng nhấn "Làm mới feed" để cập nhật.
        </div>
      ) : (
        <div className="space-y-4">
          {newsFeed.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};