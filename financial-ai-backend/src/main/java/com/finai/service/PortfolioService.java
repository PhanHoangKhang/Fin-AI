package com.finai.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class PortfolioService {
    // Sim Giá vốn người dùng mua: HPG giá 25.500, FPT giá 115.000, VNM giá 68.000
    public Map<String, Double> getUserPortfolio(String userId) {
        Map<String, Double> portfolio = new HashMap<>();
        portfolio.put("HPG", 25.5);
        portfolio.put("FPT", 115.0);
        portfolio.put("VNM", 68.0);
        return portfolio;
    }

    // Sim Giá thị trường hiện tại
    public double getCurrentMarketPrice(String ticker) {
        switch (ticker) {
            case "HPG": return 24.1;  // HPG bị lỗ so với giá vốn 25.5
            case "FPT": return 122.0; // FPT đang lời
            case "VNM": return 67.5;
            default: return 20.0;
        }
    }
}
