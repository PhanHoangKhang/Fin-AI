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
                Bạn là một chuyên gia phân tích tài chính chứng khoán hàng đầu. Hãy phân tích bài báo sau:
                Tiêu đề: "%s"
                Nội dung ngắn: "%s"
                Mã cổ phiếu/Ngành: "%s"

                Hãy trả về dữ liệu đúng định dạng JSON sau (không chứa markdown ```json):
                {
                  "sentimentType": "POSITIVE/NEGATIVE/NEUTRAL",
                  "sentimentScore": 85,
                  "aiSummary": "Tóm tắt ngắn gọn 2 câu dễ hiểu nhất",
                  "marketContext": "Bối cảnh thị trường và động lực giá",
                  "impactAnalysis": "Tác động chi tiết tới doanh nghiệp/ngành",
                  "investorAction": "Khuyến nghị hành động cho nhà đầu tư",
                  "keyEvents": ["Sự kiện 1", "Sự kiện 2"],
                  "keywords": ["Từ khóa 1", "Từ khóa 2"],
                  "chartData": {
                    "Biên lợi nhuận": 75,
                    "Áp lực chi phí": 40,
                    "Kỳ vọng tăng trưởng": 85
                  }
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
                .build();
    }
}