package com.finai.service;

import com.finai.dto.StockInfoDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class StockService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_SERVICE_URL = "http://localhost:8001/api/stock";

    // 1. Lấy thông tin công ty từ Python
    public StockInfoDto getStockInfo(String ticker) {
        try {
            String url = PYTHON_SERVICE_URL + "/info/" + ticker;
            return restTemplate.getForObject(url, StockInfoDto.class);
        } catch (Exception e) {
            System.err.println("Lỗi gọi Python Service: " + e.getMessage());
            return null;
        }
    }

    // 2. Lấy giá lịch sử từ Python
    public Object getStockPriceHistory(String ticker) {
        try {
            String url = PYTHON_SERVICE_URL + "/price/" + ticker;
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            System.err.println("Lỗi gọi Python Service: " + e.getMessage());
            return null;
        }
    }

    public Object getTickerList(String tickers) {
        try {
            String url = PYTHON_SERVICE_URL + "/ticker-list?tickers=" + tickers;
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            System.err.println("Lỗi gọi Python Service Ticker: " + e.getMessage());
            return null;
        }
    }
}