package com.finai.service;

import com.finai.dto.NewsDto;
import com.finai.dto.NewsDetailDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class NewsService {

    private static final String RSS_URL = "https://vnexpress.net/rss/kinh-doanh.rss";
    private static final String DEFAULT_SOURCE = "VnExpress Kinh Doanh";
    private static final int MAX_ITEMS = 20;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private NewsInsightExtractor insightExtractor;

    public List<NewsDto> fetchAndProcessNews() {
        List<NewsDto> newsList = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(RSS_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .parser(org.jsoup.parser.Parser.xmlParser())
                    .get();

            // Tên nguồn lấy động từ thẻ <channel><title> của chính feed
            Element channelTitle = doc.select("channel > title").first();
            String source = channelTitle != null ? channelTitle.text().replace(" RSS", "").trim() : DEFAULT_SOURCE;
            if (source.isEmpty()) {
                source = DEFAULT_SOURCE;
            }

            Elements items = doc.select("item");
            int limit = Math.min(MAX_ITEMS, items.size());

            for (int i = 0; i < limit; i++) {
                Element item = items.get(i);

                String title = item.select("title").text();
                String link = item.select("link").text();
                String guid = item.select("guid").text();
                String pubDate = item.select("pubDate").text();
                String rawDescription = item.select("description").text();

                // description của VnExpress là CDATA chứa <a><img>...</a>, chỉ lấy phần chữ
                String cleanSummary = Jsoup.parse(rawDescription).text().trim();
                if (cleanSummary.isEmpty()) {
                    cleanSummary = title;
                }

                String fullText = title + ". " + cleanSummary;

                // Toàn bộ các trường dưới đây được bóc tách từ nội dung thật của bài báo
                String ticker = insightExtractor.detectTicker(title, fullText);
                int score = insightExtractor.scoreSentiment(title, cleanSummary);
                String sentiment = insightExtractor.classifySentiment(score);
                List<String> keywords = insightExtractor.extractKeywords(fullText, ticker);

                // ID ổn định: ưu tiên guid của feed, sau đó tới link, cuối cùng là title
                String identity = firstNonBlank(guid, link, title);
                String stableId = String.valueOf(identity.trim().hashCode() & 0x7fffffff);

                NewsDto dto = NewsDto.builder()
                        .id(stableId)
                        .ticker(ticker)
                        .title(title)
                        .link(link)
                        .source(source)
                        .publishedDate(insightExtractor.formatPublishedDate(pubDate))
                        .sentimentType(sentiment)
                        .sentimentScore(score)
                        .aiSummary(cleanSummary)
                        .keywords(keywords)
                        .build();

                newsList.add(dto);
            }
        } catch (Exception e) {
            System.err.println("Lỗi cào tin RSS Jsoup: " + e.getMessage());
            return getFallbackNews();
        }

        return newsList.isEmpty() ? getFallbackNews() : newsList;
    }

    /**
     * Chỉ dùng khi KHÔNG kết nối được RSS (mất mạng / feed lỗi).
     * Đây là trường hợp duy nhất dữ liệu tĩnh được trả về.
     */
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
            System.err.println("Gemini Service bị lỗi/timeout, dựng báo cáo từ nội dung bài báo: " + e.getMessage());
            aiAnalysis = new NewsDetailDto();
        }

        // 3. Đảm bảo gán lại thông tin cơ bản từ RSS
        aiAnalysis.setId(matchedNews.getId());
        aiAnalysis.setTicker(matchedNews.getTicker());
        aiAnalysis.setTitle(matchedNews.getTitle());
        aiAnalysis.setLink(matchedNews.getLink());
        aiAnalysis.setSource(matchedNews.getSource());
        aiAnalysis.setPublishedDate(matchedNews.getPublishedDate());

        // 4. Bổ sung mọi trường Gemini còn thiếu bằng dữ liệu bóc tách từ chính bài báo
        //    (không ghi đè nội dung Gemini đã trả về)
        insightExtractor.enrich(
                matchedNews.getTitle(),
                matchedNews.getAiSummary(),
                matchedNews.getTicker(),
                aiAnalysis
        );

        return aiAnalysis;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }
}
