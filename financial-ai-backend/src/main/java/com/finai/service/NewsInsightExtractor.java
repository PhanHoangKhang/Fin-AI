package com.finai.service;

import com.finai.dto.NewsDetailDto;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Bóc tách thông tin đầu tư từ NỘI DUNG THẬT của bài báo (tiêu đề + tóm tắt RSS).
 *
 * Toàn bộ số liệu/nhận định sinh ra ở đây đều suy ra từ từ khoá, con số và sắc thái
 * ngôn ngữ có trong bài — không dùng dữ liệu mock cố định.
 *
 * Được dùng ở 2 nơi:
 *  - {@link NewsService}: chấm điểm & gắn tag cho danh sách tin.
 *  - {@link GeminiService}: dựng báo cáo thay thế khi không gọi được Gemini.
 */
@Service
public class NewsInsightExtractor {

    /** Một từ khoá nhận diện: pattern (đã bỏ dấu), nhãn hiển thị, trọng số. */
    private record Term(Pattern pattern, String label, int weight) {}

    /** Toàn bộ tín hiệu bóc tách được của một bài báo. */
    private record Signals(
            String title,
            String summary,
            String fullText,
            String ticker,
            int score,
            String sentimentType,
            List<String> positives,
            List<String> negatives,
            List<String> risks,
            List<String> topics,
            List<String> figures,
            int priceMomentum,
            int supply,
            int demand,
            int riskLevel
    ) {}

    // ---------------------------------------------------------------------
    // TỪ ĐIỂN (key viết KHÔNG DẤU vì text được normalize trước khi so khớp)
    // ---------------------------------------------------------------------

    private static final List<Term> COMPANIES = List.of(
            t("hoa phat", "HPG"), t("vinamilk", "VNM"), t("vingroup", "VIC"),
            t("vinhomes", "VHM"), t("vincom", "VRE"), t("vietcombank", "VCB"),
            t("vietinbank", "CTG"), t("techcombank", "TCB"), t("vpbank", "VPB"),
            t("sacombank", "STB"), t("bidv", "BID"), t("mbbank", "MBB"),
            t("the gioi di dong", "MWG"), t("fpt", "FPT"), t("masan", "MSN"),
            t("sabeco", "SAB"), t("petrolimex", "PLX"), t("pv gas", "GAS"),
            t("novaland", "NVL"), t("vietjet", "VJC"), t("vietnam airlines", "HVN"),
            t("hoa sen", "HSG"), t("nam kim", "NKG"), t("gelex", "GEX"),
            t("dam phu my", "DPM"), t("bao viet", "BVH"), t("vicostone", "VCS"),
            t("dat xanh", "DXG"), t("khang dien", "KDH")
    );

    private static final List<String> KNOWN_TICKERS = List.of(
            "HPG", "VNM", "VIC", "VHM", "VRE", "VCB", "CTG", "TCB", "VPB", "STB",
            "BID", "MBB", "MWG", "FPT", "MSN", "SAB", "PLX", "GAS", "NVL", "VJC",
            "HVN", "HSG", "NKG", "GEX", "DPM", "ACB", "SSI", "VND", "HCM", "VCI",
            "REE", "PNJ", "DGC", "DCM", "POW", "BVH", "VCS", "DXG", "KDH", "PDR"
    );
    private static final Pattern UPPERCASE_TOKEN = Pattern.compile("\\b[A-Z]{3}\\b");

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

    /** Các chủ đề mang tính vĩ mô, dùng để dựng phần macroImpact. */
    private static final List<String> MACRO_TOPICS = List.of(
            "Lãi suất", "Lạm phát", "Tỷ giá", "Tín dụng", "Thuế quan", "GDP", "CPI",
            "FDI", "Đầu tư công", "Suy thoái", "Xuất khẩu", "Nhập khẩu", "Pháp lý", "Hạ tầng"
    );

    private static final List<Term> POSITIVE = List.of(
            t("tang truong", "Tăng trưởng", 2), t("tang", "Tăng giá", 1), t("ky luc", "Kỷ lục", 2),
            t("phuc hoi", "Phục hồi", 2), t("but pha", "Bứt phá", 2), t("khoi sac", "Khởi sắc", 2),
            t("cai thien", "Cải thiện", 2), t("huong loi", "Hưởng lợi", 2), t("mua rong", "Mua ròng", 2),
            t("lai lon", "Lãi lớn", 2), t("lai rong", "Lãi ròng", 1), t("bao lai", "Báo lãi", 2),
            t("vuot", "Vượt kế hoạch", 1), t("mo rong", "Mở rộng", 1), t("hut von", "Hút vốn", 1),
            t("dan dau", "Dẫn đầu", 1), t("uu dai", "Ưu đãi", 1), t("kich cau", "Kích cầu", 1),
            t("thang du", "Thặng dư", 2), t("giam lai suat", "Giảm lãi suất", 2),
            t("giam chi phi", "Giảm chi phí", 2), t("giam thue", "Giảm thuế", 2),
            t("giam lo", "Giảm lỗ", 2)
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
            t("cang thang", "Căng thẳng"), t("thien tai", "Thiên tai")
    );

    private static final List<Term> PRICE_UP = List.of(
            t("tang gia", "", 2), t("tang", "", 1), t("but pha", "", 2), t("lap dinh", "", 2),
            t("ky luc", "", 2), t("dat dinh", "", 2), t("gap doi", "", 2), t("leo thang", "", 2)
    );
    private static final List<Term> PRICE_DOWN = List.of(
            t("giam gia", "", 2), tRaw("\\bgiam\\b(?!\\s+(doc|sat|dinh|khao|ho))", "", 1),
            t("lao doc", "", 2), t("sut giam", "", 2), t("roi xuong", "", 2),
            t("cham day", "", 2), t("mat gia", "", 2)
    );

    private static final List<Term> SUPPLY_TIGHT = List.of(
            t("thieu hut", "Thiếu hụt nguồn cung"), t("khan hiem", "Khan hiếm"),
            t("mat mua", "Mất mùa"), t("gian doan", "Gián đoạn chuỗi cung ứng"),
            t("cat giam san luong", "Cắt giảm sản lượng"), t("han che xuat khau", "Hạn chế xuất khẩu")
    );
    private static final List<Term> SUPPLY_LOOSE = List.of(
            t("du cung", "Dư cung"), t("ton kho", "Tồn kho cao"), t("san luong tang", "Sản lượng tăng"),
            t("doi dao", "Nguồn cung dồi dào"), t("duoc mua", "Được mùa"),
            t("nguon cung tang", "Nguồn cung tăng")
    );

    private static final List<Term> DEMAND_UP = List.of(
            t("nhu cau tang", "Nhu cầu tăng"), t("tieu thu manh", "Tiêu thụ mạnh"),
            t("don hang", "Đơn hàng mới"), t("suc mua tang", "Sức mua tăng"),
            t("hut khach", "Hút khách"), t("chay hang", "Cháy hàng"), t("dat mua", "Đặt mua tăng")
    );
    private static final List<Term> DEMAND_DOWN = List.of(
            t("e am", "Tiêu thụ ế ẩm"), t("tieu thu cham", "Tiêu thụ chậm"),
            t("suc mua yeu", "Sức mua yếu"), t("that chat chi tieu", "Thắt chặt chi tiêu"),
            t("giam tieu dung", "Giảm tiêu dùng"), t("vang khach", "Vắng khách")
    );

    private static final Pattern FIGURE_PATTERN = Pattern.compile(
            "((?:\\d+(?:[.,]\\d+)*)\\s*[-–]\\s*)?(\\d+(?:[.,]\\d+)*)\\s*"
            + "(%|nghìn tỷ đồng|nghìn tỷ|tỷ USD|triệu USD|tỷ đồng|triệu đồng|nghìn đồng|"
            + "tỷ|triệu|nghìn|đồng|USD|kg|tấn|lần|điểm|phiên|tháng|năm)",
            Pattern.CASE_INSENSITIVE);

    // =====================================================================
    // API CÔNG KHAI
    // =====================================================================

    /**
     * Dựng báo cáo phân tích hoàn chỉnh CHỈ từ nội dung bài báo.
     * Dùng làm phương án thay thế khi Gemini không khả dụng.
     */
    public NewsDetailDto buildAnalysis(String title, String summary, String ticker) {
        NewsDetailDto detail = new NewsDetailDto();
        enrich(title, summary, ticker, detail);
        return detail;
    }

    /**
     * Điền các trường còn trống của {@code detail} bằng dữ liệu bóc tách từ bài báo.
     * Không ghi đè bất kỳ trường nào Gemini đã trả về.
     */
    public void enrich(String title, String summary, String ticker, NewsDetailDto detail) {
        Signals s = analyze(title, summary, ticker);

        if (isBlank(detail.getSentimentType())) {
            detail.setSentimentType(s.sentimentType());
        }
        if (detail.getSentimentScore() <= 0) {
            detail.setSentimentScore(s.score());
        }
        if (isBlank(detail.getAiSummary())) {
            detail.setAiSummary(s.summary());
        }
        if (isBlank(detail.getMarketContext())) {
            detail.setMarketContext(buildMarketContext(s));
        }
        if (isBlank(detail.getInvestorAction())) {
            detail.setInvestorAction(buildInvestorAction(s));
        }
        if (isBlank(detail.getReasoning())) {
            detail.setReasoning(buildReasoning(s));
        }
        if (isBlank(detail.getCatalystAnalysis())) {
            detail.setCatalystAnalysis(buildCatalysts(s));
        }
        if (isBlank(detail.getRiskAnalysis())) {
            detail.setRiskAnalysis(buildRisks(s));
        }
        if (isBlank(detail.getMacroImpact())) {
            detail.setMacroImpact(buildMacroImpact(s));
        }
        if (isBlank(detail.getImpactAnalysis())) {
            detail.setImpactAnalysis(buildImpactAnalysis(s));
        }
        if (isBlank(detail.getShortTermStrategy())) {
            detail.setShortTermStrategy(buildShortTerm(s));
        }
        if (isBlank(detail.getMediumTermStrategy())) {
            detail.setMediumTermStrategy(buildMediumTerm(s));
        }
        if (isBlank(detail.getLongTermStrategy())) {
            detail.setLongTermStrategy(buildLongTerm(s));
        }
        if (isBlank(detail.getEntryZone())) {
            detail.setEntryZone(buildEntryZone(s));
        }
        if (isBlank(detail.getTargetPrice())) {
            detail.setTargetPrice(buildTargetPrice(s));
        }
        if (isBlank(detail.getStopLossZone())) {
            detail.setStopLossZone(buildStopLoss(s));
        }
        if (isEmpty(detail.getKeyEvents())) {
            detail.setKeyEvents(buildKeyEvents(s));
        }
        if (isEmpty(detail.getKeywords())) {
            detail.setKeywords(extractKeywords(s.fullText(), s.ticker()));
        }
        if (isEmpty(detail.getRadarMetrics())) {
            detail.setRadarMetrics(buildRadarMetrics(s));
        }
        if (isEmpty(detail.getSentimentBreakdown())) {
            detail.setSentimentBreakdown(buildSentimentBreakdown(detail.getSentimentScore()));
        }
        if (isEmpty(detail.getTechnicalSignals())) {
            detail.setTechnicalSignals(buildSignalStrength(s));
        }
        if (isEmpty(detail.getTimelineGrowthData())) {
            detail.setTimelineGrowthData(buildOutlookTimeline(s));
        }
        if (isEmpty(detail.getChartData())) {
            detail.setChartData(buildOverviewChart(s));
        }
    }

    /** Ưu tiên: mã CK viết hoa trong tiêu đề -> tên doanh nghiệp -> ngành -> VĨ MÔ. */
    public String detectTicker(String title, String fullText) {
        Matcher upper = UPPERCASE_TOKEN.matcher(title == null ? "" : title);
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
     * Chấm điểm tâm lý 0-100 từ từ điển tích cực/tiêu cực.
     * Tiêu đề nhân đôi trọng số vì phản ánh thông điệp chính của bài.
     */
    public int scoreSentiment(String title, String summary) {
        String normTitle = normalize(title);
        String normSummary = normalize(summary);
        int positive = hits(normTitle, POSITIVE) * 2 + hits(normSummary, POSITIVE);
        int negative = hits(normTitle, NEGATIVE) * 2 + hits(normSummary, NEGATIVE);
        return clamp(50 + (positive - negative) * 7, 5, 95);
    }

    public String classifySentiment(int score) {
        if (score >= 60) return "POSITIVE";
        if (score <= 40) return "NEGATIVE";
        return "NEUTRAL";
    }

    /** Keywords = mã/ngành + chủ đề kinh tế + từ khoá sắc thái + con số nổi bật. */
    public List<String> extractKeywords(String fullText, String ticker) {
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
    public List<String> extractFigures(String text) {
        LinkedHashSet<String> figures = new LinkedHashSet<>();
        if (text == null) return new ArrayList<>();
        Matcher matcher = FIGURE_PATTERN.matcher(text);
        while (matcher.find()) {
            figures.add(matcher.group().trim());
        }
        return new ArrayList<>(figures);
    }

    /** Chuyển pubDate RFC-1123 của RSS thành mốc thời gian tương đối dễ đọc. */
    public String formatPublishedDate(String pubDate) {
        if (isBlank(pubDate)) {
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

    // =====================================================================
    // PHÂN TÍCH TÍN HIỆU
    // =====================================================================

    private Signals analyze(String title, String summary, String ticker) {
        String safeTitle = title == null ? "" : title.trim();
        String safeSummary = (summary == null || summary.isBlank()) ? safeTitle : summary.trim();
        String fullText = safeTitle + ". " + safeSummary;
        String normalized = normalize(fullText);

        String resolvedTicker = isBlank(ticker) ? detectTicker(safeTitle, fullText) : ticker;
        int score = scoreSentiment(safeTitle, safeSummary);

        int priceMomentum = clamp(50 + (hits(normalized, PRICE_UP) - hits(normalized, PRICE_DOWN)) * 12, 10, 95);
        int supply = clamp(60 + (hits(normalized, SUPPLY_LOOSE) - hits(normalized, SUPPLY_TIGHT)) * 15, 15, 95);
        int demand = clamp(60 + (hits(normalized, DEMAND_UP) - hits(normalized, DEMAND_DOWN)) * 15, 15, 95);
        int riskLevel = clamp(25 + hits(normalized, RISKS) * 15 + hits(normalized, NEGATIVE) * 5, 10, 95);

        return new Signals(
                safeTitle,
                safeSummary,
                fullText,
                resolvedTicker,
                score,
                classifySentiment(score),
                matchedLabels(normalized, POSITIVE),
                matchedLabels(normalized, NEGATIVE),
                matchedLabels(normalized, RISKS),
                matchedLabels(normalized, TOPICS),
                extractFigures(fullText),
                priceMomentum,
                supply,
                demand,
                riskLevel
        );
    }

    // =====================================================================
    // SINH NỘI DUNG TỪ TÍN HIỆU
    // =====================================================================

    private String buildMarketContext(Signals s) {
        StringBuilder sb = new StringBuilder();
        sb.append("Tin thuộc nhóm ").append(s.ticker())
          .append(", sắc thái ").append(sentimentLabel(s.sentimentType()))
          .append(" với điểm tác động ").append(s.score()).append("/100. ");

        if (!s.topics().isEmpty()) {
            sb.append("Chủ đề kinh tế nhận diện được: ").append(join(s.topics(), 4)).append(". ");
        } else {
            sb.append("Bài viết thiên về thông tin sự kiện, chưa gắn với chỉ báo kinh tế cụ thể. ");
        }

        if (!s.figures().isEmpty()) {
            sb.append("Số liệu định lượng trong bài: ").append(join(s.figures(), 3)).append(".");
        } else {
            sb.append("Bài viết chưa cung cấp số liệu định lượng để đối chiếu.");
        }
        return sb.toString();
    }

    private String buildInvestorAction(Signals s) {
        String base;
        if (s.score() >= 70) {
            base = "Thông tin ủng hộ xu hướng tích cực cho nhóm " + s.ticker()
                    + ". Có thể cân nhắc giải ngân từng phần, ưu tiên các nhịp điều chỉnh thay vì mua đuổi.";
        } else if (s.score() >= 60) {
            base = "Tin nghiêng về hướng tích cực cho nhóm " + s.ticker()
                    + " nhưng chưa đủ mạnh để hành động ngay; nên theo dõi thêm dòng tiền xác nhận.";
        } else if (s.score() > 40) {
            base = "Tin mang tính trung tính với nhóm " + s.ticker()
                    + ". Ưu tiên giữ nguyên trạng thái danh mục và chờ thông tin cụ thể hơn.";
        } else if (s.score() > 25) {
            base = "Tin bất lợi cho nhóm " + s.ticker()
                    + ". Nên hạ tỷ trọng ở các nhịp hồi và hạn chế mở vị thế mới.";
        } else {
            base = "Tin tiêu cực rõ rệt với nhóm " + s.ticker()
                    + ". Ưu tiên bảo toàn vốn, chỉ xem xét trở lại khi có tín hiệu ổn định.";
        }

        if (!s.risks().isEmpty()) {
            base += " Lưu ý các cảnh báo xuất hiện trong bài: " + join(s.risks(), 3) + ".";
        }
        return base;
    }

    private String buildReasoning(Signals s) {
        List<String> bullets = new ArrayList<>();
        bullets.add("• Nội dung chính: " + firstSentence(s.summary()));

        if (!s.positives().isEmpty()) {
            bullets.add("• Tín hiệu tích cực trong bài: " + join(s.positives(), 4) + ".");
        }
        if (!s.negatives().isEmpty()) {
            bullets.add("• Tín hiệu tiêu cực trong bài: " + join(s.negatives(), 4) + ".");
        }
        if (s.positives().isEmpty() && s.negatives().isEmpty()) {
            bullets.add("• Bài viết dùng ngôn ngữ trung tính, không có từ khoá định hướng tăng/giảm rõ ràng.");
        }
        if (!s.figures().isEmpty()) {
            bullets.add("• Dữ liệu định lượng làm cơ sở: " + join(s.figures(), 4) + ".");
        }
        bullets.add("• Kết luận: tổng hợp các tín hiệu trên cho điểm tác động "
                + s.score() + "/100, tương ứng sắc thái " + sentimentLabel(s.sentimentType()) + ".");

        return String.join("\n", bullets);
    }

    private String buildCatalysts(Signals s) {
        List<String> bullets = new ArrayList<>();
        for (String label : s.positives().stream().limit(3).toList()) {
            bullets.add("• " + label + ": được nhắc trực tiếp trong nội dung tin.");
        }
        if (s.demand() >= 70) {
            bullets.add("• Phía cầu: bài viết ghi nhận tín hiệu tiêu thụ/sức mua cải thiện.");
        }
        if (s.supply() <= 45) {
            bullets.add("• Phía cung: nguồn cung eo hẹp có thể hỗ trợ mặt bằng giá.");
        }
        if (s.priceMomentum() >= 70) {
            bullets.add("• Xung lực giá: các từ khoá trong bài mô tả xu hướng đi lên.");
        }
        if (bullets.isEmpty()) {
            bullets.add("• Chưa ghi nhận động lực tăng giá rõ ràng từ nội dung tin.");
            bullets.add("• Cần bổ sung dữ liệu kết quả kinh doanh hoặc dòng tiền để đánh giá đầy đủ.");
        }
        return String.join("\n", bullets);
    }

    private String buildRisks(Signals s) {
        List<String> bullets = new ArrayList<>();
        for (String label : s.risks().stream().limit(3).toList()) {
            bullets.add("• " + label + ": xuất hiện trong nội dung tin, cần theo dõi.");
        }
        for (String label : s.negatives().stream().limit(2).toList()) {
            bullets.add("• Yếu tố bất lợi: " + label + ".");
        }
        if (s.supply() >= 75) {
            bullets.add("• Nguồn cung dồi dào có thể tạo áp lực lên giá bán.");
        }
        if (s.demand() <= 45) {
            bullets.add("• Sức cầu yếu là rủi ro chính với doanh thu ngắn hạn.");
        }
        if (bullets.isEmpty()) {
            bullets.add("• Bài viết không nêu cảnh báo rủi ro trực tiếp.");
        }
        bullets.add("• Lưu ý: đây là kết quả bóc tách tự động từ nội dung báo chí, "
                + "chưa thay thế báo cáo phân tích có dữ liệu tài chính doanh nghiệp.");
        return String.join("\n", bullets);
    }

    private String buildMacroImpact(Signals s) {
        List<String> macro = s.topics().stream().filter(MACRO_TOPICS::contains).limit(4).toList();
        if (macro.isEmpty()) {
            return "• Tin ở cấp độ doanh nghiệp/ngành, chưa ghi nhận yếu tố vĩ mô trực tiếp.\n"
                    + "• Tác động tới thị trường chung nhiều khả năng ở mức hạn chế.";
        }
        List<String> bullets = new ArrayList<>();
        for (String topic : macro) {
            bullets.add("• " + topic + ": được đề cập trong bài và là kênh lan truyền tác động chính.");
        }
        bullets.add("• Mức độ ảnh hưởng vĩ mô ước tính " + s.riskLevel() + "/100 theo cường độ từ khoá rủi ro.");
        return String.join("\n", bullets);
    }

    private String buildImpactAnalysis(Signals s) {
        String breadth = s.topics().size() >= 3 ? "diện rộng"
                : (s.topics().size() >= 1 ? "khu trú trong ngành" : "hẹp, mang tính sự kiện đơn lẻ");
        return "Phạm vi ảnh hưởng " + breadth + " với nhóm " + s.ticker()
                + ". Xung lực giá " + s.priceMomentum() + "/100, sức cầu " + s.demand()
                + "/100, mức rủi ro " + s.riskLevel() + "/100.";
    }

    private String buildShortTerm(Signals s) {
        String action;
        if (s.score() >= 70) {
            action = "Thăm dò tỷ trọng nhỏ khi giá điều chỉnh về vùng hỗ trợ.";
        } else if (s.score() >= 60) {
            action = "Quan sát, chỉ vào lệnh khi thanh khoản xác nhận xu hướng.";
        } else if (s.score() > 40) {
            action = "Đứng ngoài, chờ tin tức rõ ràng hơn.";
        } else {
            action = "Hạn chế mở vị thế mới, ưu tiên giữ tiền mặt.";
        }
        String basis = s.figures().isEmpty()
                ? "Bài viết không có mốc giá cụ thể nên chưa xác định được điểm vào theo phân tích kỹ thuật."
                : "Tham chiếu các mốc số liệu trong bài: " + join(s.figures(), 3) + ".";
        return "• Hành động: " + action + "\n• Cơ sở: " + basis;
    }

    private String buildMediumTerm(Signals s) {
        String action = s.score() >= 60
                ? "Cân nhắc gia tăng tỷ trọng nếu xu hướng trong tin được xác nhận bằng kết quả kinh doanh."
                : (s.score() > 40
                    ? "Duy trì tỷ trọng hiện tại và theo dõi diễn biến ngành."
                    : "Giảm dần tỷ trọng, chờ điểm cân bằng mới.");
        return "• Hành động: " + action
                + "\n• Luận điểm: xung lực giá " + s.priceMomentum() + "/100, sức cầu " + s.demand()
                + "/100 và nguồn cung " + s.supply() + "/100 theo tín hiệu bóc tách từ bài viết.";
    }

    private String buildLongTerm(Signals s) {
        String action = s.riskLevel() >= 60
                ? "Chỉ tích sản khi mức rủi ro ngành hạ nhiệt."
                : "Có thể tích sản dần nếu doanh nghiệp/ngành duy trì được nền tảng cơ bản.";
        String context = s.topics().isEmpty()
                ? "Tin chưa gắn với chủ đề cấu trúc dài hạn."
                : "Chủ đề dài hạn liên quan: " + join(s.topics(), 3) + ".";
        return "• Hành động: " + action + "\n• Luận điểm: " + context
                + " Mức rủi ro ước tính " + s.riskLevel() + "/100.";
    }

    private String buildEntryZone(Signals s) {
        if (s.figures().isEmpty()) {
            return "Bài viết không đề cập con số định lượng";
        }
        return "Ghi nhận mốc: " + join(s.figures(), 3);
    }

    private String buildTargetPrice(Signals s) {
        if (s.figures().isEmpty()) {
            return "Chưa đủ dữ liệu giá để đặt mục tiêu";
        }
        String reference = s.figures().get(s.figures().size() - 1);
        if (s.score() >= 60) {
            return "Kịch bản tích cực: bám mốc " + reference + " nêu trong bài";
        }
        if (s.score() > 40) {
            return "Kịch bản trung tính: dao động quanh mốc " + reference;
        }
        return "Kịch bản thận trọng: rủi ro lùi khỏi mốc " + reference;
    }

    private String buildStopLoss(Signals s) {
        if (!s.risks().isEmpty()) {
            return "Xem lại vị thế nếu leo thang: " + join(s.risks(), 2);
        }
        if (s.score() <= 40) {
            return "Ngưỡng chịu đựng thấp do sắc thái tin tiêu cực";
        }
        return "Chưa có ngưỡng giá cụ thể — quản trị theo kỷ luật vốn";
    }

    private List<String> buildKeyEvents(Signals s) {
        List<String> points = new ArrayList<>();
        for (String sentence : s.summary().split("(?<=[.?!])\\s+")) {
            String trimmed = sentence.trim();
            if (trimmed.length() > 15) {
                points.add(trimmed);
            }
            if (points.size() >= 4) break;
        }
        if (points.isEmpty()) {
            points.add(s.title());
        }
        return points;
    }

    private Map<String, Integer> buildRadarMetrics(Signals s) {
        Map<String, Integer> metrics = new LinkedHashMap<>();
        metrics.put("Biến động giá", s.priceMomentum());
        metrics.put("Nguồn cung", s.supply());
        metrics.put("Nhu cầu thị trường", s.demand());
        metrics.put("Rủi ro ngành", s.riskLevel());
        metrics.put("Mức tác động tin", s.score());
        return metrics;
    }

    private Map<String, Integer> buildSentimentBreakdown(int score) {
        int positive = clamp(score, 5, 95);
        int negative = clamp((int) Math.round((100 - positive) * 0.6), 3, 95);
        int neutral = Math.max(0, 100 - positive - negative);
        Map<String, Integer> breakdown = new LinkedHashMap<>();
        breakdown.put("Tích cực", positive);
        breakdown.put("Trung tính", neutral);
        breakdown.put("Tiêu cực", negative);
        return breakdown;
    }

    /** Cường độ tín hiệu đo trực tiếp trên nội dung bài (không phải chỉ báo giá). */
    private Map<String, Integer> buildSignalStrength(Signals s) {
        Map<String, Integer> signals = new LinkedHashMap<>();
        signals.put("Cường độ tin tích cực", clamp(s.positives().size() * 22, 5, 100));
        signals.put("Cường độ tin tiêu cực", clamp(s.negatives().size() * 22, 5, 100));
        signals.put("Độ định lượng dữ liệu", clamp(s.figures().size() * 25, 5, 100));
        signals.put("Độ phủ chủ đề kinh tế", clamp(s.topics().size() * 20, 5, 100));
        return signals;
    }

    /** Kịch bản xung lực theo khung thời gian, nội suy từ điểm tác động và mức rủi ro. */
    private Map<String, Integer> buildOutlookTimeline(Signals s) {
        int now = s.score();
        int momentumDrift = (s.priceMomentum() - 50) / 5;
        int riskDrag = (s.riskLevel() - 50) / 5;

        Map<String, Integer> timeline = new LinkedHashMap<>();
        timeline.put("Hiện tại", now);
        timeline.put("Ngắn hạn (T+)", clamp(now + momentumDrift, 5, 95));
        timeline.put("Trung hạn (3-6T)", clamp(now + momentumDrift - riskDrag, 5, 95));
        timeline.put("Dài hạn (1-3N)", clamp((now + 55) / 2 - riskDrag, 5, 95));
        return timeline;
    }

    private Map<String, Integer> buildOverviewChart(Signals s) {
        Map<String, Integer> chart = new LinkedHashMap<>();
        chart.put("Tác động tin", s.score());
        chart.put("Xung lực giá", s.priceMomentum());
        chart.put("Sức cầu", s.demand());
        chart.put("Rủi ro", s.riskLevel());
        return chart;
    }

    // =====================================================================
    // TIỆN ÍCH
    // =====================================================================

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
        LinkedHashSet<String> labels = new LinkedHashSet<>();
        for (Term term : terms) {
            if (!term.label().isEmpty() && term.pattern().matcher(normalizedText).find()) {
                labels.add(term.label());
            }
        }
        return new ArrayList<>(labels);
    }

    /** Bỏ dấu tiếng Việt + lowercase để so khớp từ khoá ổn định. */
    private String normalize(String text) {
        if (text == null) return "";
        String lower = text.toLowerCase(Locale.ROOT).replace('đ', 'd');
        return Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("\\s+", " ");
    }

    private String sentimentLabel(String type) {
        return switch (type) {
            case "POSITIVE" -> "tích cực";
            case "NEGATIVE" -> "tiêu cực";
            default -> "trung tính";
        };
    }

    private String firstSentence(String text) {
        String[] sentences = text.split("(?<=[.?!])\\s+");
        return sentences.length > 0 && !sentences[0].isBlank() ? sentences[0].trim() : text;
    }

    private String join(List<String> values, int limit) {
        return String.join(", ", values.stream().limit(limit).toList());
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean isEmpty(List<?> value) {
        return value == null || value.isEmpty();
    }

    private boolean isEmpty(Map<?, ?> value) {
        return value == null || value.isEmpty();
    }
}
