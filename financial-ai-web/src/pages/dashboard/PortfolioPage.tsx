import React from 'react';

export const PortfolioPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Cảnh Báo Danh Mục Cá Nhân <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">Gói Pro</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">AI liên tục kết hợp tin tức thị trường với danh mục đầu tư thực tế của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyan-950 text-white p-6 rounded-3xl border border-cyan-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-amber-300">HPG (Tỷ trọng: 35%)</span>
            <span className="text-xs bg-emerald-900/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-700 font-bold">
              Tác động Tốt
            </span>
          </div>
          <p className="text-xs text-cyan-100 leading-relaxed font-medium">
            Giá vốn mua của bạn là **26,000đ**. Xu hướng giảm giá quặng sắt hiện tại ủng hộ việc tiếp tục giữ cổ phiếu cho mục tiêu Q3.
          </p>
        </div>
      </div>
    </div>
  );
};