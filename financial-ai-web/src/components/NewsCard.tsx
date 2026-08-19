import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { TERM_DEFS } from './TermPopup';
import { StockLogo, isStockTicker } from './StockLogo';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper tự động gắn hiệu ứng liquid-glass cho thuật ngữ tài chính
  const renderHighlightedContent = (text?: string) => {
    if (!text) return null;
    const terms = ['EBITDA', 'P/E', 'ROE', 'ROA', 'NIM', 'CAGR', 'Margin Call', 'Dividend Yield', 'YoY', 'RSI'];
    const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      if (TERM_DEFS[lower]) {
        return (
          <span
            key={i}
            className="liquid-glass-highlight"
            data-term={lower}
            title={`Click để xem giải thích AI: ${part}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Determine source color
  const getSourceColor = (source: string, link?: string) => {
    const text = `${source || ''} ${link || ''}`.toUpperCase();
    if (text.includes('CAFEF')) return '#E8562A';
    if (text.includes('VIETSTOCK')) return '#1A5EAB';
    if (text.includes('VNECONOMY')) return '#2E7D32';
    if (text.includes('VNEXPRESS')) return '#8E24AA';
    return '#7A9B58';
  };

  const getSourceLabel = (source?: string, link?: string) => {
    const text = `${source || ''} ${link || ''}`.toUpperCase();
    if (text.includes('CAFEF')) return 'CAFEF';
    if (text.includes('VIETSTOCK')) return 'VIETSTOCK';
    if (text.includes('VNECONOMY')) return 'VNECONOMY';
    if (text.includes('VNEXPRESS')) return 'VNEXPRESS';
    return source || 'TIN TỨC';
  };

  // Determine sentiment properties
  const getSentimentInfo = (type?: string, score?: number) => {
    const upper = type?.toUpperCase();
    const scoreText = score && score > 0 ? ` (${score}%)` : '';
    if (upper === 'POSITIVE') {
      return { 
        color: 'bg-[#3D5226]', 
        text: `▲ Tích cực${scoreText}`, 
        textColor: 'text-[#3D5226]', 
        bg: 'bg-[#E8F5E0]', 
        border: 'border-[#9CB953]' 
      };
    }
    if (upper === 'NEGATIVE') {
      return { 
        color: 'bg-[#C96B54]', 
        text: `▼ Tiêu cực${scoreText}`, 
        textColor: 'text-[#C96B54]', 
        bg: 'bg-[#FBF0EE]', 
        border: 'border-[#C96B54]' 
      };
    }
    return { 
      color: 'bg-[#7A7060]', 
      text: `◆ Trung lập${scoreText}`, 
      textColor: 'text-[#5A5248]', 
      bg: 'bg-[#F8F5F0]', 
      border: 'border-[#DDD8CE]' 
    };
  };

  const score = news.sentimentScore ?? 0;
  const sentimentInfo = getSentimentInfo(news.sentimentType, score);

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-[#E8EDE0] hover:border-[#9CB953] transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Sentiment Strip */}
      <div className={`h-[3px] w-full ${sentimentInfo.color}`}></div>
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Category/Ticker with nametag icon on LEFT, Sentiment Badge on RIGHT */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Cụm góc trái: Thẻ phân loại/Ticker (có icon nametag) + Nguồn báo + Thời gian */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Thẻ phân loại tin tức / Ticker góc trái: Nếu là mã CP thì hiện Logo thật, nếu là Category/Vĩ mô thì chỉ hiện icon nametag */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E8F5E0] text-[#3D5226] font-bold text-xs rounded-lg border border-[#C8DFB0] shadow-2xs">
              {isStockTicker(news.ticker) ? (
                <StockLogo ticker={news.ticker} size="xs" fallback="none" />
              ) : (
                <svg className="w-3.5 h-3.5 text-[#7A9B58] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              )}
              <span className="font-mono uppercase">{news.ticker || 'VĨ MÔ'}</span>
            </span>

            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded text-white" 
              style={{ backgroundColor: getSourceColor(news.source, news.link) }}
            >
              {getSourceLabel(news.source, news.link)}
            </span>
            <span className="text-xs text-[#7A7060]">{news.publishedDate}</span>
          </div>
          
          {/* Góc phải: Sentiment Rating */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${sentimentInfo.bg} ${sentimentInfo.textColor} ${sentimentInfo.border}`}>
              {sentimentInfo.text}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/dashboard/news/${news.id}`} className="block mb-2 group">
          <h2 className="text-[17px] leading-snug font-serif font-bold text-[#2B3A1A] group-hover:text-[#3D5226] transition-colors">
            {renderHighlightedContent(news.title)}
          </h2>
        </Link>

        {/* Keywords / Tags với nametag icon */}
        {news.keywords && news.keywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {news.keywords.map((kw, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-[#5A5248] bg-[#F5F0E8] border border-[#E8EDE0] px-2.5 py-0.5 rounded-full font-medium">
                <svg className="w-3 h-3 text-[#7A9B58] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                <span>{kw}</span>
              </span>
            ))}
          </div>
        )}

        {/* AI Summary Block */}
        <div className="bg-[#F5F8F0] border border-[#E0E8D4] rounded-xl p-4 mb-3 relative">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#3D5226] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <span className="text-[9px] text-white font-bold">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-widest text-[#7A9B58] uppercase mb-1 flex items-center justify-between">
                <span>AI Tóm Tắt Trọng Tâm</span>
                <span className="text-[9px] text-[#A09888] font-normal italic lowercase hidden sm:inline">
                  (bôi đen/click thuật ngữ để xem giải thích)
                </span>
              </div>
              <p className={`text-xs text-[#3D5226] leading-relaxed select-text font-sans ${expanded ? '' : 'line-clamp-3'}`}>
                {renderHighlightedContent(news.aiSummary)}
              </p>
            </div>
          </div>
        </div>

        {/* Expand / Collapse toggle if long */}
        {news.aiSummary && news.aiSummary.length > 180 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-semibold text-[#7A9B58] hover:text-[#3D5226] mb-3 self-start transition-colors"
          >
            {expanded ? 'Thu gọn ↑' : 'Đọc thêm ↓'}
          </button>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E8EDE0] text-xs">
          {news.link ? (
            <a 
              href={news.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#7A7060] hover:text-[#2B3A1A] font-semibold flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Bài gốc
            </a>
          ) : (
            <span />
          )}
          
          <Link 
            to={`/dashboard/news/${news.id}`} 
            className="font-bold text-[#3D5226] hover:text-[#2B3A1A] flex items-center gap-1 transition-colors"
          >
            <span>Xem phân tích AI</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;