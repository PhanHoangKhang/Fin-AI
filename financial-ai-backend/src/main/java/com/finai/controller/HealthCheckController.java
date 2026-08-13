package com.finai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController // Phải có annotation này
@RequestMapping("/api/v1") // Phải có / ở đầu
public class HealthCheckController {

    @GetMapping("/health") // Phải có / ở đầu
    public Map<String, String> healthCheck() {
        return Map.of(
            "status", "UP",
            "message", "FinAI Spring Boot Backend running smoothly!"
        );
    }
}