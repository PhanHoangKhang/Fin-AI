package com.finai.service;

import com.finai.dto.NewsDto;
import com.finai.dto.NewsDetailDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NewsService {

    private static final String RSS_URL = "https://vnexpress.net/rss/kinh-doanh.rss";
    private static final String DEFAULT_SOURCE = "VnExpress Kinh Doanh";
    private static final int MAX_ITEMS = 10;

    @Autowired
    private GeminiService geminiService;

    /**
     * Một từ khoá nhận diện: pattern đã chuẩn hoá (bỏ dấu, lowercase),
     * label để hiển thị ra ngoài, weight là mức độ ảnh hưởng khi chấm điểm.
     */
    private record Term(Pattern pattern, String label, int weight) {}

    // ---------------------------------------------------------------------
    // TỪ ĐIỂN BÓC TÁCH (tất cả key viết KHÔNG DẤU vì text được normalize trước khi so khớp)
    // ---------------------------------------------------------------------

    /** Tên doanh nghiệp xuất hiện trong bài -> mã cổ phiếu tương ứng. */
    private static final List<Term> COMPANIES = List.of(
            t("hoa phat", "HPG"), t("vinamilk", "VNM"), t("vingroup", "VIC"),
            t("vinhomes", "VHM"), t("vincom", "VRE"), t("vietcombank", "VCB"),
            t("vietinbank", "CTG"), t("techcombank", "TCB"), t("vpbank", "VPB"),
            t("sacombank", "STB"), t("bidv", "BID"), t("mbbank", "MBB"),
            t("the gioi di dong", "MWG"), t("fpt", "FPT"), t("masan", "MSN"),
            t("sabeco", "SAB"), t("petrolimex", "PLX"), t("pv gas", "GAS"),
            t("novaland", "NVL"), t("vietjet", "VJC"), t("vietnam airlines", "HVN"),
            t("hoa sen", "HSG"), t("nam kim", "NKG"), t("gelex", "GEX"),
            t("dam phu my", "DPM"), t("vietbank", "VBB"), t("bao viet", "BVH"),
            t("vicostone", "VCS"), t("dat xanh", "DXG"), t("khang dien", "KDH")
    );

    /** Mã cổ phiếu được phép nhận diện trực tiếp khi viết hoa trong tiêu đề. */
    private static final List<String> KNOWN_TICKERS = List.of(
            "HPG", "VNM", "VIC", "VHM", "VRE", "VCB", "CTG", "TCB", "VPB", "STB",
            "BID", "MBB", "MWG", "FPT", "MSN", "SAB", "PLX", "GAS", "NVL", "VJC",
            "HVN", "HSG", "NKG", "GEX", "DPM", "ACB", "SSI", "VND", "HCM", "VCI",
            "REE", "PNJ", "DGC", "DCM", "POW", "BVH", "VCS", "DXG", "KDH", "PDR"
    );
    private static final Pattern UPPERCASE_TOKEN = Pattern.compile("\\b[A-Z]{3}\\b");

    /** Từ khoá ngành -> nhãn ticker hiển thị khi không xác định được doanh nghiệp cụ thể. */
    private static final List<Term> SECTORS = List.of(
            t("ngan hang", "NGÂN HÀNG"), t("tin dung", "NGÂN HÀNG"), t("lai suat", "NGÂN HÀNG"),
            t("bat dong san", "BẤT ĐỘNG SẢN"), t("nha o", "BẤT ĐỘNG SẢN"), t("chung cu", "BẤT ĐỘNG SẢN"),
            t("chung khoan", "CHỨNG KHOÁN"), t("co phieu", "CHỨNG KHOÁN"), t("vn-index", "CHỨNG KHOÁN"),
            t("trai phieu", "TRÁI PHIẾU"),
            t("gia vang", "VÀNG"), t("vang mieng", "VÀNG"), t("vang nhan", "VÀNG"),
            t("kim loai quy", "VÀNG"),
            t("dau tho", "DẦU KHÍ"), t("xang", "DẦU KHÍ"), t("dau khi", "DẦU KHÍ"),
            t("thep", "THÉP"), t("quang sat", "THÉP"),
            t("nong san", "NÔNG SẢN"), t("gao", "NÔNG SẢN"), t("ca phe", "NÔNG SẢN"),
            t("sau rieng", "NÔNG SẢN"), t("xoai", "NÔNG SẢN"), t("thuy san", "NÔNG SẢN"),
            t("ty gia", "TIỀN TỆ"), t("dong yen", "TIỀN TỆ"), t("dong bac xanh", "TIỀN TỆ"),
            t("bitcoin", "TIỀN SỐ"), t("tien ao", "TIỀN SỐ"), t("tien so", "TIỀN SỐ"),
            t("ban le", "BÁN LẺ"), t("sieu thi", "BÁN LẺ"), t("thuong mai dien tu", "BÁN LẺ"),
            t("cong nghe", "CÔNG NGHỆ"), t("tri tue nhan tao", "CÔNG NGHỆ"), t("chip", "CÔNG NGHỆ"),
            t("hang khong", "HÀNG KHÔNG"), t("san bay", "HÀNG KHÔNG"),
            t("xuat khau", "XUẤT KHẨU"), t("thue quan", "XUẤT KHẨU"),
            t("bao hiem", "BẢO HIỂM"),
            t("khu cong nghiep", "KHU CÔNG NGHIỆP"),
            t("gia dien", "NĂNG LƯỢNG"), t("dien luc", "NĂNG LƯỢNG"),
            t("dien mat troi", "NĂNG LƯỢNG"), t("nang luong", "NĂNG LƯỢNG")
    );

    /** Chủ đề dùng để sinh tag/keywords cho bài báo. */
    private static final List<Term> TOPICS = List.of(
            t("lai suat", "Lãi suất"), t("lam phat", "Lạm phát"), t("ty gia", "Tỷ giá"),
            t("tin dung", "Tín dụng"), t("no xau", "Nợ xấu"), t("trai phieu", "Trái phiếu"),
            t("co tuc", "Cổ tức"), t("loi nhuan", "Lợi nhuận"), t("doanh thu", "Doanh thu"),
            t("xuat khau", "Xuất khẩu"), t("nhap khau", "Nhập khẩu"), t("thue quan", "Thuế quan"),
            t("dau tu cong", "Đầu tư công"), t("fdi", "FDI"), t("gdp", "GDP"), t("cpi", "CPI"),
            t("tieu dung", "Tiêu dùng"), t("suc mua", "Sức mua"), t("ton kho", "Tồn kho"),
            t("nguon cung", "Nguồn cung"), t("gia ban le", "Giá bán lẻ"), t("chi phi", "Chi phí"),
            t("ipo", "IPO"), t("sap nhap", "M&A"), t("von hoa", "Vốn hoá"),
            t("khoi ngoai", "Khối ngoại"), t("giai ngan", "Giải ngân"), t("suy thoai", "Suy thoái"),
            t("phap ly", "Pháp lý"), t("quy hoach", "Quy hoạch"), t("ha tang", "Hạ tầng")
    );

    private static final List<Term> POSITIVE = List.of(
            t("tang truong", "Tăng trưởng", 2), t("tang", "Tăng giá", 1), t("ky luc", "Kỷ lục", 2),
            t("phuc hoi", "Phục hồi", 2), t("but pha", "Bứt phá", 2), t("khoi sac", "Khởi sắc", 2),
            t("cai thien", "Cải thiện", 2), t("huong loi", "Hưởng lợi", 2), t("mua rong", "Mua ròng", 2),
            t("lai lon", "Lãi lớn", 2), t("lai rong", "Lãi ròng", 1), t("bao lai", "Báo lãi", 2),
            t("vuot", "Vượt kế hoạch", 1),
            t("mo rong", "Mở rộng", 1), t("hut von", "Hút vốn", 1), t("dan dau", "Dẫn đầu", 1),
            t("uu dai", "Ưu đãi", 1), t("kich cau", "Kích cầu", 1), t("thang du", "Thặng dư", 2),
            t("giam lai suat", "Giảm lãi suất", 2), t("giam chi phi", "Giảm chi phí", 2),
            t("giam thue", "Giảm thuế", 2), t("giam lo", "Giảm lỗ", 2)
    );

    private static final List<Term> NEGATIVE = List.of(
            // "giam" phải loại trừ "giám đốc", "giám sát", "giám định"
            tRaw("\\bgiam\\b(?!\\s+(doc|sat|dinh|khao|ho))", "Giảm giá", 1),
            t("sut giam", "Sụt giảm", 2), t("lao doc", "Lao dốc", 2),
            t("thua lo", "Thua lỗ", 2), t("lo nang", "Lỗ nặng", 2), t("pha san", "Phá sản", 3),
            t("no xau", "Nợ xấu", 2), t("dinh tre", "Đình trệ", 2), t("suy thoai", "Suy thoái", 3),
            t("ban rong", "Bán ròng", 2), t("cat giam", "Cắt giảm", 2), t("that nghiep", "Thất nghiệp", 2),
            t("vi pham", "Vi phạm", 2), t("dieu tra", "Điều tra", 2), t("xu phat", "Xử phạt", 2),
            t("khung hoang", "Khủng hoảng", 3), t("tham hut", "Thâm hụt", 2), t("chat vat", "Chật vật", 2),
            t("e am", "Ế ẩm", 2), t("mat mua", "Mất mùa", 2), t("tang lai suat", "Tăng lãi suất", 2),
            t("tang thue", "Tăng thuế", 2), t("tang chi phi", "Tăng chi phí", 2)
    );

    private static final List<Term> RISKS = List.of(
            t("rui ro", "Rủi ro"), t("canh bao", "Cảnh báo"), t("lam phat", "Lạm phát"),
            t("thue quan", "Thuế quan"), t("suy thoai", "Suy thoái"), t("no xau", "Nợ xấu"),
            t("pha san", "Phá sản"), t("dieu tra", "Điều tra"), t("bat on", "Bất ổn"),
            t("cang thang", "Căng thẳng"), t("sieu bao", "Thiên tai"), t("thien tai", "Thiên tai")
    );

    private static final List<Term> PRICE_UP = List.of(
            t("tang gia", "", 2), t("tang", "", 1), t("but pha", "", 2), t("lap dinh", "", 2),
            t("ky luc", "", 2), t("dat dinh", "", 2), t("gap doi", "", 2), t("leo thang", "", 2)
    );
    private static final List<Term> PRICE_DOWN = List.of(
            t("giam gia", "", 2), tRaw("\\bgiam\\b(?!\\s+(doc|sat|dinh|khao|ho))", "", 1),
            t("lao doc", "", 2), t("sut giam", "", 2),
            t("roi xuong", "", 2), t("cham day", "", 2), t("mat gia", "", 2)
    );

    private static final List<Term> SUPPLY_TIGHT = List.of(
            t("thieu hut", ""), t("khan hiem", ""), t("mat mua", ""), t("gian doan", ""),
            t("cat giam san luong", ""), t("han che xuat khau", ""), t("cham nguon cung", "")
    );
    private static final List<Term> SUPPLY_LOOSE = List.of(
            t("du cung", ""), t("ton kho", ""), t("san luong tang", ""), t("doi dao", ""),
            t("duoc mua", ""), t("nguon cung tang", "")
    );

    private static final List<Term> DEMAND_UP = List.of(
            t("nhu cau tang", ""), t("tieu thu manh", ""), t("don hang", ""), t("suc mua tang", ""),
            t("hut khach", ""), t("chay hang", ""), t("dat mua", "")
    );
    private static final List<Term> DEMAND_DOWN = List.of(
            t("e am", ""), t("tieu thu cham", ""), t("suc mua yeu", ""), t("that chat chi tieu", ""),
            t("giam tieu dung", ""), t("vang khach", "")
    );

    /** Con số/mức giá: bắt cả dạng khoảng "55.000-80.000 đồng" lẫn đơn lẻ "4%", "190.000 đồng". */
    private static final Pattern FIGURE_PATTERN = Pattern.compile(
            "((?:\\d+(?:[.,]\\d+)*)\\s*[-–]\\s*)?(\\d+(?:[.,]\\d+)*)\\s*"
            + "(%|nghìn tỷ đồng|nghìn tỷ|tỷ USD|triệu USD|tỷ đồng|triệu đồng|nghìn đồng|"
            + "tỷ|triệu|nghìn|đồng|USD|kg|tấn|lần|điểm|phiên|tháng|năm)",
            Pattern.CASE_INSENSITIVE);

    // ---------------------------------------------------------------------
    // FETCH RSS
    // ---------------------------------------------------------------------

    public List<NewsDto> fetchAndProcessNews() {
        List<NewsDto> newsList = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(RSS_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .parser(org.jsoup.parser.Parser.xmlParser())
                    .get();

            // Tên nguồn lấy động từ thẻ <channel><title> của chính feed
            String source = doc.select("channel > title").first() != null
                    ? doc.select("channel > title").first().text().replace(" RSS", "").trim()
                    : DEFAULT_SOURCE;
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
                String ticker = detectTicker(title, fullText);
                int score = scoreSentiment(title, cleanSummary);
                String sentiment = classifySentiment(score);
                List<String> keywords = extractKeywords(fullText, ticker);

                // ID ổn định: ưu tiên guid của feed, sau đó tới link, cuối cùng là title
                String identity = firstNonBlank(guid, link, title);
                String stableId = String.valueOf(identity.trim().hashCode() & 0x7fffffff);

                NewsDto dto = NewsDto.builder()
                        .id(stableId)
                        .ticker(ticker)
                        .title(title)
                        .link(link)
                        .source(source)
                        .publishedDate(formatPublishedDate(pubDate))
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
            // Trả về DTO rỗng để bên dưới tự bổ sung dữ liệu bóc tách Rule-based
            aiAnalysis = new NewsDetailDto();
        }

        // 3. Đảm bảo gán lại thông tin cơ bản từ RSS
        aiAnalysis.setId(matchedNews.getId());
        aiAnalysis.setTicker(matchedNews.getTicker());
        aiAnalysis.setTitle(matchedNews.getTitle());
        aiAnalysis.setLink(matchedNews.getLink());
        aiAnalysis.setSource(matchedNews.getSource());
        aiAnalysis.setPublishedDate(matchedNews.getPublishedDate());

        // Nếu Gemini không trả về aiSummary hoặc rỗng, dùng aiSummary cào từ RSS
        if (aiAnalysis.getAiSummary() == null || aiAnalysis.getAiSummary().isEmpty()) {
            aiAnalysis.setAiSummary(matchedNews.getAiSummary());
        }

        // 4. Bổ sung/Enrichment dữ liệu bóc tách Rule-based (không làm ghi đè dữ liệu biểu đồ sẵn có từ Gemini)
        enrichWithRuleBasedInsights(matchedNews, aiAnalysis);

        return aiAnalysis;
    }

    /**
     * Bóc tách thêm các trường ngắn gọn (Key Takeaways, Con số/Mức giá nổi bật, Radar/Aspect)
     * phòng trường hợp Gemini chưa trả về hoặc cần đúc kết nhanh.
     * Mọi con số ở đây đều suy ra từ nội dung bài báo, không gán cứng.
     */
    private void enrichWithRuleBasedInsights(NewsDto matchedNews, NewsDetailDto detail) {
        String title = matchedNews.getTitle();
        String summary = matchedNews.getAiSummary() != null ? matchedNews.getAiSummary() : "";
        String fullText = title + ". " + summary;
        String normalized = normalize(fullText);

        // A. Sentiment: nếu Gemini không trả về thì dùng điểm chấm từ chính nội dung tin
        if (detail.getSentimentType() == null || detail.getSentimentType().isBlank()) {
            detail.setSentimentType(matchedNews.getSentimentType());
        }
        if (detail.getSentimentScore() <= 0) {
            detail.setSentimentScore(matchedNews.getSentimentScore());
        }
        if (detail.getKeywords() == null || detail.getKeywords().isEmpty()) {
            detail.setKeywords(matchedNews.getKeywords());
        }

        // B. Bóc tách Key Takeaways (Chia câu ngắn gọn để làm bullet points)
        if (detail.getKeyEvents() == null || detail.getKeyEvents().isEmpty()) {
            List<String> points = new ArrayList<>();
            for (String s : summary.split("(?<=[.?!])\\s+")) {
                String trimmed = s.trim();
                if (trimmed.length() > 15) {
                    points.add(trimmed);
                }
                if (points.size() >= 4) {
                    break;
                }
            }
            if (points.isEmpty()) {
                points.add(title);
            }
            detail.setKeyEvents(points);
        }

        // C. Bóc tách Con số / Mức giá ghi nhận bằng Regex (VD: 55.000–80.000 đồng, 190.000đ, 4%...)
        if (detail.getEntryZone() == null || detail.getEntryZone().isEmpty()) {
            List<String> figures = extractFigures(fullText);
            if (!figures.isEmpty()) {
                detail.setEntryZone("Ghi nhận mốc: " + String.join(", ", figures.stream().limit(3).toList()));
            } else {
                detail.setEntryZone("Bài viết không đề cập con số định lượng");
            }
        }

        // D. Radar Metrics suy ra từ tín hiệu ngôn ngữ của chính bài báo
        if (detail.getRadarMetrics() == null || detail.getRadarMetrics().isEmpty()) {
            Map<String, Integer> metrics = new LinkedHashMap<>();
            metrics.put("Biến động giá",
                    clamp(50 + (hits(normalized, PRICE_UP) - hits(normalized, PRICE_DOWN)) * 12, 10, 95));
            metrics.put("Nguồn cung",
                    clamp(60 + (hits(normalized, SUPPLY_LOOSE) - hits(normalized, SUPPLY_TIGHT)) * 15, 15, 95));
            metrics.put("Nhu cầu thị trường",
                    clamp(60 + (hits(normalized, DEMAND_UP) - hits(normalized, DEMAND_DOWN)) * 15, 15, 95));
            metrics.put("Rủi ro ngành",
                    clamp(25 + hits(normalized, RISKS) * 15 + hits(normalized, NEGATIVE) * 5, 10, 95));
            detail.setRadarMetrics(metrics);
        }

        // E. Cơ cấu tâm lý thị trường suy ra từ điểm sentiment đã chấm
        if (detail.getSentimentBreakdown() == null || detail.getSentimentBreakdown().isEmpty()) {
            int positive = clamp(detail.getSentimentScore(), 5, 95);
            int negative = clamp((int) Math.round((100 - positive) * 0.6), 3, 95);
            int neutral = Math.max(0, 100 - positive - negative);
            Map<String, Integer> breakdown = new LinkedHashMap<>();
            breakdown.put("Tích cực", positive);
            breakdown.put("Trung tính", neutral);
            breakdown.put("Tiêu cực", negative);
            detail.setSentimentBreakdown(breakdown);
        }
    }

    // ---------------------------------------------------------------------
    // CÁC HÀM BÓC TÁCH
    // ---------------------------------------------------------------------

    /**
     * Ưu tiên: mã cổ phiếu viết hoa trong tiêu đề -> tên doanh nghiệp -> ngành -> VĨ MÔ.
     */
    private String detectTicker(String title, String fullText) {
        Matcher upper = UPPERCASE_TOKEN.matcher(title);
        while (upper.find()) {
            if (KNOWN_TICKERS.contains(upper.group())) {
                return upper.group();
            }
        }

        String normalized = normalize(fullText);

        for (Term company : COMPANIES) {
            if (company.pattern().matcher(normalized).find()) {
                return company.label();
            }
        }

        for (Term sector : SECTORS) {
            if (sector.pattern().matcher(normalized).find()) {
                return sector.label();
            }
        }

        return "VĨ MÔ";
    }

    /**
     * Chấm điểm tâm lý 0-100 dựa trên từ điển tích cực/tiêu cực.
     * Tiêu đề được nhân đôi trọng số vì phản ánh thông điệp chính của bài.
     */
    private int scoreSentiment(String title, String summary) {
        String normTitle = normalize(title);
        String normSummary = normalize(summary);

        int positive = hits(normTitle, POSITIVE) * 2 + hits(normSummary, POSITIVE);
        int negative = hits(normTitle, NEGATIVE) * 2 + hits(normSummary, NEGATIVE);

        return clamp(50 + (positive - negative) * 7, 5, 95);
    }

    private String classifySentiment(int score) {
        if (score >= 60) return "POSITIVE";
        if (score <= 40) return "NEGATIVE";
        return "NEUTRAL";
    }

    /**
     * Keywords = mã/ngành + chủ đề kinh tế nhận diện được + từ khoá cảm xúc + con số nổi bật.
     */
    private List<String> extractKeywords(String fullText, String ticker) {
        String normalized = normalize(fullText);
        LinkedHashSet<String> keywords = new LinkedHashSet<>();

        keywords.add(ticker);
        keywords.addAll(matchedLabels(normalized, TOPICS));
        keywords.addAll(matchedLabels(normalized, POSITIVE));
        keywords.addAll(matchedLabels(normalized, NEGATIVE));

        for (String figure : extractFigures(fullText)) {
            if (keywords.size() >= 6) break;
            keywords.add(figure);
        }

        return keywords.stream().limit(6).toList();
    }

    /** Trích các con số/mức giá có đơn vị, đã loại trùng. */
    private List<String> extractFigures(String text) {
        LinkedHashSet<String> figures = new LinkedHashSet<>();
        Matcher matcher = FIGURE_PATTERN.matcher(text);
        while (matcher.find()) {
            figures.add(matcher.group().trim());
        }
        return new ArrayList<>(figures);
    }

    /** Chuyển pubDate RFC-1123 của RSS thành mốc thời gian tương đối dễ đọc. */
    private String formatPublishedDate(String pubDate) {
        if (pubDate == null || pubDate.isBlank()) {
            return "Mới cập nhật";
        }
        try {
            ZonedDateTime published = ZonedDateTime.parse(pubDate.trim(), DateTimeFormatter.RFC_1123_DATE_TIME);
            Duration elapsed = Duration.between(published, ZonedDateTime.now(published.getZone()));

            long minutes = elapsed.toMinutes();
            if (minutes < 1) return "Vừa xong";
            if (minutes < 60) return minutes + " phút trước";

            long hours = elapsed.toHours();
            if (hours < 24) return hours + " giờ trước";

            long days = elapsed.toDays();
            if (days <= 7) return days + " ngày trước";

            return published.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        } catch (Exception e) {
            return pubDate;
        }
    }

    // ---------------------------------------------------------------------
    // TIỆN ÍCH
    // ---------------------------------------------------------------------

    private static Term t(String keyword, String label) {
        return t(keyword, label, 1);
    }

    private static Term t(String keyword, String label, int weight) {
        return new Term(Pattern.compile("\\b" + Pattern.quote(keyword) + "\\b"), label, weight);
    }

    /** Dùng khi cần regex thủ công (loại trừ từ đồng âm sau khi bỏ dấu). */
    private static Term tRaw(String regex, String label, int weight) {
        return new Term(Pattern.compile(regex), label, weight);
    }

    /** Tổng trọng số các từ khoá xuất hiện trong đoạn text đã normalize. */
    private int hits(String normalizedText, List<Term> terms) {
        int total = 0;
        for (Term term : terms) {
            if (term.pattern().matcher(normalizedText).find()) {
                total += term.weight();
            }
        }
        return total;
    }

    /** Danh sách nhãn hiển thị của các từ khoá khớp được. */
    private List<String> matchedLabels(String normalizedText, List<Term> terms) {
        List<String> labels = new ArrayList<>();
        for (Term term : terms) {
            if (!term.label().isEmpty() && term.pattern().matcher(normalizedText).find()) {
                labels.add(term.label());
            }
        }
        return labels;
    }

    /** Bỏ dấu tiếng Việt + lowercase để so khớp từ khoá ổn định. */
    private String normalize(String text) {
        if (text == null) return "";
        String lower = text.toLowerCase(Locale.ROOT).replace('đ', 'd');
        return Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("\\s+", " ");
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
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
