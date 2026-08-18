import React from 'react';
import { StockLogo, isStockTicker } from './StockLogo';
import {
  BuildingLibraryIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ArrowUpRightIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  SignalIcon,
  CurrencyDollarIcon,
  QueueListIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldExclamationIcon,
  GlobeAltIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon,
  ScaleIcon,
  FlagIcon,
  TagIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import type { NewsItem } from '../types';

interface NewsHeaderProps {
  news: NewsItem;
}

/* ------------------------------------------------------------------ */
/* Helpers: rút gọn nội dung dài để header vẫn đọc lướt được           */
/* ------------------------------------------------------------------ */

/** Cắt chuỗi theo ranh giới từ, thêm dấu … nếu bị cắt. */
const truncate = (text: string, max: number): string => {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
};

/** Tách các đoạn dạng "• ..." hoặc xuống dòng thành mảng bullet ngắn gọn. */
const toBullets = (text: string | undefined, max: number, maxChars = 150): string[] => {
  if (!text) return [];
  return text
    .split(/\r?\n|(?=•)/)
    .map((line) => line.replace(/^[•\-–*\s]+/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, max)
    .map((line) => truncate(line, maxChars));
};

/** Điểm số 0-100 -> màu thanh bar. */
const barTone = (value: number): string => {
  if (value >= 70) return 'bg-emerald-500';
  if (value >= 45) return 'bg-[#7A9B58]';
  if (value >= 30) return 'bg-amber-500';
  return 'bg-rose-500';
};

const hasEntries = (data?: Record<string, number>): boolean =>
  !!data && Object.keys(data).length > 0;

/* ------------------------------------------------------------------ */
/* Cấu hình hiển thị tâm lý thị trường                                 */
/* ------------------------------------------------------------------ */

const SENTIMENT_STYLES = {
  POSITIVE: {
    label: 'Tích cực',
    icon: ArrowTrendingUpIcon,
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconClassName: 'text-emerald-600',
    barClassName: 'bg-emerald-500',
  },
  NEGATIVE: {
    label: 'Tiêu cực',
    icon: ArrowTrendingDownIcon,
    className: 'bg-rose-50 text-rose-800 border-rose-200',
    iconClassName: 'text-rose-600',
    barClassName: 'bg-rose-500',
  },
  NEUTRAL: {
    label: 'Trung tính',
    icon: MinusIcon,
    className: 'bg-[#F8F5F0] text-[#5A5248] border-[#E8EDE0]',
    iconClassName: 'text-[#7A7060]',
    barClassName: 'bg-[#A09888]',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

/** Ô số liệu định giá (vùng mua / giá mục tiêu / cắt lỗ). */
const ValueTile: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string;
  tone: string;
}> = ({ icon: Icon, label, value, tone }) => (
  <div className="p-3 rounded-xl border border-[#E8EDE0]/70 bg-white flex items-start gap-2.5">
    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${tone}`} />
    <div className="min-w-0">
      <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wide block">
        {label}
      </span>
      <p className="text-xs font-bold text-[#3D5226] mt-0.5 wrap-break-word">
        {value?.trim() || 'Chưa xác định'}
      </p>
    </div>
  </div>
);

/** Khối text rút gọn dạng bullet (reasoning, catalyst, risk, macro...). */
const InsightBlock: React.FC<{
  icon: React.ElementType;
  label: string;
  text?: string;
  accent: string;
  bullets?: number;
}> = ({ icon: Icon, label, text, accent, bullets = 2 }) => {
  const lines = toBullets(text, bullets);
  if (lines.length === 0) return null;

  return (
    <div className="p-3.5 rounded-xl bg-[#F8F5F0]/80 border border-[#E8EDE0]/60 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className={`w-4 h-4 shrink-0 ${accent}`} />
        <span className="text-[10px] font-bold text-[#5A5248] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <ul className="space-y-1 text-xs text-[#5A5248] leading-relaxed">
        {lines.map((line, idx) => (
          <li key={idx} className="flex items-start gap-1.5">
            <span className="text-[#A09888] mt-px">›</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Nhóm chỉ số dạng thanh bar ngang (radar, kỹ thuật, tăng trưởng, tâm lý...). */
const MetricGroup: React.FC<{
  icon: React.ElementType;
  label: string;
  data?: Record<string, number>;
  accent: string;
  limit?: number;
}> = ({ icon: Icon, label, data, accent, limit = 5 }) => {
  if (!hasEntries(data)) return null;
  const entries = Object.entries(data!).slice(0, limit);

  return (
    <div className="p-3.5 rounded-xl bg-white border border-[#E8EDE0]/70 space-y-2">
      <div className="flex items-center gap-1.5">
        <Icon className={`w-4 h-4 shrink-0 ${accent}`} />
        <span className="text-[10px] font-bold text-[#5A5248] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <ul className="space-y-1.5">
        {entries.map(([key, value]) => (
          <li key={key} className="space-y-0.5">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-[#5A5248] font-medium truncate">{key}</span>
              <span className="text-[#2B3A1A] font-bold tabular-nums shrink-0">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-[#F0EDE6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barTone(value)}`}
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Chiến lược theo khung thời gian, rút gọn còn 1-2 ý chính. */
const StrategyTile: React.FC<{
  label: string;
  horizon: string;
  text?: string;
  accent: string;
}> = ({ label, horizon, text, accent }) => {
  const lines = toBullets(text, 2, 120);
  if (lines.length === 0) return null;

  return (
    <div className="p-3.5 rounded-xl bg-white border border-[#E8EDE0]/70 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-extrabold ${accent}`}>{label}</span>
        <span className="text-[10px] font-semibold text-[#A09888]">{horizon}</span>
      </div>
      <ul className="space-y-1 text-xs text-[#5A5248] leading-relaxed">
        {lines.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Component chính                                                     */
/* ------------------------------------------------------------------ */

export const NewsHeader: React.FC<NewsHeaderProps> = ({ news }) => {
  const sentiment =
    SENTIMENT_STYLES[news.sentimentType?.toUpperCase() as keyof typeof SENTIMENT_STYLES] ??
    SENTIMENT_STYLES.NEUTRAL;
  const SentimentIcon = sentiment.icon;
  const score = Math.max(0, Math.min(100, news.sentimentScore ?? 0));

  const keyEvents = news.keyEvents?.filter((event) => event?.trim()) ?? [];
  const actionAdvice = news.investorAction || news.recommendation;

  const hasStrategy =
    !!news.shortTermStrategy || !!news.mediumTermStrategy || !!news.longTermStrategy;
  const hasMetrics =
    hasEntries(news.radarMetrics) ||
    hasEntries(news.technicalSignals) ||
    hasEntries(news.timelineGrowthData) ||
    hasEntries(news.sentimentBreakdown) ||
    hasEntries(news.chartData);

  return (
    <header className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8EDE0]/80 shadow-sm space-y-6">

      {/* 1. TOP METADATA & BADGES */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EDE6] pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#3D5226] text-white font-extrabold text-xs rounded-xl tracking-wider shadow-sm">
            {isStockTicker(news.ticker) ? (
              <StockLogo ticker={news.ticker} size="xs" fallback="none" />
            ) : (
              <svg className="w-3.5 h-3.5 text-[#9CB953] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            )}
            <span>{news.ticker || 'VĨ MÔ'}</span>
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7A7060]">
            <BuildingLibraryIcon className="w-4 h-4 text-[#A09888]" />
            <span>{news.source}</span>
            <span>•</span>
            <ClockIcon className="w-4 h-4 text-[#A09888]" />
            <span>{news.publishedDate}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${sentiment.className}`}
        >
          <SentimentIcon className={`w-4 h-4 ${sentiment.iconClassName}`} />
          {sentiment.label}
          {score > 0 && <span className="opacity-70">({score}/100)</span>}
        </span>
      </div>

      {/* 2. TITLE + TÓM TẮT AI */}
      <div className="space-y-3">
        <h1 className="text-xl md:text-2xl font-black text-[#2B3A1A] leading-snug tracking-tight">
          {news.title}
        </h1>

        {news.aiSummary && (
          <p className="text-sm text-[#5A5248] leading-relaxed font-medium border-l-2 border-[#7A9B58] pl-3">
            {truncate(news.aiSummary, 420)}
          </p>
        )}

        {/* Thanh điểm tâm lý tổng hợp */}
        {score > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wide shrink-0">
              Điểm tác động
            </span>
            <div className="h-2 flex-1 bg-[#F0EDE6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${sentiment.barClassName}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#3D5226] tabular-nums shrink-0">
              {score}/100
            </span>
          </div>
        )}
      </div>

      {/* 3. ĐỊNH GIÁ & VÙNG GIÁ KHUYẾN NGHỊ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ValueTile
          icon={CurrencyDollarIcon}
          label="Con số / Vùng mua ghi nhận"
          value={news.entryZone}
          tone="text-[#3D5226]"
        />
        <ValueTile
          icon={FlagIcon}
          label="Giá mục tiêu kỳ vọng"
          value={news.targetPrice}
          tone="text-emerald-600"
        />
        <ValueTile
          icon={ShieldExclamationIcon}
          label="Ngưỡng cắt lỗ"
          value={news.stopLossZone}
          tone="text-rose-600"
        />
        <ValueTile
          icon={ClipboardDocumentCheckIcon}
          label="Khuyến nghị hành động"
          value={actionAdvice ? truncate(actionAdvice, 110) : undefined}
          tone="text-indigo-600"
        />
      </div>

      {/* 4. ĐIỂM TIN CHÍNH + BỐI CẢNH THỊ TRƯỜNG */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 bg-[#F8F5F0] p-4 rounded-xl border border-[#E8EDE0]/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5248] uppercase tracking-wide">
            <QueueListIcon className="w-4 h-4 text-[#3D5226]" />
            <span>Điểm tin chính (Key Takeaways)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#5A5248] font-medium">
            {keyEvents.length > 0 ? (
              keyEvents.slice(0, 5).map((event, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#3D5226] font-bold">•</span>
                  <span>{truncate(event, 180)}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2">
                <span className="text-[#3D5226] font-bold">•</span>
                <span>{news.aiSummary}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-5 space-y-3">
          {news.marketContext && (
            <div className="p-3.5 bg-[#F5F8F0]/60 rounded-xl border border-[#E0E8D4] space-y-1.5">
              <div className="flex items-center gap-1.5">
                <GlobeAltIcon className="w-4 h-4 text-[#3D5226] shrink-0" />
                <span className="text-[10px] font-bold text-[#2B3A1A] uppercase tracking-wide">
                  Bối cảnh thị trường
                </span>
              </div>
              <p className="text-xs text-[#5A5248] leading-relaxed">
                {truncate(news.marketContext, 260)}
              </p>
            </div>
          )}

          {news.impactAnalysis && (
            <div className="p-3.5 bg-[#F8F5F0] rounded-xl border border-[#E8EDE0]/60 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ScaleIcon className="w-4 h-4 text-[#5A5248] shrink-0" />
                <span className="text-[10px] font-bold text-[#7A7060] uppercase tracking-wide">
                  Mức độ tác động
                </span>
              </div>
              <p className="text-xs text-[#5A5248] leading-relaxed">
                {truncate(news.impactAnalysis, 260)}
              </p>
            </div>
          )}

          {actionAdvice && (
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                  Nhà đầu tư nên làm gì
                </span>
              </div>
              <p className="text-xs text-[#5A5248] leading-relaxed">
                {truncate(actionAdvice, 260)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. LUẬN ĐIỂM - ĐỘNG LỰC - RỦI RO - VĨ MÔ (rút gọn) */}
      {(news.reasoning || news.catalystAnalysis || news.riskAnalysis || news.macroImpact) && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5248] uppercase tracking-wide">
            <LightBulbIcon className="w-4 h-4 text-amber-500" />
            <span>Đúc kết phân tích</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <InsightBlock
              icon={LightBulbIcon}
              label="Luận điểm cốt lõi"
              text={news.reasoning}
              accent="text-amber-500"
            />
            <InsightBlock
              icon={RocketLaunchIcon}
              label="Động lực tăng giá"
              text={news.catalystAnalysis}
              accent="text-emerald-600"
            />
            <InsightBlock
              icon={ShieldExclamationIcon}
              label="Rủi ro cần quản trị"
              text={news.riskAnalysis}
              accent="text-rose-600"
            />
            <InsightBlock
              icon={GlobeAltIcon}
              label="Tác động vĩ mô"
              text={news.macroImpact}
              accent="text-blue-600"
            />
          </div>
        </div>
      )}

      {/* 6. CHIẾN LƯỢC 3 KHUNG THỜI GIAN (rút gọn) */}
      {hasStrategy && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5248] uppercase tracking-wide">
            <CalendarDaysIcon className="w-4 h-4 text-[#3D5226]" />
            <span>Chiến lược theo khung thời gian</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StrategyTile
              label="Ngắn hạn"
              horizon="T+ / Lướt sóng"
              text={news.shortTermStrategy}
              accent="text-sky-600"
            />
            <StrategyTile
              label="Trung hạn"
              horizon="3 - 6 tháng"
              text={news.mediumTermStrategy}
              accent="text-indigo-600"
            />
            <StrategyTile
              label="Dài hạn"
              horizon="1 - 3 năm"
              text={news.longTermStrategy}
              accent="text-purple-600"
            />
          </div>
        </div>
      )}

      {/* 7. TOÀN BỘ CHỈ SỐ ĐỊNH LƯỢNG (radar, kỹ thuật, tăng trưởng, tâm lý) */}
      {hasMetrics && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5248] uppercase tracking-wide">
            <ChartBarIcon className="w-4 h-4 text-[#3D5226]" />
            <span>Chỉ số định lượng tổng hợp</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <MetricGroup
              icon={ChartBarIcon}
              label="Khía cạnh trọng yếu (360°)"
              data={news.radarMetrics}
              accent="text-[#3D5226]"
            />
            <MetricGroup
              icon={SignalIcon}
              label="Tín hiệu kỹ thuật & dòng tiền"
              data={news.technicalSignals}
              accent="text-indigo-600"
            />
            <MetricGroup
              icon={PresentationChartLineIcon}
              label="Xung lực tăng trưởng theo quý"
              data={news.timelineGrowthData}
              accent="text-emerald-600"
            />
            <MetricGroup
              icon={ChartPieIcon}
              label="Cơ cấu tâm lý thị trường"
              data={news.sentimentBreakdown}
              accent="text-amber-600"
            />
            <MetricGroup
              icon={BoltIcon}
              label="Chỉ số bổ sung"
              data={news.chartData}
              accent="text-[#5A5248]"
            />
          </div>
        </div>
      )}

      {/* 8. KEYWORDS */}
      {news.keywords && news.keywords.length > 0 && (
        <div className="flex items-start gap-2 flex-wrap">
          <TagIcon className="w-4 h-4 text-[#A09888] shrink-0 mt-0.5" />
          {news.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold bg-[#F0EDE6] text-[#5A5248] px-2.5 py-0.5 rounded-full border border-[#E8EDE0]"
            >
              #{keyword}
            </span>
          ))}
        </div>
      )}

      {/* 9. FOOTER */}
      <footer className="pt-3 border-t border-[#F0EDE6] flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-[#A09888] font-medium">
          Bóc tách tự động từ dữ liệu báo chí • Mã tin #{news.id}
        </span>
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D5226] hover:text-[#2B3A1A] transition"
        >
          <span>Đọc bài viết gốc trên {news.source}</span>
          <ArrowUpRightIcon className="w-3.5 h-3.5" />
        </a>
      </footer>

    </header>
  );
};
