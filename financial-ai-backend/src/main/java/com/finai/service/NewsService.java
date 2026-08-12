package com.finai.service;

import com.finai.dto.NewsDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class NewsService {

    // Kênh RSS Tin nhanh Kinh doanh / Thị trường của VnExpress
    private static final String RSS_URL = "https://vnexpress.net/rss/kinh-doanh.rss";

    public List<NewsDto> fetchAndProcessNews() {
        List<NewsDto> newsList = new ArrayList<>();

        try {
            // Dùng Jsoup kết nối trực tiếp với User-Agent giả lập trình duyệt
            Document doc = Jsoup.connect(RSS_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .parser(org.jsoup.parser.Parser.xmlParser()) // Parse dưới dạng XML
                    .get();

            Elements items = doc.select("item");

            int limit = Math.min(6, items.size());
            for (int i = 0; i < limit; i++) {
                Element item = items.get(i);

                String title = item.select("title").text();
                String link = item.select("link").text();
                String pubDate = item.select("pubDate").text();
                String rawDescription = item.select("description").text();

                // Lọc bỏ HTML trong description
                String cleanSummary = Jsoup.parse(rawDescription).text();

                // Logic gán Ticker & Sentiment giả lập cho demo
                String ticker = (i % 3 == 0) ? "VĨ MÔ" : (i % 2 == 0 ? "HPG" : "VNM");
                String sentiment = (i % 2 == 0) ? "POSITIVE" : "NEUTRAL";
                int score = (i % 2 == 0) ? 80 : 60;

                NewsDto dto = NewsDto.builder()
                        .id(UUID.randomUUID().toString())
                        .ticker(ticker)
                        .title(title)
                        .link(link)
                        .source("VnExpress Kinh Doanh")
                        .publishedDate(pubDate.isEmpty() ? "Mới cập nhật" : pubDate)
                        .sentimentType(sentiment)
                        .sentimentScore(score)
                        .aiSummary(cleanSummary.isEmpty() ? title : cleanSummary)
                        .keywords(Arrays.asList("Thị trường", "Kinh tế", "Tài chính"))
                        .build();

                newsList.add(dto);
            }
        } catch (Exception e) {
            System.err.println("🔴 Lỗi cào tin RSS Jsoup: " + e.getMessage());
            e.printStackTrace();
            return getFallbackNews();
        }

        return newsList.isEmpty() ? getFallbackNews() : newsList;
    }

    private List<NewsDto> getFallbackNews() {
        return Arrays.asList(
            NewsDto.builder()
                .id("1")
                .ticker("HPG")
                .title("Giá quặng sắt thế giới giảm 4% - Tác động thế nào tới Hòa Phát?")
                .link("https://vnexpress.net")
                .source("CafeF, Vietstock")
                .publishedDate("15 phút trước")
                .sentimentType("POSITIVE")
                .sentimentScore(82)
                .aiSummary("Giá nguyên liệu đầu vào giảm giúp công ty tối ưu biên lợi nhuận sản xuất thép trong Q3. Nhu cầu tiêu thụ nội địa có dấu hiệu phục hồi nhờ các dự án đầu tư công.")
                .keywords(Arrays.asList("Biên lợi nhuận", "P/E", "Quặng sắt"))
                .build()
        );
    }
    //  Hàm tìm bài viết theo ID
    public NewsDto getNewsById(String id) {
        // 1. Nếu dự án của fen dùng JPA / Spring Data Mongo:
        // return newsRepository.findById(id)
        //         .map(this::mapToDto)
        //         .orElse(null);

        // 2. Nếu tin tức lưu tạm trong Cache / List kết quả cào:
        List<NewsDto> allNews = fetchAndProcessNews();
        return allNews.stream()
                .filter(news -> news.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}