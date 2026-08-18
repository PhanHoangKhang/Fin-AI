package com.finai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioAlertDto {
    private String alertId;
    private String ticker;             // Ví dụ: "HPG"
    private String alertType;          // "NEGATIVE_RISK", "POSITIVE_OPPORTUNITY"
    private String title;              // Tiêu đề bài báo cào về
    private String summary;            // Nội dung tóm tắt từ NewsDto
    private String link;               // Link gốc bài báo
    private String publishedDate;
    
    private double avgPrice;           // Giá vốn người dùng mua
    private double currentPrice;       // Giá thị trường hiện tại
    private double profitLossPct;      // % Lời/Lỗ so với giá vốn
    private String suggestedAction;    // Gợi ý xử lý
}
