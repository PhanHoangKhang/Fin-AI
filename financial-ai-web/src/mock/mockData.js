export const MOCK_NEWS = [
  {
    id: "evt-01",
    title: "Ngân hàng Nhà nước giảm lãi suất điều hành 0.5%",
    originalText: "NHNN vừa quyết định điều chỉnh các mức lãi suất...",
    // Phần AI giải thích cho F0
    aiSummary: "Lãi suất giảm giúp doanh nghiệp dễ vay tiền hơn để kinh doanh.",
    beginnerTip: "💡 Dành cho F0: Lãi suất giảm thường là tin TỐT cho chứng khoán vì tiền gửi ngân hàng bớt hấp dẫn, dòng tiền sẽ chảy sang cổ phiếu.",
    sentiment: "POSITIVE", // POSITIVE | NEGATIVE | NEUTRAL
    sentimentScore: 85,
    tickers: ["MBB", "TCB", "VCB"],
    easyTerms: [
      { term: "Lãi suất điều hành", meaning: "Mức lãi suất do Ngân hàng Trung ương quy định để định hướng thị trường." }
    ]
  },
  {
    id: "evt-02",
    title: "Giá thép thế giới sụt giảm do nhu cầu suy yếu",
    originalText: "Thị trường thép ghi nhận mức giảm 3% trong phiên...",
    aiSummary: "Giá thép giảm làm giảm biên lợi nhuận của các công ty sản xuất thép.",
    beginnerTip: "⚠️ Dành cho F0: Tin XẤU cho các mã ngành Thép. Nếu đang giữ cổ phiếu thép, nên cẩn trọng theo dõi.",
    sentiment: "NEGATIVE",
    sentimentScore: 35,
    tickers: ["HPG", "NKG"],
    easyTerms: []
  }
];