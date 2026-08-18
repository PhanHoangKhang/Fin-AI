package com.finai.controller;

import com.finai.dto.PortfolioAlertDto;
import com.finai.service.PortfolioAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class PortfolioAlertController {
    
    @Autowired
    private PortfolioAlertService alertService;

    // Frontend gọi ngắn gọn: GET http://localhost:8080/api/alerts/my-alerts
    @GetMapping("/my-alerts")
    public ResponseEntity<List<PortfolioAlertDto>> getMyPortfolioAlerts() {
        String hardcodedUserId = "user_demo_01";
        List<PortfolioAlertDto> alerts = alertService.generateAlertsForUser(hardcodedUserId);
        return ResponseEntity.ok(alerts);
    }
}
