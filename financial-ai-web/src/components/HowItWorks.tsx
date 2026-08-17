export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#2B3A1A]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-white font-serif mb-6" style={{ fontFamily: 'Lora, serif' }}>Cách thức hoạt động</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">Đơn giản hóa hành trình đầu tư của bạn với 3 bước dễ dàng.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 font-sans">
          {/* Step 1 */}
          <div className="bg-[#2B3A1A] border border-[#3D5226] rounded-2xl p-8 relative overflow-hidden group hover:border-[#7A9B58] transition-colors">
            <div className="absolute -right-4 -top-4 text-8xl font-bold text-[#3D5226]/30 group-hover:text-[#3D5226]/50 transition-colors pointer-events-none">1</div>
            <div className="text-[#9CB953] font-bold text-xl mb-4 relative z-10">Bước 1</div>
            <h3 className="text-white text-xl font-bold mb-3 relative z-10">Cập nhật tin tức</h3>
            <p className="text-white/70 relative z-10 leading-relaxed">Hệ thống liên tục thu thập hàng nghìn bài báo và báo cáo tài chính từ các nguồn chính thống và uy tín nhất trên thị trường.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#2B3A1A] border border-[#3D5226] rounded-2xl p-8 relative overflow-hidden group hover:border-[#7A9B58] transition-colors mt-0 md:mt-8">
            <div className="absolute -right-4 -top-4 text-8xl font-bold text-[#3D5226]/30 group-hover:text-[#3D5226]/50 transition-colors pointer-events-none">2</div>
            <div className="text-[#9CB953] font-bold text-xl mb-4 relative z-10">Bước 2</div>
            <h3 className="text-white text-xl font-bold mb-3 relative z-10">AI Phân tích</h3>
            <p className="text-white/70 relative z-10 leading-relaxed">Mô hình ngôn ngữ tự nhiên tiến hành đọc hiểu, tóm tắt ý chính và giải thích các thuật ngữ khó thành ngôn ngữ thường ngày.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#2B3A1A] border border-[#3D5226] rounded-2xl p-8 relative overflow-hidden group hover:border-[#7A9B58] transition-colors mt-0 md:mt-16">
            <div className="absolute -right-4 -top-4 text-8xl font-bold text-[#3D5226]/30 group-hover:text-[#3D5226]/50 transition-colors pointer-events-none">3</div>
            <div className="text-[#9CB953] font-bold text-xl mb-4 relative z-10">Bước 3</div>
            <h3 className="text-white text-xl font-bold mb-3 relative z-10">Đánh giá Tác động</h3>
            <p className="text-white/70 relative z-10 leading-relaxed">Đưa ra thang điểm Sentiment và cảnh báo tác động trực tiếp của bản tin đến các mã cổ phiếu liên quan giúp bạn ra quyết định.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;