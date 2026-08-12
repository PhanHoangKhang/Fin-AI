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

                Trả về đúng định dạng JSON chuẩn (KHÔNG bọc trong markdown ```json):
                {
                "sentimentType": "POSITIVE",
                "sentimentScore": 88,
                "aiSummary": "Tóm tắt ngắn gọn 2 câu cô đọng nhất.",
                "marketContext": "Bối cảnh dòng tiền và tâm lý chung của ngành liên quan.",
                "reasoning": "GIẢI THÍCH CHI TIẾT VÌ SAO: Dẫn chứng dữ liệu từ tin tức, lập luận logic vì sao tin này ảnh hưởng trực tiếp đến doanh thu/lợi nhuận.",
                "catalystAnalysis": "3 Động lực tăng trưởng chính được kích hoạt từ tin tức này.",
                "riskAnalysis": "Các yếu tố rủi ro tiềm ẩn (Chi phí, vĩ mô, chốt lời ngắn hạn).",
                "macroImpact": "Ảnh hưởng từ các yếu tố Vĩ mô, Lãi suất, Tỷ giá hoặc Chính sách nhà nước.",
                
                "investorAction": "Khuyến nghị tổng quan hành động.",
                "shortTermStrategy": "Chiến lược ngắn hạn T+ (Điểm bứt phá, nhịp rũ bỏ).",
                "mediumTermStrategy": "Chiến lược 3-6 tháng (Sự tăng trưởng từ BCTC).",
                "longTermStrategy": "Chiến lược dài hạn 1-3 năm (Chu kỳ ngành).",
                "entryZone": "Vùng giá gom mua khuyến nghị",
                "targetPrice": "Giá mục tiêu kỳ vọng",
                "stopLossZone": "Mức cắt lỗ quản trị rủi ro",

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
                    "Dòng Tiền Cá Nhan": 40,
                    "Dòng Tiền Tổ Chức": 85,
                    "Xung Lực RSI": 72,
                    "Tín Hiệu MACD": 80
                },
                "keyEvents": ["Mở rộng công suất", "Công bố BCTC Q3"],
                "keywords": ["Tăng trưởng", "Định giá lại", "Khối ngoại mua ròng"]
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
        Map<String, Integer> mockChart = new LinkedHashMap<>();
        mockChart.put("Biên Lợi Nhuận", 78);
        mockChart.put("Tăng Trưởng Doanh Thu", 65);
        mockChart.put("Rủi Rõ Ngắn Hạn", 35);
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

        return NewsDetailDto.builder()
                .sentimentType("POSITIVE")
                .sentimentScore(82)
                .aiSummary(summary)
                .marketContext("Dòng tiền khối ngoại bắt đầu có dấu hiệu mua ròng trở lại ở nhóm cổ phiếu vĩ mô và đầu ngành nhờ thông tin quy hoạch mới.")
                .impactAnalysis("Giá nguyên liệu đầu vào duy trì xu hướng giảm giúp biên lợi nhuận gộp quý tới dự kiến tăng nhẹ 2.5%.")
                .investorAction("Khuyên nghị nhà đầu tư canh các nhịp điều chỉnh kỹ thuật để tích lũy cổ phiếu, hạn chế mua đuổi giá xanh mạnh.")
                .keyEvents(Arrays.asList("Công bố báo cáo tài chính", "Kế hoạch mở rộng công suất năm 2026"))
                .keywords(Arrays.asList("Tăng trưởng", "Biên lợi nhuận", "Dòng tiền"))
                .chartData(mockChart)
                .radarMetrics(radarMetrics)
                .timelineGrowthData(timelineGrowthData)
                .sentimentBreakdown(sentimentBreakdown)
                .technicalSignals(technicalSignals)
                .build();
    }
}