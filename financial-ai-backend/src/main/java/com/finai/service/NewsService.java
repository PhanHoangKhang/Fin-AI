package com.finai.service;

import com.finai.dto.NewsDto;
import com.finai.dto.NewsDetailDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import java.nio.charset.StandardCharsets;
// import java.security.MessageDigest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class NewsService {

    private static final String RSS_URL = "https://vnexpress.net/rss/kinh-doanh.rss";

    @Autowired
    private GeminiService geminiService;

    public List<NewsDto> fetchAndProcessNews() {
        List<NewsDto> newsList = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(RSS_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .parser(org.jsoup.parser.Parser.xmlParser())
                    .get();

            Elements items = doc.select("item");

            int limit = Math.min(10, items.size());
            for (int i = 0; i < limit; i++) {
                Element item = items.get(i);

                String title = item.select("title").text();
                String link = item.select("link").text();
                String pubDate = item.select("pubDate").text();
                String rawDescription = item.select("description").text();

                String cleanSummary = Jsoup.parse(rawDescription).text();

                String ticker = (i % 3 == 0) ? "VĨ MÔ" : (i % 2 == 0 ? "HPG" : "VNM");
                String sentiment = (i % 2 == 0) ? "POSITIVE" : "NEUTRAL";
                int score = (i % 2 == 0) ? 80 : 60;

                // 1. Kiểm tra an toàn biến link để tránh NullPointerException
                String safeLink = (link != null) ? link.trim() : title; // Nếu link null thì lấy tạm title

                // 2. Tạo ID cố định dạng chuỗi số dương (Luôn an toàn 100%, không bao giờ ra số âm)
                String stableId = String.valueOf(safeLink.hashCode() & 0x7fffffff);

                NewsDto dto = NewsDto.builder()
                        .id(stableId)
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
            System.err.println("Lỗi cào tin RSS Jsoup: " + e.getMessage());
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

    public NewsDetailDto getNewsById(String id) {
        List<NewsDto> allNews = fetchAndProcessNews();

        NewsDto matchedNews = allNews.stream()
                .filter(news -> news.getId().equals(id))
                .findFirst()
                .orElse(null);

        // 1. Không tìm thấy tin tức trong danh sách
        if (matchedNews == null) {
            return null;
        }

        NewsDetailDto aiAnalysis;
        try {
            // 2. Bọc try-catch riêng cho Gemini để tránh làm sập API nếu AI lỗi/timeout
            aiAnalysis = geminiService.analyzeNewsWithGemini(
                    matchedNews.getTitle(), 
                    matchedNews.getAiSummary(), 
                    matchedNews.getTicker()
            );
        } catch (Exception e) {
            System.err.println("Gemini Service bị lỗi/timeout, sử dụng fallback data: " + e.getMessage());
            // Trả về DTO rỗng/fallback thay vì ném exception 500
            aiAnalysis = new NewsDetailDto(); 
        }

        // 3. Đảm bảo gán lại thông tin từ RSS
        aiAnalysis.setId(matchedNews.getId());
        aiAnalysis.setTicker(matchedNews.getTicker());
        aiAnalysis.setTitle(matchedNews.getTitle());
        aiAnalysis.setLink(matchedNews.getLink());
        aiAnalysis.setSource(matchedNews.getSource());
        aiAnalysis.setPublishedDate(matchedNews.getPublishedDate());

        return aiAnalysis;
    }

    // private String generateFixedId(String link) {
    //     if (link == null || link.trim().isEmpty()) {
    //         return String.valueOf(System.currentTimeMillis());
    //     }
    //     try {
    //         MessageDigest md = MessageDigest.getInstance("MD5");
    //         byte[] hash = md.digest(link.trim().getBytes(StandardCharsets.UTF_8));
    //         StringBuilder sb = new StringBuilder();
    //         for (byte b : hash) {
    //             sb.append(String.format("%02x", b));
    //         }
    //         return sb.toString().substring(0, 8); // Lấy 8 ký tự MD5 làm ID
    //     } catch (Exception e) {
    //         return String.valueOf(Math.abs(link.hashCode()));
    //     }
    // }
}