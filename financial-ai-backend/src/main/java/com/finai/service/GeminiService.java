package com.finai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finai.dto.NewsDetailDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key:MOCK_KEY}")
    private String apiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** Bộ bóc tách rule-based, dùng khi không gọi được Gemini. */
    @Autowired
    private NewsInsightExtractor insightExtractor;

    // Constructor: Cấu hình RestTemplate có Timeout chống treo App
    public GeminiService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000); // Chờ kết nối 10 giây
        factory.setReadTimeout(45000);    // Chờ Gemini suy nghĩ và trả về full báo cáo trong 45 giây
        this.restTemplate = new RestTemplate(factory);
    }

    public NewsDetailDto analyzeNewsWithGemini(String title, String summary, String ticker) {
        if ("MOCK_KEY".equals(apiKey) || apiKey == null || apiKey.isBlank()) {
            // Chưa cấu hình API key -> dựng báo cáo từ chính nội dung bài báo
            return insightExtractor.buildAnalysis(title, summary, ticker);
        }

        try {
            String safeTitle = title != null ? title.replace("\"", "'") : "";
            String safeSummary = summary != null ? summary.replace("\"", "'") : "";
            String safeTicker = ticker != null ? ticker.replace("\"", "'") : "N/A";

            String promptTemplate = """
                Bạn là Giám đốc Phân tích Đầu tư (Head of Research) tại một Quỹ Đầu tư Tài chính Quốc tế. 
                Hãy lập BÁO CÁO PHÂN TÍCH CHUYÊN SÂU TOÀN DIỆN cho tin tức sau:
                - Tiêu đề: "{{TITLE}}"
                - Tóm tắt: "{{SUMMARY}}"
                - Mã CK/Ngành: "{{TICKER}}"

                QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
                1. Trả về ĐÚNG định dạng JSON thuần túy (KHÔNG bọc trong markdown ```json).
                2. Tuyệt đối KHÔNG dùng dấu ngoặc kép " bên trong các giá trị String, hãy dùng dấu ngoặc đơn ' nếu cần.
                3. Các trường (reasoning, catalystAnalysis, shortTermStrategy, mediumTermStrategy, longTermStrategy, macroImpact, riskAnalysis) BẮT BUỘC phải dùng ký tự '\\n' để ngắt dòng từng gạch đầu dòng (•), giúp xuống dòng rõ ràng.

                CẤU TRÚC JSON MẪU YÊU CẦU:
                {
                  "sentimentType": "POSITIVE",
                  "sentimentScore": 85,
                  "aiSummary": "Tóm tắt ngắn gọn 2 câu cô đọng nhất về nội dung tin tức.",
                  "marketContext": "Bối cảnh dòng tiền và tâm lý chung của ngành liên quan.",
                  
                  "reasoning": "• Luận điểm 1: Lập luận logic và dẫn chứng từ tin tức.\\n• Luận điểm 2: Phân tích ảnh hưởng trực tiếp đến doanh thu/lợi nhuận.\\n• Luận điểm 3: Đánh giá chất lượng tài sản hoặc dòng tiền.",
                  "catalystAnalysis": "• Động lực 1: Tác động từ chính sách/vĩ mô.\\n• Động lực 2: Tín hiệu từ khối ngoại/tổ chức.\\n• Động lực 3: Yếu tố đột biến doanh thu.",
                  "riskAnalysis": "• Rủi ro 1: Yếu tố vĩ mô/chi phí đầu vào.\\n• Rủi ro 2: Áp lực chốt lời ngắn hạn.\\n• Cảnh báo: Nguyên tắc quản trị vốn và cắt lỗ.",
                  "macroImpact": "• Tác động 1: Môi trường lãi suất và tỷ giá.\\n• Tác động 2: Chính sách ngành liên quan.",
                  
                  "investorAction": "Khuyên nghị tổng quan hành động.",
                  "shortTermStrategy": "• Hành động: [Mở vị thế/Thăm dò/Chờ bứt phá].\\n• Cơ sở: Phân tích kỹ thuật, điểm quá bán/quá mua, RSI, MACD.",
                  "mediumTermStrategy": "• Hành động: [Gia tăng tỷ trọng/Nắm giữ].\\n• Luận điểm: Tăng trưởng kết quả kinh doanh quý tới.",
                  "longTermStrategy": "• Hành động: [Tích sản/Nắm giữ dài hạn].\\n• Luận điểm: Chu kỳ ngành và vị thế doanh nghiệp.",
                  
                  "entryZone": "Vùng giá gom mua ước tính (Ví dụ: 38.5 - 40.0)",
                  "targetPrice": "Giá mục tiêu (Ví dụ: 48.5 (+22%))",
                  "stopLossZone": "Mức cắt lỗ (Ví dụ: < 36.8)",

                  "radarMetrics": {
                      "Định Giá FCFF": 75,
                      "Sức Mạnh Tài Chính": 85,
                      "Tăng Trưởng EPS": 90,
                      "Lợi Thế Cạnh Tranh": 80,
                      "Sức Mạnh Dòng Tiền": 88
                  },
                  "timelineGrowthData": {
                      "Q1/2026": 50,
                      "Q2/2026": 65,
                      "Q3/2026 (Dự báo)": 82,
                      "Q4/2026 (Dự báo)": 95
                  },
                  "sentimentBreakdown": {
                      "Tích cực": 70,
                      "Trung tính": 20,
                      "Tiêu cực": 10
                  },
                  "technicalSignals": {
                      "Dòng Tiền Cá Nhân": 40,
                      "Dòng Tiền Tổ Chức": 85,
                      "Xung Lực RSI": 72,
                      "Tín Hiệu MACD": 80
                  },
                  "keyEvents": ["Sự kiện 1", "Sự kiện 2"],
                  "keywords": ["TăngTrưởng", "ĐịnhGiá", "DongTienToChuc"]
                }
                """;

            String prompt = promptTemplate
                    .replace("{{TITLE}}", safeTitle)
                    .replace("{{SUMMARY}}", safeSummary)
                    .replace("{{TICKER}}", safeTicker);

            // Bổ sung generationConfig để ÉP Gemini trả về JSON chuẩn
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                    "responseMimeType", "application/json"
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 1. Gọi API Gemini
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL + apiKey, entity, Map.class);

            // 2. Validate Response Body
            if (response.getBody() == null || !response.getBody().containsKey("candidates")) {
                throw new RuntimeException("Gemini API trả về phản hồi rỗng.");
            }

            // 3. Extract JSON an toàn
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("Candidates bị rỗng từ Gemini.");
            }

            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String rawJson = (String) parts.get(0).get("text");

            // 4. Clean Markdown Codeblock
            if (rawJson != null) {
                rawJson = rawJson.trim();
                if (rawJson.startsWith("```json")) rawJson = rawJson.substring(7);
                else if (rawJson.startsWith("```")) rawJson = rawJson.substring(3);
                if (rawJson.endsWith("```")) rawJson = rawJson.substring(0, rawJson.length() - 3);
                rawJson = rawJson.trim();
            }

            // 5. Parse JSON
            Map<String, Object> resultMap = objectMapper.readValue(rawJson, Map.class);

            // Helpers ép kiểu an toàn
            java.util.function.Function<Object, Integer> toInt = obj -> {
                if (obj instanceof Number) return ((Number) obj).intValue();
                return 0;
            };

            java.util.function.Function<Object, Map<String, Integer>> toIntMap = obj -> {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    Map<String, Integer> result = new LinkedHashMap<>();
                    map.forEach((k, v) -> {
                        if (k != null && v instanceof Number) {
                            result.put(k.toString(), ((Number) v).intValue());
                        }
                    });
                    return result;
                }
                return new LinkedHashMap<>();
            };

            return NewsDetailDto.builder()
                    .sentimentType((String) resultMap.getOrDefault("sentimentType", "NEUTRAL"))
                    .sentimentScore(toInt.apply(resultMap.get("sentimentScore")))
                    .aiSummary((String) resultMap.get("aiSummary"))
                    .marketContext((String) resultMap.get("marketContext"))
                    .investorAction((String) resultMap.get("investorAction"))

                    .reasoning((String) resultMap.get("reasoning"))
                    .catalystAnalysis((String) resultMap.get("catalystAnalysis"))
                    .riskAnalysis((String) resultMap.get("riskAnalysis"))
                    .macroImpact((String) resultMap.get("macroImpact"))

                    .shortTermStrategy((String) resultMap.get("shortTermStrategy"))
                    .mediumTermStrategy((String) resultMap.get("mediumTermStrategy"))
                    .longTermStrategy((String) resultMap.get("longTermStrategy"))
                    .entryZone((String) resultMap.get("entryZone"))
                    .targetPrice((String) resultMap.get("targetPrice"))
                    .stopLossZone((String) resultMap.get("stopLossZone"))

                    .radarMetrics(toIntMap.apply(resultMap.get("radarMetrics")))
                    .timelineGrowthData(toIntMap.apply(resultMap.get("timelineGrowthData")))
                    .sentimentBreakdown(toIntMap.apply(resultMap.get("sentimentBreakdown")))
                    .technicalSignals(toIntMap.apply(resultMap.get("technicalSignals")))
                    .chartData(toIntMap.apply(resultMap.get("chartData")))

                    .keyEvents((List<String>) resultMap.get("keyEvents"))
                    .keywords((List<String>) resultMap.get("keywords"))
                    .build();

        } catch (Exception e) {
            System.err.println("Lỗi gọi Gemini API (Chuyển sang bóc tách từ nội dung bài báo): " + e.getMessage());
            return insightExtractor.buildAnalysis(title, summary, ticker); // Fallback an toàn
        }
    }

    private NewsDetailDto getMockAnalysis(String title, String summary, String ticker) {
        Map<String, Integer> mockChart = new LinkedHashMap<>();
        mockChart.put("Biên Lợi Nhuận", 78);
        mockChart.put("Tăng Trưởng Doanh Thu", 65);
        mockChart.put("Rủi Ro Ngắn Hạn", 35);
        mockChart.put("Sức Mạnh Dòng Tiền", 82);

        Map<String, Integer> radarMetrics = new LinkedHashMap<>();
        radarMetrics.put("Định Giá FCFF", 75);
        radarMetrics.put("Sức Mạnh Tài Chính", 85);
        radarMetrics.put("Tăng Trưởng EPS", 90);
        radarMetrics.put("Lợi Thế Cạnh Tranh", 80);
        radarMetrics.put("Sức Mạnh Dòng Tiền", 88);

        Map<String, Integer> timelineGrowthData = new LinkedHashMap<>();
        timelineGrowthData.put("Q1/2026", 50);
        timelineGrowthData.put("Q2/2026", 65);
        timelineGrowthData.put("Q3/2026 (Dự báo)", 82);
        timelineGrowthData.put("Q4/2026 (Dự báo)", 95);

        Map<String, Integer> sentimentBreakdown = new LinkedHashMap<>();
        sentimentBreakdown.put("Tích cực", 70);
        sentimentBreakdown.put("Trung tính", 20);
        sentimentBreakdown.put("Tiêu cực", 10);

        Map<String, Integer> technicalSignals = new LinkedHashMap<>();
        technicalSignals.put("Dòng Tiền Cá Nhân", 40);
        technicalSignals.put("Dòng Tiền Tổ Chức", 85);
        technicalSignals.put("Xung Lực RSI", 72);
        technicalSignals.put("Tín Hiệu MACD", 80);

        String symbol = (ticker != null && !ticker.isBlank()) ? ticker : "MÃ CỔ PHIẾU";

        return NewsDetailDto.builder()
                .sentimentType("POSITIVE")
                .sentimentScore(82)
                .aiSummary(summary)
                .marketContext("Dòng tiền khối ngoại bắt đầu có dấu hiệu mua ròng trở lại ở nhóm cổ phiếu vĩ mô và đầu ngành nhờ thông tin quy hoạch mới.")
                .investorAction("Khuyến nghị nhà đầu tư canh các nhịp điều chỉnh kỹ thuật để tích lũy cổ phiếu, hạn chế mua đuổi giá xanh mạnh.")
                
                .entryZone("38.5 - 40.0 (Vùng nền tích lũy MA20)")
                .targetPrice("48.5 (+22% - Định giá P/B = 1.2x)")
                .stopLossZone("< 36.8 (Thủng hỗ trợ cứng Fibonacci 0.382)")

                .reasoning("Tháo gỡ pháp lý giúp khai thông nguồn cung dự án. Việc xử lý triệt để vướng mắc Luật Đất đai trực tiếp rút ngắn chu kỳ mở bán từ 24 tháng xuống 12 tháng, giải phóng dòng tiền đọng và cải thiện năng lực tài chính cho " + symbol + ".")
                .catalystAnalysis("• Chính phủ quyết liệt gỡ vướng pháp lý trực tiếp cho các dự án trọng điểm.\n• Dòng tiền khối ngoại đảo chiều mua ròng sau chuỗi bán dài.\n• Môi trường lãi suất duy trì ở mức thấp kỷ lục kích thích cầu mua.")

                .shortTermStrategy("• Hành động: Mở vị thế 30% tỷ trọng ở vùng 38.5 - 39.5.\n• Cơ sở: RSI chạm mốc 38 (vùng quá bán) và xuất hiện phân kỳ dương 2 đáy trên khung D1, áp lực bán chủ động đã suy yếu đáng kể.")
                .mediumTermStrategy("• Hành động: Gia tăng tỷ trọng lên 70% khi giá bứt phá qua vùng kháng cự 42.0 kèm thanh khoản lớn (> 1.5 lần trung bình 20 phiên).\n• Luận điểm: Hưởng lợi trực tiếp từ đà ghi nhận doanh thu các dự án trong Q3 & Q4/2026.")
                .longTermStrategy("• Hành động: Tích sản dài hạn cho khung thời gian 1-3 năm.\n• Luận điểm: Doanh nghiệp sở hữu quỹ đất sạch lớn nhất ngành với chi phí vốn thấp, vị thế sẵn sàng bứt phá khi toàn thị trường bước vào chu kỳ hồi phục.")

                .macroImpact("• Chính sách tiền tệ nới lỏng kết hợp Nghị định mới giúp giảm áp lực chi phí tài chính.\n• Ngành bất động sản & hạ tầng dự báo bước vào chu kỳ hồi phục diện rộng từ nửa cuối năm 2026.")
                .riskAnalysis("• Tiến độ tháo gỡ thực tế tại địa phương chậm hơn dự kiến.\n• Áp lực đáo hạn trái phiếu trong Q4/2026.\n• Cảnh báo: Tuân thủ nghiêm ngặt kỷ luật cắt lỗ nếu giá thủng 36.8.")

                .keyEvents(Arrays.asList("Công bố báo cáo tài chính Q2/2026", "Nghị định tháo gỡ Luật Đất Đai có hiệu lực", "Kế hoạch mở rộng công suất 2026"))
                .keywords(Arrays.asList(symbol, "LuatDatDai", "ThaoGoPhapLy", "TangTruongEPS", "GiaiNganToChuc"))
                .chartData(mockChart)
                .radarMetrics(radarMetrics)
                .timelineGrowthData(timelineGrowthData)
                .sentimentBreakdown(sentimentBreakdown)
                .technicalSignals(technicalSignals)
                .build();
    }
}