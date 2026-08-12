import React from 'react';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="w-full px-8 md:px-16 lg:px-24 py-16 text-center">
      <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Chọn gói phù hợp</span>
      <h2 className="text-3xl font-bold text-slate-900 mt-1 mb-12">Bắt đầu miễn phí, nâng cấp khi cần</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-left flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Miễn phí (Standard)</h3>
            <p className="text-slate-500 text-sm mt-2">Dành cho học sinh, sinh viên & F0 mới tìm hiểu.</p>
            <div className="text-4xl font-extrabold text-slate-900 mt-6">0 VNĐ</div>
          </div>
          <button className="mt-8 w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-3 rounded-xl transition">
            Dùng ngay
          </button>
        </div>

        <div className="bg-cyan-700 text-white p-8 rounded-3xl text-left flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-2xl font-bold">Gói Pro (AI Portfolio)</h3>
            <p className="text-cyan-100 text-sm mt-2">Cảnh báo rủi ro danh mục cá nhân hóa & AI Tutor.</p>
            <div className="text-4xl font-extrabold mt-6">49,000 VNĐ <span className="text-sm font-normal text-cyan-200">/ tháng</span></div>
          </div>
          <button className="mt-8 w-full bg-white hover:bg-cyan-50 text-cyan-800 font-bold py-3 rounded-xl transition">
            Nâng cấp Pro
          </button>
        </div>
      </div>
    </section>
  );
};