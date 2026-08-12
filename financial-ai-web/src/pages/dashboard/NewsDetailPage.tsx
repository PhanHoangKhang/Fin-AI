import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { newsService } from '../../services/api';
import type { NewsItem } from '../../types';
import { NewsHeader } from '../../components/NewsHeader';
import { AiAnalysisCard } from '../../components/AiAnalysisCard';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await newsService.getById(id);
        setNews(data);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết tin tức:', err);
        setError('Không thể tải thông tin sự kiện. Bài viết có thể không tồn tại hoặc đã bị gỡ.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div role="status" aria-label="Đang tải dữ liệu" className="p-12 text-center font-poppins">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          Đang kết nối Server & Tải phân tích AI chi tiết...
        </p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div role="alert" className="p-12 text-center font-poppins space-y-4 bg-white rounded-3xl border border-slate-200/80 max-w-xl mx-auto my-8">
        <ExclamationTriangleIcon className="w-10 h-10 text-amber-500 mx-auto" aria-hidden="true" />
        <p className="text-slate-700 font-bold text-sm">{error || 'Không tìm thấy dữ liệu sự kiện.'}</p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-800 hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
          <span>Quay lại Trang Tổng Quan</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-8xl space-y-8 font-poppins pb-12">
      {/* Nút Điều hướng */}
      <nav aria-label="Điều hướng">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-800 transition focus:outline-none focus:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
          <span>Quay lại Trang Tổng Quan</span>
        </Link>
      </nav>

      {/* Header Tin Tức */}
      <NewsHeader news={news} />

      {/* Card Phân Tích AI Gemini & Biểu đồ Recharts */}
      <AiAnalysisCard news={news} />
    </article>
  );
};