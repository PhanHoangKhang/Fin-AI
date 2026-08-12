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
}