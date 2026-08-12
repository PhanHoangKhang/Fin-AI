import React from 'react';

export const NewsSkeleton: React.FC = () => (
  <div role="status" aria-label="Đang tải dữ liệu" className="space-y-4">
    {[1, 2, 3].map((n) => (
      <div key={n} className="bg-white p-6 border border-slate-200/80 animate-pulse space-y-4">
        <div className="h-5 bg-slate-100 rounded-lg w-1/4"></div>
        <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
        <div className="h-20 bg-slate-50 border border-slate-100"></div>
      </div>
    ))}
  </div>
);