export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 border-y border-[#E0DDD6] bg-white/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center bg-[#E8F5E0] text-[#3D5226] px-4 py-1.5 rounded-full text-sm font-bold tracking-wider font-sans mb-4 uppercase border border-[#3D5226]/10">
            SỨC MẠNH AI
          </div>
          <h2 className="text-4xl text-[#2B3A1A] font-serif mb-6" style={{ fontFamily: 'Lora, serif' }}>
            Trải nghiệm đọc tin nâng tầm kiến thức tài chính của bạn.
          </h2>
          <p className="text-[#7A7060] text-lg font-sans">
            Mọi bài báo phức tạp đều được xử lý để mang lại thông tin súc tích, dễ hiểu và có tính ứng dụng trực tiếp cho danh mục đầu tư của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8EDE0] shadow-sm hover:shadow-md transition-shadow font-sans">
            <div className="mb-5 text-[#3D5226]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2B3A1A] mb-3">Tóm tắt tin tức tự động</h3>
            <p className="text-[#7A7060] leading-relaxed">
              Trích xuất ngay những ý chính quan trọng nhất từ các bài báo dài, giúp bạn nắm bắt cốt lõi vấn đề trong 30 giây mà không cần đọc hết bài.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8EDE0] shadow-sm hover:shadow-md transition-shadow font-sans">
            <div className="mb-5 text-[#3D5226]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2B3A1A] mb-3">Dịch thuật ngữ bình dân</h3>
            <p className="text-[#7A7060] leading-relaxed">
              Các thuật ngữ chuyên ngành tài chính (như P/E, ROE, Margin) được AI giải thích tự động sang ngôn ngữ đời thường, phù hợp cho người mới F0.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8EDE0] shadow-sm hover:shadow-md transition-shadow font-sans">
            <div className="mb-5 text-[#3D5226]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2B3A1A] mb-3">Đánh giá Sentiment chuẩn xác</h3>
            <p className="text-[#7A7060] leading-relaxed">
              AI chấm điểm sắc thái của tin tức (Tích cực/Tiêu cực/Trung lập) và liên kết trực tiếp để dự báo mức độ tác động lên giá cổ phiếu liên quan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;