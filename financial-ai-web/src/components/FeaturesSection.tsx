import React from 'react';
import { Layers, BookOpenCheck, ShieldCheck } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Layers className="w-6 h-6 text-cyan-800" />,
      title: "Tóm tắt tin tức tự động",
      desc: "Gom cụm hàng trăm bài báo trùng lặp thành 1 bản tin duy nhất 30 giây."
    },
    {
      icon: <BookOpenCheck className="w-6 h-6 text-cyan-800" />,
      title: "Dịch thuật ngữ bình dân",
      desc: "AI tự động giải thích các từ ngữ tài chính khó hiểu (NIM, P/E, EBITDA) cho người mới."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-800" />,
      title: "Đánh giá Sentiment chuẩn xác",
      desc: "Phân tích tác động Tốt / Xấu / Trung tính dựa trên thuật toán AI khách quan."
    }
  ];

  return (
    <section id="features" className="w-full px-8 md:px-16 lg:px-24 py-16">
      <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-10 md:p-14">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Sức mạnh AI</span>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-2 mb-12 max-w-2xl tracking-tight">
          Trải nghiệm đọc tin nâng tầm kiến thức tài chính của bạn.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((item, idx) => (
            <div key={idx} className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};