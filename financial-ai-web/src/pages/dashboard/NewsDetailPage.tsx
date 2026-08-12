import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  ArrowUpRightIcon, 
  ExclamationTriangleIcon,
  BookOpenIcon,
  TagIcon,
  ClockIcon,
  BuildingLibraryIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { newsService } from '../../services/api';

// Interface hứng Data từ Spring Boot DTO
interface NewsDetail {
  id: string;
  ticker: string;
  title: string;
  link: string;
  source: string;
  publishedDate: string;
  sentimentType: string;
  sentimentScore: number;
  aiSummary: string;
  keywords: string[];
  // Các trường phân tích nâng cao (nếu Spring Boot có trả về)
  marketContext?: string;
  recommendation?: string;
}

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // 🟢 Gọi API Spring Boot lấy thông tin chi tiết bài báo theo ID
        const data = await newsService.getById(id);
        setNews(data);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết tin tức từ Spring Boot:', err);
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
    <article className="max-w-4xl mx-auto space-y-8 font-poppins pb-12">
      {/* Quay lại link */}
      <nav aria-label="Điều hướng">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-800 transition focus:outline-none focus:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
          <span>Quay lại Trang Tổng Quan</span>
        </Link>
      </nav>

      {/* Main Card Header */}
      <header className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
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

      {/* Deep Analysis Dark Card (Sát phong cách FinTech) */}
      <section 
        aria-labelledby="ai-analysis-heading" 
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8"
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
              {news.marketContext || 'Dữ liệu phân tích thể hiện phản ứng tích cực của dòng vốn đối với thông tin quy hoạch và kế hoạch kinh doanh. Biên lợi nhuận được dự báo tiếp tục cải thiện trong các quý tới.'}
            </p>
          </article>

          {/* Khối Khuyến Nghị */}
          <article className="space-y-3 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4" aria-hidden="true" />
              Khuyến Nghị Cho Nhà Đầu Tư F0
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {news.recommendation || 'Thích hợp cho chiến lược nắm giữ ngắn và trung hạn. Khuyến nghị nhà đầu tư canh các vùng giá hỗ trợ kỹ thuật để giải ngân dần, hạn chế mua đuổi ở phiên tăng nóng.'}
            </p>
          </article>
        </div>

        {/* Khối Từ Khóa */}
        {news.keywords && news.keywords.length > 0 && (
          <footer className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
            <TagIcon className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <ul className="flex flex-wrap gap-2 text-xs" role="list">
              {news.keywords.map((kw, index) => (
                <li key={index} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-xl border border-slate-700 font-medium">
                  {kw}
                </li>
              ))}
            </ul>
          </footer>
        )}
      </section>
    </article>
  );
};