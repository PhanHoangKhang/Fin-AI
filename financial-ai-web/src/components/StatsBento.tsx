import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const StatsBento: React.FC = () => {
  return (
    <section className="w-full px-8 md:px-16 lg:px-24 py-12">
      <div className="text-center mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Tại sao chọn FinAI</span>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-1 tracking-tight">
          Được tin dùng bởi cộng đồng nhà đầu tư F0
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 border border-slate-100 p-10 rounded-3xl flex flex-col justify-between">
          <h3 className="text-6xl font-black text-cyan-800 tracking-tight">5k+</h3>
          <p className="text-slate-700 font-semibold text-lg mt-12 max-w-sm">
            Nhà đầu tư cá nhân đọc tin và học kiến thức mỗi ngày trên FinAI.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-10 rounded-3xl flex flex-col justify-between">
          <div>
            <p className="text-xl font-semibold text-slate-900 mb-2">Gõ bất kỳ mã cổ phiếu nào để nhận tóm tắt AI ngay lập tức.</p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <span className="px-3.5 py-1.5 bg-cyan-50 text-cyan-800 font-bold rounded-xl text-sm">MBB</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Lãi Q2 tăng 15%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};