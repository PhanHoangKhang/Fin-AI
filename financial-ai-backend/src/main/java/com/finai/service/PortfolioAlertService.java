package com.finai.service;

import com.finai.dto.NewsDto;
import com.finai.dto.PortfolioAlertDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioAlertService {

    @Autowired
    private NewsService newsService;

    @Autowired
    private PortfolioService portfolioService;

    public List<PortfolioAlertDto> generateAlertsForUser(String userId) {
        List<PortfolioAlertDto> alerts = new ArrayList<>();

        // 1. Lấy dữ liệu tin tức RSS
        List<NewsDto> latestNews = newsService.fetchAndProcessNews();

        // 2. Lấy danh mục cổ phiếu
        Map<String, Double> userPortfolio = portfolioService.getUserPortfolio(userId);

        if (latestNews == null || latestNews.isEmpty()) {
            return alerts;
        }

        // 3. Duyệt qua từng bài báo
        for (NewsDto news : latestNews) {
            String ticker = news.getTicker();

            // BỎ check userPortfolio.containsKey(ticker) 
            // Chỉ cần bài báo có trích xuất được Ticker là tạo Alert object gửi về Frontend
            if (ticker != null) {
                
                // Mặc định tính toán hoặc lấy giá vốn giả lập
                double avgPrice = userPortfolio.getOrDefault(ticker, 25.0);
                double currentPrice = portfolioService.getCurrentMarketPrice(ticker);
                double profitLossPct = ((currentPrice - avgPrice) / avgPrice) * 100;

                boolean isNegative = "NEGATIVE".equalsIgnoreCase(news.getSentimentType()) 
                                    || (news.getSentimentScore() < 40);

                PortfolioAlertDto alert = PortfolioAlertDto.builder()
                        .alertId("ALT-" + news.getId())
                        .ticker(ticker)
                        .alertType(isNegative ? "NEGATIVE_RISK" : "POSITIVE_OPPORTUNITY")
                        .title(news.getTitle())
                        .summary(news.getAiSummary())
                        .link(news.getLink())
                        .publishedDate(news.getPublishedDate())
                        .avgPrice(avgPrice)
                        .currentPrice(currentPrice)
                        .profitLossPct(Math.round(profitLossPct * 100.0) / 100.0)
                        .suggestedAction(isNegative 
                            ? "Tin tức bất lợi. Cân nhắc quản trị rủi ro." 
                            : "Tín hiệu tích cực. Tiếp tục nắm giữ.")
                        .build();

                alerts.add(alert);
            }
        }

        // 4. FALLBACK: Nếu cào thật không khớp bài nào (alerts vẫn rỗng), tạo dữ liệu mẫu cho Demo
        if (alerts.isEmpty()) {
            alerts.add(PortfolioAlertDto.builder()
                    .alertId("ALT-DEMO-01")
                    .ticker("HPG")
                    .alertType("NEGATIVE_RISK")
                    .title("Giá quặng sắt thế giới giảm nhẹ - Áp lực lên biên lợi nhuận ngành thép")
                    .summary("Tin tức ghi nhận xu hướng điều chỉnh giá nguyên liệu đầu vào. Thị trường thép ngắn hạn có sự phân hóa nhẹ.")
                    .link("https://vnexpress.net/kinh-doanh")
                    .publishedDate("15 phút trước")
                    .avgPrice(25.5)
                    .currentPrice(24.1)
                    .profitLossPct(-5.49)
                    .suggestedAction("Giá hiện tại 24.1kđ thấp hơn giá vốn 25.5kđ. Cân nhắc quản trị rủi ro.")
                    .build());

            alerts.add(PortfolioAlertDto.builder()
                    .alertId("ALT-DEMO-02")
                    .ticker("FPT")
                    .alertType("POSITIVE_OPPORTUNITY")
                    .title("FPT công bố doanh thu mảng Công nghệ tăng trưởng mạnh")
                    .summary("Mảng xuất khẩu phần mềm tiếp tục duy trì đà tăng trưởng 2 con số tại thị trường Nhật Bản và Mỹ.")
                    .link("https://vnexpress.net/kinh-doanh")
                    .publishedDate("1 giờ trước")
                    .avgPrice(115.0)
                    .currentPrice(122.0)
                    .profitLossPct(6.09)
                    .suggestedAction("Kết quả kinh doanh khả quan hỗ trợ đà tăng. Tiếp tục nắm giữ.")
                    .build());
        }

        return alerts;
    }
}