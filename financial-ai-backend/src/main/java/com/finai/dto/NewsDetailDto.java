package com.finai.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class NewsDetailDto extends NewsDto {
    private String marketContext;
    private String recommendation;
    private String impactAnalysis;
    private String investorAction; // Khuyên nghị F0
    
    // Dữ liệu cho biểu đồ (Chart Data)
    // Ví dụ: key = "Dự báo tăng trưởng Q3", value = 85
    private Map<String, Integer> chartData;
    private List<String> keyEvents;  // Các mốc sự kiện chính
    // 2. Giải thích Chuyên sâu (Deep Explanation & Reasoning)
    private String reasoning;          // Vì sao AI kết luận như vậy?
    private String catalystAnalysis;   // Động lực chính đẩy giá (Catalysts)
    private String riskAnalysis;       // Chi tiết các rủi ro (Risks)
    private String macroImpact;        // Tác động vĩ mô & Tỷ giá/Lãi suất liên quan

    // 3. Khuyến nghị & Chiến lược chi tiết (Recommendations & Actionable Strategies)
    private String shortTermStrategy;  // Lướt sóng / Ngắn hạn T+
    private String mediumTermStrategy; // Trung hạn (3 - 6 tháng)
    private String longTermStrategy;   // Dài hạn (Tích sản / 1-3 năm)
    private String entryZone;          // Vùng giá mua khuyến nghị (Ví dụ: "42.0 - 43.5")
    private String targetPrice;        // Giá mục tiêu (Ví dụ: "52.0 (+21%)")
    private String stopLossZone;       // Vùng cắt lỗ (Ví dụ: "< 39.5")

    // 4. Các Biểu Đồ Insight (Chart Data Collections)
    private Map<String, Integer> radarMetrics;        // Chart 1: Radar Chart (Chỉ số 360 độ)
    private Map<String, Integer> timelineGrowthData;  // Chart 2: Area Chart (Dự báo tăng trưởng qua các quý)
    private Map<String, Integer> sentimentBreakdown;  // Chart 3: Donut Chart (Cấu trúc tâm lý thị trường)
    private Map<String, Integer> technicalSignals;    // Chart 4: Bar Chart (Tín hiệu Kỹ thuật RCI, MACD, Volume)
}