package com.finai.service;

import com.finai.dto.NewsDto;
import com.finai.dto.NewsDetailDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class NewsService {

    // 1. Danh sách các nguồn RSS báo tài chính - chứng khoán hàng đầu
    private static final Map<String, String> RSS_SOURCES = Map.of(
        "VnExpress Kinh Doanh", "https://vnexpress.net/rss/kinh-doanh.rss",
        "CafeF Chứng Khoán", "https://cafef.vn/thi-truong-chung-khoan.rss",
        "Vietstock", "https://vietstock.vn/chung-khoan.htm",
        "VnEconomy Tài Chính", "https://vneconomy.vn/tai-chinh.rss"
    );

    private static final String DEFAULT_SOURCE = "Thị Trường";
    private static final int MAX_ITEMS_PER_SOURCE = 10; // Giới hạn số bài mỗi nguồn để cân bằng feed

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private NewsInsightExtractor insightExtractor;

    /**
     * Cào và xử lý tin tức từ ĐA NGUỒN (Multi-source RSS) song song.
     */
    public List<NewsDto> fetchAndProcessNews() {
        // Cào dữ liệu song song (Parallel Processing) từ tất cả nguồn để tối ưu thời gian chờ
        List<CompletableFuture<List<NewsDto>>> futures = RSS_SOURCES.entrySet().stream()
                .map(entry -> CompletableFuture.supplyAsync(() -> fetchSingleRssSource(entry.getKey(), entry.getValue())))
                .collect(Collectors.toList());

        // Tổng hợp tất cả danh sách bài viết từ các luồng
        List<NewsDto> allNews = futures.stream()
                .map(CompletableFuture::join)
                .flatMap(List::stream)
                .collect(Collectors.toList());

        return allNews.isEmpty() ? getFallbackNews() : allNews;
    }

    /**
     * Xử lý cào dữ liệu cho 1 nguồn RSS cụ thể (Cô lập lỗi per-source).
     */
    private List<NewsDto> fetchSingleRssSource(String fallbackSource, String rssUrl) {
        List<NewsDto> newsList = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(rssUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(8000)
                    .parser(org.jsoup.parser.Parser.xmlParser())
                    .get();

            // Tên nguồn lấy động từ thẻ <channel><title> nếu có, không thì lấy fallbackSource
            Element channelTitle = doc.select("channel > title").first();
            String source = (channelTitle != null && !channelTitle.text().isBlank()) 
                    ? channelTitle.text().replace(" RSS", "").trim() 
                    : fallbackSource;

            if (source.isEmpty()) {
                source = DEFAULT_SOURCE;
            }

            Elements items = doc.select("item");

            // Vietstock now serves the category page instead of an RSS document.
            if (items.isEmpty() && fallbackSource.equals("Vietstock")) {
                Elements articleLinks = doc.select("h4 a.fontbold[href*='/20']");
                int limit = Math.min(MAX_ITEMS_PER_SOURCE, articleLinks.size());

                for (int i = 0; i < limit; i++) {
                    Element articleLink = articleLinks.get(i);
                    String title = articleLink.attr("title").trim();
                    String link = articleLink.absUrl("href");

                    if (title.isEmpty()) {
                        title = articleLink.text().trim();
                    }
                    if (title.isEmpty() || link.isEmpty()) {
                        continue;
                    }

                    String ticker = insightExtractor.detectTicker(title, title);
                    int score = insightExtractor.scoreSentiment(title, title);
                    String sentiment = insightExtractor.classifySentiment(score);
                    List<String> keywords = insightExtractor.extractKeywords(title, ticker);
                    String stableId = String.valueOf(link.hashCode() & 0x7fffffff);

                    newsList.add(NewsDto.builder()
                            .id(stableId)
                            .ticker(ticker)
                            .title(title)
                            .link(link)
                            .source(fallbackSource)
                            .publishedDate("Mới cập nhật")
                            .sentimentType(sentiment)
                            .sentimentScore(score)
                            .aiSummary(title)
                            .keywords(keywords)
                            .build());
                }

                return newsList;
            }

            int limit = Math.min(MAX_ITEMS_PER_SOURCE, items.size());

            for (int i = 0; i < limit; i++) {
                Element item = items.get(i);

                String title = item.select("title").text();
                String link = item.select("link").text();
                String guid = item.select("guid").text();
                String pubDate = item.select("pubDate").text();
                String rawDescription = item.select("description").text();

                // Lọc sạch thẻ HTML trong description (chỉ lấy phần text)
                String cleanSummary = Jsoup.parse(rawDescription).text().trim();
                if (cleanSummary.isEmpty()) {
                    cleanSummary = title;
                }

                String fullText = title + ". " + cleanSummary;

                // Bóc tách dữ liệu thông minh qua NewsInsightExtractor
                String ticker = insightExtractor.detectTicker(title, fullText);
                int score = insightExtractor.scoreSentiment(title, cleanSummary);
                String sentiment = insightExtractor.classifySentiment(score);
                List<String> keywords = insightExtractor.extractKeywords(fullText, ticker);

                // Tạo ID ổn định duy nhất cho bài báo
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
            // Log lỗi riêng cho từng nguồn, không crash toàn bộ Service
            System.err.println("Lỗi cào tin RSS [" + fallbackSource + "]: " + e.getMessage());
        }

        return newsList;
    }

    /**
     * Chỉ dùng khi KHÔNG kết nối được bất kỳ nguồn RSS nào.
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
            // 2. Bọc try-catch riêng cho Gemini
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

        // 4. Bổ sung thông tin còn thiếu
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