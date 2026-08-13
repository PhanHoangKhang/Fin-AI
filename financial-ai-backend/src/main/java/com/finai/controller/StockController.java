package com.finai.controller;

import com.finai.dto.StockInfoDto;
import com.finai.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stocks")
@CrossOrigin(origins = "*") // Mở CORS cho React kết nối
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/{ticker}/info")
    public ResponseEntity<StockInfoDto> getStockInfo(@PathVariable String ticker) {
        StockInfoDto info = stockService.getStockInfo(ticker);
        if (info == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(info);
    }

    @GetMapping("/{ticker}/price")
    public ResponseEntity<?> getStockPrice(@PathVariable String ticker) {
        Object priceData = stockService.getStockPriceHistory(ticker);
        return ResponseEntity.ok(priceData);
    }
}