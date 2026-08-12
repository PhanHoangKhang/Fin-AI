import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    { num: "01", title: "Nhập danh mục", desc: "Chọn các mã cổ phiếu bạn đang theo dõi hoặc quan tâm." },
    { num: "02", title: "AI Quét tin tức", desc: "Hệ thống tự động lọc tin chính thống từ báo chí và BCTCL2." },
    { num: "03", title: "Nhận cảnh báo", desc: "Hiểu ngay tác động tới túi tiền và học thêm thuật ngữ mới." },
  ];

  return (
    <section id="how-it-works" className="w-full bg-cyan-950 text-white my-16 py-24 px-8 md:px-16 lg:px-24">
      <div className="w-full space-y-16">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold mt-2 tracking-tight">
            Đầu tư thông minh hơn chỉ với 3 bước đơn giản.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-cyan-900/30 border border-cyan-800/50 p-8 rounded-3xl space-y-4 backdrop-blur-sm">
              <span className="text-4xl font-black text-cyan-400">{step.num}</span>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-white text-sm leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};