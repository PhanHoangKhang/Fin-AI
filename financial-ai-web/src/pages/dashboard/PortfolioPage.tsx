import React from 'react';

export const PortfolioPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B3A1A] tracking-tight flex items-center gap-2">
          Cảnh Báo Danh Mục Cá Nhân <span className="bg-[#F2E8C4] text-[#7A5C1E] text-xs font-bold px-2.5 py-1 rounded-full border border-[#C9973E]">Gói Pro</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">AI liên tục kết hợp tin tức thị trường với danh mục đầu tư thực tế của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2B3A1A] text-white p-6 rounded-3xl border border-[#3D5226] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-[#C9973E]">HPG (Tỷ trọng: 35%)</span>
            <span className="text-xs bg-[#3D5226]/80 text-[#9CB953] px-3 py-1 rounded-full border border-[#9CB953] font-bold">
              Tác động Tốt
            </span>
          </div>
          <p className="text-xs text-[#D8D0C0] leading-relaxed font-medium">
            Giá vốn mua của bạn là **26,000đ**. Xu hướng giảm giá quặng sắt hiện tại ủng hộ việc tiếp tục giữ cổ phiếu cho mục tiêu Q3.
          </p>
        </div>
      </div>
    </div>
  );
};