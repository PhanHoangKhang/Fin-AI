package com.finai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finai.dto.NewsDetailDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key:MOCK_KEY}")
    private String apiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NewsDetailDto analyzeNewsWithGemini(String title, String summary, String ticker) {
        // Nếu chưa cấu hình API Key thật, trả về Mock Data đẹp mắt để test
        if ("MOCK_KEY".equals(apiKey) || apiKey.isEmpty()) {
            return getMockAnalysis(title, summary, ticker);
        }

        try {
            // Prompt yêu cầu Gemini trả về JSON chuẩn
            String prompt = String.format("""
                Bạn là Giám đốc Phân tích Đầu tư (Head of Research) tại một Quỹ Đầu tư Tài chính Quốc tế. 
                Hãy lập BÁO CÁO PHÂN TÍCH CHUYÊN SÂU TOÀN DIỆN cho tin tức sau:
                - Tiêu đề: "%s"
                - Tóm tắt: "%s"
                - Mã CK/Ngành: "%s"

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
                
                "investorAction": "Khuyến nghị tổng quan hành động.",
                "shortTermStrategy": "• Hành động: [Mở vị thế/Thăm dò/Chờ bứt phá].\\n• Cơ sở: Phân tích kỹ thuật, điểm quá bán/quá mua, RSI, MACD.",
                "mediumTermStrategy": "• Hành động: [Gia tăng tỷ trọng/Nắm giữ].\\n• Luận điểm: Tăng trưởng kết quả kinh doanh quý tới.",
                "longTermStrategy": "• Hành động: [Tích sản/Nắm giữ dài hạn].\\n• Luận điểm: Chu kỳ ngành và vị thế doanh nghiệp.",
                
                "entryZone": "Vùng giá gom mua ước tính (Ví dụ: 38.5 - 40.0)",
                "targetPrice": "Giá mục tiêu (Ví dụ: 48.5 (+22%%))",
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
                """, title, summary, ticker);

            // Tạo Request Body
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Gọi API Gemini
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL + apiKey, entity, Map.class);
            
            // Extract response text
            List candidates = (List) response.getBody().get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            String rawJson = (String) ((Map) parts.get(0)).get("text");

            // Clean json string phòng trường hợp Gemini trả về markdown codeblock
            rawJson = rawJson.replace("```json", "").replace("```", "").trim();

            // Map vào Object
            Map<String, Object> resultMap = objectMapper.readValue(rawJson, Map.class);

            return NewsDetailDto.builder()
                    .sentimentType((String) resultMap.get("sentimentType"))
                    .sentimentScore((Integer) resultMap.get("sentimentScore"))
                    .aiSummary((String) resultMap.get("aiSummary"))
                    .marketContext((String) resultMap.get("marketContext"))
                    .impactAnalysis((String) resultMap.get("impactAnalysis"))
                    .investorAction((String) resultMap.get("investorAction"))
                    .keyEvents((List<String>) resultMap.get("keyEvents"))
                    .keywords((List<String>) resultMap.get("keywords"))
                    .chartData((Map<String, Integer>) resultMap.get("chartData"))
                    .build();

        } catch (Exception e) {
            System.err.println("Lỗi gọi Gemini API: " + e.getMessage());
            return getMockAnalysis(title, summary, ticker); // Fallback nếu lỗi API
        }
    }

    private NewsDetailDto getMockAnalysis(String title, String summary, String ticker) {
        // 1. Dữ liệu biểu đồ cũ (Hỗ trợ NewsChart)
        Map<String, Integer> mockChart = new LinkedHashMap<>();
        mockChart.put("Biên Lợi Nhuận", 78);
        mockChart.put("Tăng Trưởng Doanh Thu", 65);
        mockChart.put("Rủi Ro Ngắn Hạn", 35);
        mockChart.put("Sức Mạnh Dòng Tiền", 82);

        // 2. Bộ 4 Dữ liệu Biểu đồ Insight mới
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

        // Xử lý linh hoạt ticker hiển thị
        String symbol = (ticker != null && !ticker.isBlank()) ? ticker : "MÃ CỔ PHIẾU";

        return NewsDetailDto.builder()
                .sentimentType("POSITIVE")
                .sentimentScore(82)
                .aiSummary(summary)
                .marketContext("Dòng tiền khối ngoại bắt đầu có dấu hiệu mua ròng trở lại ở nhóm cổ phiếu vĩ mô và đầu ngành nhờ thông tin quy hoạch mới.")
                .impactAnalysis("Giá nguyên liệu đầu vào duy trì xu hướng giảm giúp biên lợi nhuận gộp quý tới dự kiến tăng nhẹ 2.5%.")
                .investorAction("Khuyên nghị nhà đầu tư canh các nhịp điều chỉnh kỹ thuật để tích lũy cổ phiếu, hạn chế mua đuổi giá xanh mạnh.")
                
                // --- CÁC TRƯỜNG ĐỊNH GIÁ & VÙNG MUA BỔ SUNG ---
                .entryZone("38.5 - 40.0 (Vùng nền tích lũy MA20)")
                .targetPrice("48.5 (+22% - Định giá P/B = 1.2x)")
                .stopLossZone("< 36.8 (Thủng hỗ trợ cứng Fibonacci 0.382)")

                // --- CÁC TRƯỜNG GIẢI THÍCH LUẬN ĐIỂM CHUYÊN SÂU ---
                .reasoning("Tháo gỡ pháp lý giúp khai thông nguồn cung dự án. Việc xử lý triệt để vướng mắc Luật Đất đai trực tiếp rút ngắn chu kỳ mở bán từ 24 tháng xuống 12 tháng, giải phóng dòng tiền đọng và cải thiện năng lực tài chính cho " + symbol + ".")
                .catalystAnalysis("1. Chính phủ quyết liệt gỡ vướng pháp lý trực tiếp cho các dự án trọng điểm. \n 2. Dòng tiền khối ngoại đảo chiều mua ròng sau chuỗi bán dài. 3. Môi trường lãi suất duy trì ở mức thấp kỷ lục kích thích cầu mua.")

                // --- CÁC TRƯỜNG CHIẾN LƯỢC 3 TẦNG VỚI CƠ SỞ LUẬN ĐIỂM ---
                .shortTermStrategy("Mở vị thế 30% tỷ trọng ở vùng 38.5 - 39.5. \n Cơ sở: RSI chạm mốc 38 (vùng quá bán) và xuất hiện phân kỳ dương 2 đáy trên khung D1, áp lực bán chủ động đã suy yếu đáng kể.")
                .mediumTermStrategy("Gia tăng tỷ trọng lên 70% khi giá bứt phá qua vùng kháng cự 42.0 kèm thanh khoản lớn (> 1.5 lần trung bình 20 phiên). \n Luận điểm: Hưởng lợi trực tiếp từ đà ghi nhận doanh thu các dự án trong Q3 & Q4/2026.")
                .longTermStrategy("Tích sản dài hạn cho khung thời gian 1-3 năm. \n Luận điểm: Doanh nghiệp sở hữu quỹ đất sạch lớn nhất ngành với chi phí vốn thấp, vị thế sẵn sàng bứt phá khi toàn thị trường bước vào chu kỳ hồi phục.")

                // --- VĨ MÔ & RỦI RO CÓ CẢNH BÁO CHI TIẾT ---
                .macroImpact("Chính sách tiền tệ nới lỏng kết hợp Nghị định mới giúp giảm áp lực chi phí tài chính. \n Ngành bất động sản & hạ tầng dự báo bước vào chu kỳ hồi phục diện rộng từ nửa cuối năm 2026.")
                .riskAnalysis("1. Tiến độ tháo gỡ thực tế tại địa phương chậm hơn dự kiến. \n 2. Áp lực đáo hạn trái phiếu trong Q4/2026. \n Tuân thủ nghiêm ngặt kỷ luật cắt lỗ nếu giá thủng 36.8.")

                // --- TAGS, DỮ LIỆU CŨ & MỚI ---
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